// On click action for select winner buttons
$(document).on('click', "#selectPlayer > div > button", function(){
  var winnerID = $(this).html();
  updatePlayer(winnerID, function(){
    $("#selectWinnerModal").modal("hide");
    $("#successSpan").text(winnerID + " is the winner. Their score has been updated").show().delay(5000).fadeOut();
  });
});

// Query leaderboard from DB
function getLeaderBoard(){
  $.getJSON('/leaderboard', function(data) {
    // Remove previous leaderboard entries
    $('#leaderboardTable > tbody').empty();

    // Populate leaderboard
    $.each(data, function(index, value) {
      var numberCol = $('<td/>').html(index + 1);
      var playerCol = $('<td/>').html(value.playername);
      var winsCol = $('<td/>').html(value.score);
      var leaderboardRow = $('<tr/>').append([numberCol, playerCol, winsCol]);

      $('#leaderboardTable > tbody').append(leaderboardRow);
    });
    
    // Show leaderboard
    $("#leaderboardModal").modal("show");
    $("#mainSidenav").width(0);
  })
}

// Update or insert player in DB
function updatePlayer(player, callback){
  $.post('/updatePLayer/' + player, function(data) {
    callback("success");
  });
}

// Populate select winner tables
function populateSelectWinnerList(){
  $('#selectPlayer').empty();

  // Check to see if a game has started
  if($('#playerDivs').children().length == 0){
    var errorDiv = $('<div/>').attr({
      class: 'd-flex justify-content-center align-items-center div-selectwinner',
    })
    .css('color', 'red')
    .html("Please start a game before selecting a winner");

    $("#selectPlayer").append(errorDiv);
  }
  else{
    // Retrieve all players and populate the select winner table
    $('#playerDivs').children('span').each(function () {
      var playerName = $(this).children('b').html().slice(0, -1);

      var buttonDiv = $('<div/>').attr({
        class: 'd-flex justify-content-center align-items-center div-selectwinner',
      });

      var playerSelectButton = $('<button/>').attr({ 
        id: playerName.replace(/\s/g, "").toLowerCase() + 'SelectWinner', 
        type:'button', 
        class:'btn btn-primary btn-selectwinner' 
      })
      .html(playerName);

      $("#selectPlayer").append(buttonDiv.append(playerSelectButton));
    });
  }

  $("#selectWinnerModal").modal("show");
  $("#mainSidenav").width(0);
}