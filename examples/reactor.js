var Brook = require("../dist/brook");
var reaction = require("../dist/brook-reactor");

console.log(reaction);

var reactor = {
  changed: reaction(),
  started: reaction(),
  completed: reaction()
};

var doChange = function(){
  reactor.changed.push({ old: "blah", "new": "diddy" });
};

var doStart = function(){
  reactor.started.push();
};

var doComplete = function(){
  reactor.completed.push({ blah: "diddy" });
  setTimeout(reactor.completed.done, 6000);
};

var doError = function(){
  reactor.started.error("Could not start");
};

reactor.started.onValue(function(){
  console.log("started");
});

reactor.changed.onValue(function(changes){
  console.log("changed", changes);
});

reactor.completed.onValue(function(data){
  console.log("completed with: ", data);
});

reactor.started.onError(function(error){
  console.log("error starting: ", error);
});

reactor.completed.onDone(function(){
  console.log("done completing");
});

setTimeout(doStart, 1000);
setTimeout(doChange, 3000);
setTimeout(doComplete, 5000);
setTimeout(doChange, 7000);
setTimeout(doError, 9000);

