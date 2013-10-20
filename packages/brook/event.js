function event(value){
  var o = {
  value: value,
  done: false,
  failed: false
  };
  return Object.create(o);
}

function done(){
  var e = event();
  e.done = true;
  return e;
}

function next(value){
  var e = event(value);
  return e;
}

function error(err){
  var e = event(err);
  e.failed = true;
  return e;
}

export {done, next, error};

