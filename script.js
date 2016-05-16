/* ADVANCED INTERACTIVE WEB DEV - ASSIGNMENT 2
ROO112634 CIAN WOODS */

//Key 4920d1117c42c58d6214f42339b766a9
//Secret e4fc1206e39b3e62

var imgArray = [];


//On window load append buttons, tag fields and events.
$(document).ready(function() {

  $('#add-button').click(function (){
    var newTag = $('<div><input class="tag-term"></input><button class="delete">-</button></div>');
    $('#tags').append(newTag);
    $('.delete').click(function () {
      $(this).parent().remove();
    });
  });

  $(window).resize(slide);

  $('#left-move').mouseenter(function(){$(this).animate({
    opacity: '0.8'
    }, 200);
  }).mouseout(function(){
    $(this).animate({
      opacity: '0'
    }, 200);
  });

  $('#right-move').mouseenter(function(){
    $(this).animate({
      opacity: '0.8'
    }, 200);
  }).mouseout(function(){
    $(this).animate({
      opacity: '0'
    }, 200);
  });

  $('#search-button').click(fetchImages);

  $("#right-move").click( function() {
    changeImage(1);
  });

  $("#left-move").click( function() {
    changeImage(0);
  });
});





//Append new script to send JSON request to Flickr
function fetchImages () {
  imgArray = [];

  $('#inner').html("");
  var tagString = "";
  $(".tag-term").each(function() {
    tagString += $(this).val() + ",";
  });

  var firstChar = tagString.charAt(0);

  if(firstChar != ",") {
    $(".tag-term").css({"border" : "none"});
    $('#search-button').html("<img src='img/button-load.gif'>");
    $('#main-image').html("<img src='img/main-load.gif'>");
    var flickrRequest = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
    flickrRequest += "&tags=" + tagString;
    flickrRequest += "&api_key=4920d1117c42c58d6214f42339b766a9";
    flickrRequest += "&tag_mode=all";
    flickrRequest += "&per_page=20";
    flickrRequest += "&format=json";

    var flickrScript = document.createElement("script");
    flickrScript.src = flickrRequest;
    $("head").append(flickrScript);

  } else {
    $(".tag-term").css({"border-color": "red",
    "border-width":"3px",
    "border-style":"solid"});
  }
}


//Store returned data as image sources in array
function jsonFlickrApi (data){
  var imageString = "";

  for(var i=0; i<data.photos.photo.length; i++) {
    var url = "http://farm" + data.photos.photo[i].farm;
    url += ".static.flickr.com/";
    url += data.photos.photo[i].server + "/";
    url += data.photos.photo[i].id + "_";
    url += data.photos.photo[i].secret;
    var mainURL = url + "_z.jpg";
    url += "_t.jpg";

    imgArray.push(mainURL);

    imageString += "<li><img id="+ i +" class='thumbnail' style='border-radius:5px' src=" + url + "></li>";
  }

  $('#inner').append(imageString);

  $('#search-button').text("Find Images");

  var numPics = imgArray.length;

  if(numPics === 0) {
    $('#main-image').html("<b>No Results</b>");
  } else{
    $('#main-image').html("<img src=" + imgArray[0] + ">");
  }

  $('.thumbnail').first().attr('name', 'current');

  $('.thumbnail').click(function() {
    var index = $(this).attr('id');
    var mainImage = "" + imgArray[index] + "";
    var currentImage = $('[name="current"]');
    currentImage.removeAttr('name');
    $(currentImage).animate({
      opacity: '0.3'
    }, 500);


    $(this).attr('name', 'current');

    slide();
    displayMainImage(mainImage);
  });
  slide();
}



//Allow user to view next/previous image using left/right arrow keys
$(document).keydown(function(e){
  if (e.which == 37) {
    changeImage(0);
    return false;
  } else if (e.which == 39) {
    changeImage(1);
    return false;
  }
});



/*Change image, paremeter 'direction' is either 1 or 0,
if 1 go to next image, if 0 go to previous image, I had two functions
moveRight() and moveLeft() but this created a lot of duplication so passing
in a value allowed me to use one function*/
function changeImage(direction) {
  var currentImage = $('[name="current"]');
  var numPics = imgArray.length;
  var currentImageId = currentImage.attr('id');

  if(direction == 1) {

    if(currentImageId == numPics-1) {
      var next = $('.thumbnail').first().attr("name", "current");
    } else {
      var next = currentImage.closest("li").next().find("img").attr("name", "current");
    }
    var nextIndex = parseInt(next.attr('id'));
    var newMain = "<img id='current-main' src=" + imgArray[nextIndex] + ">";
    var newMain = "" + imgArray[nextIndex] + "";

  } else if(direction == 0){

    if(currentImageId == 0) {
      var previous = $('.thumbnail').last().attr("name", "current");
    } else {
      var previous = currentImage.closest("li").prev().find("img").attr("name", "current");
    }
    var previousIndex = parseInt(previous.attr('id'));
    var newMain = "<img id='current-main'src=" + imgArray[previousIndex] + ">";
    var newMain = "" + imgArray[previousIndex] + "";
  }

  currentImage.removeAttr('name');

  $(currentImage).animate({
    opacity: '0.3'
  }, 500);

  slide();

  displayMainImage(newMain);
}


/*Load new big image into main area, show loader gif until image
is fully loaded*/
function displayMainImage(newMainUrl) {
  var newMain = new Image();
  newMain.src = newMainUrl;


  $('#main-image').html("<img class='loader' src='img/main-load.gif' />");

  newMain.onload = function(){
    $('#main-image').html(newMain);
  };
}




/*Calculate center of carousel and center of current
 thumnail, animate thumbnail to carousel center*/
function slide() {
  var halfOuterW = $('#outer').width()/2;
  var halfImageW = $('[name="current"]').width()/2;
  var innerLeftOffset = document.getElementsByName('current')[0].offsetLeft;
  var outerLeftOffset = halfOuterW - halfImageW;
  var leftPos = outerLeftOffset - innerLeftOffset;
  var current = $('[name="current"]');
  $(current).animate({
    opacity: '1'
  }, 500);

  $("#inner").animate({left: '' + leftPos + 'px'}, {queue: false});
}
