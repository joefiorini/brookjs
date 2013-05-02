function init(subscribe){

  var me = {}, subscribers = [];

  me.push = function(e){
    subscribers.forEach(function(s){
      s(e);
    });
  };

  me.subscribe = function(subscriber){
    subscribers = subscribers.concat(subscriber);

    if(subscribers.length == 1){
      // All subscribers will push to stream when they call
      //  their sink() function; sink is "push".
      subscribe(me.push);
    }
  };

  me.subscribed = function(test){
    return subscribers.indexOf(test) >= 0;
  };

  return Object.create(me);

}

export = { dispatcher: init };
