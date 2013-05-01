/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.loadNpmTasks("grunt-es6-module-transpiler");

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
        var brookPath = base + "/../dist/triforce.js";
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
      brook: {
        options: {
          baseUrl: "tmp/brook",
          modules: [{ name: "brook" }],
          paths: {
            "brook": "index"
          },
          optimize: 'none',
          preserveLicenseComments: false,
          dir: "dist/"
        }
      }
    },

    transpile: {
      main: {
        type: "amd",
        files: [{
          expand: true,
          cwd: 'packages',
          src: ['**/*.js'],
          dest: 'tmp/'
        }]
      },
      enable: {
      }
    },

    watch: {
      tests: {
        files: ['packages/*/tests/**/*.js', 'packages/**/*.js', 'vendor/**/*.js'],
        tasks: ['jshint', 'qunit']
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
          port: 9001,
          base: 'examples',
          keepalive: true,
          middleware: function(connect, options){
            return [
              servebrook(options.base),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    }

  });

  grunt.registerTask('test', ['transpile:enable', 'simplemocha:all']);
  grunt.registerTask('default', ['connect:server', 'watch']);
  grunt.registerTask('build', ['transpile', 'requirejs', 'copy']);

};