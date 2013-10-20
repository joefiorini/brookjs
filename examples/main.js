define(['brook-reactor', 'jquery'], function(Brook, $) {
  // This example doesn't show the full power of event streams.
  //  It's just to show how to wrap an asynchronous operation in
  //  in a stream. As Brook gets more advanced we'll see much
  //  more use from streams than this simple example.
  Brook = Brook["default"];

  var stream =
    Brook.stream(function(sink){
      $("button").click(function(e){
        sink(Brook.next(e));
      });
    });

  stream.onValue(function(){
    Person.name = $("#name").val();
    var message = "Hello " + Person.name;
    Person.nameChanged.push(Person.name);
    $(".response").text(message);
  });

  var Person = {
    name: null,
    nameChanged: Brook.reaction()
  };

  Person.nameChanged.onValue(function(value){
    var listItem = $("<li>").html('Changed <strong>name</strong> to "' + value + '"');
    $(".changes").append(listItem);
  });
});
