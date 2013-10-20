import {eventStream} from "brook/event-stream";
import {next, done, error} from "brook/event";

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

export { reaction };
