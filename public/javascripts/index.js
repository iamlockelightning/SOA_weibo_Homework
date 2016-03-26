
$('#signin').click(function(){
  $.get('authorize', function(url){
    window.open(url);
  });
});
