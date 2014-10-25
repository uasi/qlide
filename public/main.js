function startSlideshow() {
  var path = location.pathname;
  if (path == '/') return;
  path += '.md';
  $.get(path, function(data, stat) {
    $('#source').get(0).innerText = data;
    var slideshow = remark.create();
  });
}

$(document).ready(function() {
  startSlideshow();
});
