// Convert http://qiita.com/hoge/items/fuga -> /hoge/items/fuga
var parseUrl = function (url) {
  return url
    .replace(/https?:\/\/qiita\.com/, '')
    .replace(/\n|\s/g, '');
};

var loadMarkdown = function(url){
  return $.Deferred(function(d){
    $.get(url+'.md').done(function(data, stat) {
      d.resolve(data);
    });
  });
};

var startSlideshow = function(url, md){
  var $source = $('#source');
  $source.show();
  md = DOMPurify.sanitize(md);
  $source.get(0).innerHTML = md;
  history.pushState({}, '', 'http://'+location.host+url);
  var slideshow = remark.create();
  resetUrlInput();
};

var loadAndShow = function(url){
  console.log('fetching', url);
  loadMarkdown(url).done(function(md){
    startSlideshow(url, md);
  });
  $('.main-container').hide();
};

var resetUrlInput = function(){
  var $urlInput = $('.url');
  $urlInput.on('keydown', function(ev){
    if(ev.keyCode === 13) { // when user press enter
      var url = parseUrl($urlInput.val());
      loadAndShow(url);
    }
  });
  var $go = $('.go');
  $go.on('click', function(){
    var url = parseUrl($urlInput.val());
    loadAndShow(url);
  });
}

$(function() {
  resetUrlInput();
  if(location.pathname !== '/')
    loadAndShow(location.pathname);
});
