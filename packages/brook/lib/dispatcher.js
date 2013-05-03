function init(subscribe){

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

export = { dispatcher: init };
