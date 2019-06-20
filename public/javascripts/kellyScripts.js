// Valdidation methods
$(document).ready(function() {
  // Rule for the players and balls input
  var rules = {
    required: true,
    min: 1,
    max: 15,
    digits: true,
    messages: {
      required: jQuery.validator.format("This field is required"),
      min: jQuery.validator.format("Number must be between 1 and 15"),
      max: jQuery.validator.format("Number must be between 1 and 15"),
      digits: jQuery.validator.format("Please enter a whole number")  
    }
  };

  // Rules for the nameChange input
  var rulesNameChange = {
    required: true,
    maxlength: 12,
    messages: {
      required: jQuery.validator.format("This field is required"),
      maxlength: jQuery.validator.format("Name can be no longer than 12 characters"),
    }
  };

  // Main form validation rule
  $("#mainForm").submit(function(e){
     e.preventDefault();
  }).validate({
      errorElement: 'div',
      errorClass: "input-error",
      submitHandler: function(){
        // Hide keyboard on mobile once form is submitted
        $(".form-control").blur();
        assignBalls();
      }
  });

  $("#players").rules("add", rules);
  $("#balls").rules("add", rules);

  // Validation for name change form
  $("#nameChangeForm").submit(function(e){
    e.preventDefault();
  }).validate({
      errorElement: 'div',
      errorClass: "input-error",
      submitHandler: function(){
        // Hide keyboard on mobile once form is submitted
        $(".form-control").blur();
        nameChange();
      }
  });

  $("#newName").rules("add", rulesNameChange);
});

// Show the name change modal and set the player value
$(document).on('click touchstart','b[name=displayName]', function(){
  playerID = $(this).parent().attr("id")
  $("#playerIDEdit").val(playerID);
  $("#nameChangeModal").modal("show");
});

// Show or hide the balls of a player
$(document).on('click', "#playerDivs > span > button", function(){
  playerBallSpan = $(this).siblings('span')
  playerBallSpan.animate({width:'toggle'}, 350).css({"white-space": "nowrap"}); 
  $(this).text(($(this).text() == "Show?" ? "Hide?" : "Show?"))

  // Hide all other players ball if it is showing
  $("span[id$='Balls']").each(function () {
    if($(this).attr("id") != playerBallSpan.attr("id")){
      $(this).hide();
      //Be sure to change all other buttons back to "Show?"
      $(this).siblings("button").text("Show?")
    }
  });
});

// Change the players name
function nameChange(){
  currentPlayer = $("#playerIDEdit").val();
  newPlayerName = $("#newName").val();

  $("#" + currentPlayer).children().eq(0).html(newPlayerName + ":");
  $("#nameChangeModal").modal("toggle")
}

// Create player (if they are new) and assign them their balls
function assignBalls() {
  var numPlayers = $("#players").val();
  var numBalls = $("#balls").val();

  // If the number of players has changed, delete all players and restart
  if(numPlayers != localStorage.lastNumberOfPlayers){
    $("#playerDivs").empty();
  }

  localStorage.lastNumberOfPlayers = numPlayers;

  // Make sure balls * players does not exceed 15
  if(numPlayers * numBalls > 15){
    $("#errorSpan").show().text("Error, balls * players must be less than or equal to 15.");
    return;
  }
  else
    $("#errorSpan").hide();

  // Generate randomized balls
  var ballArray = [];
  while(ballArray.length < numPlayers * numBalls){
      var ball = Math.floor(Math.random()*15) + 1;
      if(ballArray.indexOf(ball) === -1) ballArray.push(ball);
  }

  // Create player divs
  for(var i=0; i<numPlayers; i++){
    var playerID = 'player' + (i+1);

    // Check to see if playerName already exists. If player does not exists already, create new player
    if(!$('#' + playerID).length){
      // Create and append player elements to the player div
      var playerDisplayName = $('<b/>').attr({
                                      name:'displayName'
                                    })
                                    .html('Player ' + (i+1) + ':');
      var playerBallsSpan = $('<span/>').attr({
                                      id: playerID + 'Balls',
                                      class: 'ball-position',
                                    })
                                    .css('display', 'none')
      var showButton = $('<button/>').attr({ 
                                      id: playerID + 'Button', 
                                      type:'button', 
                                      class:'btn btn-secondary' 
                                    })
                                    .html('Show?');
      var playerIDSpan = $('<span/>').attr({
                                      id: playerID,
                                      class: 'player-span',
                                    })
                                    .css('display', 'none')
                                    .append([playerDisplayName, playerBallsSpan, showButton])

      $("#playerDivs").append(playerIDSpan);
    }

    // Set all buttons back to "Show?"
    $('#' + playerID + "Button").text("Show?");

    var randomBalls = [];
    //Put random balls into array for sorting
    for(var k=0; k<numBalls; k++){
      randomBalls.push(ballArray[i*numBalls + k]);
    }

    // Sort Balls and convert them to a comma separated string
    randomBalls.sort((a,b) => a - b);
    var randomBallsString = randomBalls.join(', ');

    // Replace old balls with new balls and hide all divs
    $('#' + playerID + 'Balls').html(randomBallsString).hide();
  }

  // Fade in all player divs sequentially
  $('#playerDivs').children('span').each(function(fadeInDiv){
    $(this).delay(fadeInDiv * 100).fadeIn(800);
  });
}