import "expect.js" as expect;
import {eventStream} from "../lib/event-stream";

var testStream = function(fn){
  return eventStream(function(sink){
    fn = fn.bind(null, sink);
    setTimeout(fn, 100);
  });
}

var test = {
  'Event Stream': {
    'always sends updates on next value': function(done){
      var value = "blah";

      var stream = eventStream(function(sink){
        setTimeout(function(){
          sink({ value: value });
          done();
        }, 100);
      });

      stream.onValue(function(actual){
        expect(actual).to.eql(value);
      });

    },
    'sends updates to multiple listeners': function(done){
      var value = "blah";

      var stream = testStream(function(sink){
        sink({value: value});
      });

      stream.onValue(function(actual){
        expect(actual).to.eql(value);
      });

      stream.onValue(function(actual){
        expect(actual).to.eql(value);
        done();
      });

    },
    'sends update when done': function(done){
      var value = "blah";

      var stream = testStream(function(sink){
        sink({value: value, done: true});
      });

      stream.onDone(function(){
        done();
      });
    }
  }
};

export = test;
