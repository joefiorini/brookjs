import {dispatcher} from "lib/dispatcher";
import {eventStream} from "lib/event-stream";
import {next,done,error} from "lib/event";

var Brook = {
  dispatcher: dispatcher,
  stream: eventStream,
  next: next,
  done: done,
  error: error
};

window.Brook = Brook;

export = Brook;
