import {dispatcher} from "lib/dispatcher";
import {stream} from "lib/event-stream";
import {next,done,error} from "lib/event";

var Brook = {
  dispatcher: dispatcher,
  stream: stream,
  next: next,
  done: done,
  error: error
};

window.Brook = Brook;

export = Brook;
