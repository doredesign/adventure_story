var router = new Navigo(null, true);

var story = {};
var storyReady = $.ajax({
  url: "adventure_story.yaml",
  dataType: "text"
}).done(function(data){
  story = jsyaml.load(data);
});

var pageReady = $.when($.ready, storyReady).then(function () {
  window.$sender = $("#sender_window");
  window.$options = $("#options");
  window.$container = $(".container");
  window.$alert = $("#alert");
  window.displayLocation = function(location_data) {
    location_data = { ...location_data }
    $sender.text("");
    $alert.html("");
    $options.html("");
    var message = [
      "><br>",
      "><br>",
      "> ",
    ]
    message = message.concat(location_data.t.split(""))
    message = message.concat([
      "<br>>",
      '<br>><span class="blinking-cursor">|</span>'
    ])
    var messageDone = $.Deferred()
    showText($sender, message, 0, messageDone);
    delete location_data.t;

    messageDone.done(function () {
      var alertMessage = "";
      if (Object.keys(location_data).length == 0) {
        alertMessage = "<div>No more messages received. <a href='#'>Start over?</a></div>";
      }
      $alert.html(alertMessage);

      for (const [location, option] of Object.entries(location_data)) {
        var listItem = `<li><a class="btn btn-primary" href="#locations/${location}" role="button">${option}</a></li>`;
        $options.append(listItem);
      }
    })
  }
});

router
  .on({
    'locations/:id': function (params) {
      $.when(pageReady).then(function () {
        displayLocation(story[params.id])
      });
    },
    '*': function () {
      $.when(pageReady).then(function () {
        displayLocation(story[0])
      });
    }
  })
  .resolve();

window.showText = function (target, message, index, promise) {
  if (index < message.length) {
    char = message[index++]
    target.append(char);

    max = 20
    if (char == "." || char == "?") {
      max = 1500
    }
    setTimeout(function () { window.showText(target, message, index, promise); }, getRandomInt(max));
  } else {
    promise.resolve()
  }
}

window.getRandomInt = function (max) {
  return 40 + Math.floor(Math.random() * Math.floor(max));
}
