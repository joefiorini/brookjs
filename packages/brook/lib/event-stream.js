import {dispatcher} from "./dispatcher";

function init(subscribe){

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

export = { eventStream: init };
