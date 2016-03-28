
$('#signin').click(function(){
  $.get('authorize', function(url){
    window.location.href = url;
    // console.log("aaa");
  });
  return false;
});
