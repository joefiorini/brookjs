
define('brook/dispatcher',
  ["exports"],
  function(__exports__) {
    
    function dispatcher(subscribe){

      var self = {}, subscribers = [];

      self.push = function(e){
        subscribers.forEach(function(s){
          s(e);
        });
      };

      self.subscribe = function(subscriber){
        subscribers = subscribers.concat(subscriber);

        if(subscribers.length == 1){
          // All subscribers will push to stream when they call
          //  their sink() function; sink is "push".
          subscribe(self.push);
        }
      };

      self.subscribed = function(test){
        return subscribers.indexOf(test) >= 0;
      };

      return Object.create(self);

    }

    __exports__.dispatcher = dispatcher;
  });
define('brook/event-stream',
  ["brook/dispatcher","exports"],
  function(__dependency1__, __exports__) {
    
    var dispatcher = __dependency1__.dispatcher;

    function eventStream(subscribe){

      var self = {}, dispatch;

      subscribe = dispatcher(subscribe).subscribe;

      self.onValue = function(fn){
        return subscribe(function(e){
          return fn(e.value);
        });
      };

      self.onError = function(fn){
        return subscribe(function(e){
          if(e.failed){
            return fn(e.value);
          }
        });
      };

      self.onDone = function(fn){
        return subscribe(function(e){
          if(e.done){
            return fn();
          }
        });
      };

      return Object.create(self);

    }

    __exports__.eventStream = eventStream;
  });
define('brook/event',
  ["exports"],
  function(__exports__) {
    
    function event(value){
      var o = {
      value: value,
      done: false,
      failed: false
      };
      return Object.create(o);
    }

    function done(){
      var e = event();
      e.done = true;
      return e;
    }

    function next(value){
      var e = event(value);
      return e;
    }

    function error(err){
      var e = event(err);
      e.failed = true;
      return e;
    }

    __exports__.done = done;
    __exports__.next = next;
    __exports__.error = error;
  });
define('brook',
  ["brook/dispatcher","brook/event-stream","brook/event","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    
    var dispatcher = __dependency1__.dispatcher;
    var eventStream = __dependency2__.eventStream;
    var next = __dependency3__.next;
    var done = __dependency3__.done;
    var error = __dependency3__.error;

    var Brook = {
      dispatcher: dispatcher,
      stream: eventStream,
      next: next,
      done: done,
      error: error
    };

    __exports__['default'] = Brook;
  });
define('brook-reactor/reaction',
  ["brook/event-stream","brook/event","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    
    var eventStream = __dependency1__.eventStream;
    var next = __dependency2__.next;
    var done = __dependency2__.done;
    var error = __dependency2__.error;

    function reaction(){

      var self = {}, push;

      var stream = eventStream(function(sink){
        push = sink;
      });

      stream.push = function(value){
        push(next(value));
      };

      stream.error = function(err){
        push(error(value));
      };

      stream.done = function(value){
        push(done());
      };

      return stream;
    }

    __exports__.reaction = reaction;
  });
define('brook-reactor',
  ["brook","brook-reactor/reaction","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    
    var Brook = __dependency1__.default;
    var reaction = __dependency2__.reaction;

    Brook.reaction = reaction;

    __exports__['default'] = Brook;
  });