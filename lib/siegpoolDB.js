const { Client } = require('pg');

// Setup client connection params
function setupClient(){
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    
    return client;
}

module.exports = {
    // Retreive top 10 players from DB
    getPlayers: function(callback){  
        client = setupClient()
        client.connect()
    
        client.query('SELECT * FROM PLAYERS ORDER BY score DESC LIMIT 10', (err, sqlres) => {
            if (err){
                console.log("ERROR: " + err)
                client.end();
                callback(err)
            } 
            else{
                client.end();
                callback(sqlres.rows);
            }
        });
    },
    
    // Update players in DB
    updatePlayer: function(player, callback){        
        client = setupClient()
        client.connect()
        
        // Insert new player into database, unless player already exists, then update score
        const query = 'INSERT INTO Players VALUES ($1, 1) ON CONFLICT (playername) DO UPDATE SET score = players.score + 1 WHERE players.playername = $1'
    
        client.query(query, [player], (err, sqlres) => {
            if (err){
                console.log("ERROR: " + err)
                client.end();
                callback(err)
            } 
            else{
                client.end();
                callback('success');
            }
        });
    },
    
    // Delete all players from DB
    deletePlayers: function(callback){        
        client = setupClient()
        client.connect()
    
        client.query('TRUNCATE Players', (err, sqlres) => {
            if (err){
                console.log("ERROR: " + err)
                client.end();
                callback(err)
            } 
            else{
                client.end();
                callback('success');
            }
        });
	}
};