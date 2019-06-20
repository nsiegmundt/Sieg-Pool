var express = require('express');
var router = express.Router();
var siegPoolDB = require("../lib/siegpoolDB.js")

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: "Sieg Pool Assistant" });
});

// GET leaderboard from postgres DB
router.get('/leaderboard', function(req, res, next) {
  siegPoolDB.getPlayers(function(players){
    res.send(players)
  })
});

// Update leaderboard
router.post('/updateplayer/:playername', function(req, res, next) {
  playerName = req.params.playername;
  siegPoolDB.updatePlayer(playerName, function(status){
    res.send({"status": "success"})
  })
});

module.exports = router;
