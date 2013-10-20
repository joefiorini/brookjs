import {dispatcher} from "brook/dispatcher";
import {eventStream} from "brook/event-stream";
import {next,done,error} from "brook/event";

var Brook = {
  dispatcher: dispatcher,
  stream: eventStream,
  next: next,
  done: done,
  error: error
};

export default = Brook;
