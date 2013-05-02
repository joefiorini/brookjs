import "expect.js" as expect;
import {dispatcher} from "../lib/dispatcher";

var subject, nop = function(){};

var test = {
  'Dispatcher': {
    'subscribing': {
      'knows that I am subscribed': function(){
        var subscriber;

        subscriber = function(){
        };

        subject = dispatcher(nop);
        subject.subscribe(subscriber);

        expect(subject.subscribed(subscriber)).to.be.ok();
      },
      'knows that I am not subscribed': function(){
        subject = dispatcher();

        expect(subject.subscribed(function(){})).not.to.be.ok();
      }
    },
    'pushing values': {
      'allows initial subscriber to push from subscriptions': function(done){
        subject = dispatcher(function(sink){
          expect(sink).to.eql(subject.push);
          done();
        });

        subject.subscribe(nop);
      },
      'pushes to a single subscriber': function(done){
        var subscriber, sink;

        subject = dispatcher(function(s){
          sink = s;
        });

        subject.subscribe(function(value){
          expect(value).to.eql("foo");
          done();
        });

        sink("foo");
      }
    }
  }
};

export = test;
