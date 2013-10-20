/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-requirejs");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.loadNpmTasks("grunt-es6-module-transpiler");
  grunt.loadNpmTasks("grunt-contrib-clean");

  function serveBrook(base){
    function serveFile(res, next, path){
      fs.readFile(path, function(err,data){
        if(!err){
          res.end(data);
        } else {
          return next();
        }
      });
    }

    return function(req, res, next){

      var path;

      serveFile1 = serveFile.bind(this, res, next);

      if(req.url == "/brook-latest.js"){
        fs = require("fs");
        var brookPath = base + "/../dist/brook.js";
        serveFile1(brookPath);
      } else if(req.url == "/brook-reactor-latest.js"){
        fs = require("fs");
        var brookPath = base + "/../dist/brook-reactor.js";
        serveFile1(brookPath);
      } else if(req.url.match(/\.map$/)){
        path = base + "/../dist" + req.url;
        serveFile1(path);
      } else if(req.url.match(/\.src$/)){
        path = base + "/../dist" + req.url;
        serveFile1(path);
      } else {
        return next();
      }
    };
  }

  grunt.initConfig({
    jshint: {
      all: ['!Gruntfile.js', 'packages/**/*.js', 'packages/*/tests/**/*.js', '!vendor/*.*', '!tests/vendor/*.*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

   simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        // grep: '*-test',
        ui: 'exports',
        reporter: 'tap'
      },

      all: { src: ['packages/*/test/**/*.js'] },
      brook: { src: ['packages/brook/**/*.js'] }
    },

    requirejs: {
      options: {
          // almond: true,
          optimize: 'none',
          paths: {
            "brook": "brook",
            "brook-reactor": "brook-reactor"
          },
          baseUrl: "tmp"
          // wrap: {
          //   startFile: "build/start.frag",
          //   endFile: "build/end.frag"
          // }
      },
      brook: {
        options: {
          include: ["brook"],
          out: "dist/brook.js"
        }
      },
      brookMin: {
        options: {
          optimize: "uglify",
          include: ["brook"],
          out: "dist/brook.min.js"
        }
      },
      reactor: {
        options: {
          include: ["brook-reactor"],
          out: "dist/brook-reactor.js"
          // wrap: {
          //   startFile: "build/start.frag",
          //   endFile: "build/end-reactor.frag"
          // }
        }
      }
    },

    transpile: {
      main: {
        type: "amd",
        anonymous: true,
        files: [{
          expand: true,
          cwd: 'packages',
          src: ['**/*.js'],
          dest: 'tmp/'
        }]
      }
    },

    clean: ['dist', 'tmp'],

    watch: {
      tests: {
        files: ['packages/*/tests/**/*.js', 'packages/**/*.js', 'vendor/**/*.js'],
        tasks: ['jshint', 'test']
      }
    },

    copy: {
      main: {
        files: [
          { src: "tmp/main.js", dest: "dist/brook.js" },
          { src: "tmp/*.map", dest: "dist/", flatten: true, expand: true, filter: "isFile" },
          { src: "tmp/*.src", dest: "dist/", flatten: true, expand: true, filter: "isFile" }
        ]
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      },
      examples: {
        options: {
          port: 9000,
          base: 'examples',
          keepalive: true,
          middleware: function(connect, options){
            return [
              serveBrook(options.base),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    }

  });

  grunt.registerTask('test', ['transpile:enable', 'simplemocha:all']);
  grunt.registerTask('default', ['connect:examples', 'watch']);
  grunt.registerTask('build', ['transpile:main', 'requirejs', 'copy']);

};
