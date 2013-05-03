import "expect.js" as expect;
import {done, next, error} from "../lib/event";

var subject, nop = function(){};

var test = {
  'Event': {
    '"next" just wraps value for stream': function(){
      var actual = next("blah");
      expect(actual.value).to.eql("blah");
    },
    '"done" sets done to true': function(){
      var actual = done("blah");
      expect(actual.done).to.be.ok();
    }
  },
  '"error" passes error as value': function(){
    var actual = error("problem");
    expect(actual.failed).to.be.ok();
    expect(actual.value).to.eql("problem");
  }
};

export = test;
