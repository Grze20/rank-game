const Player = require('../../mongodb/models/player');


class PlayerController  {
    async getAllPlayers(){
        const allPlayers = await Player.find({});
        return allPlayers
    }
    async updatePlayers(players){
        const randomIndex = Math.floor(Math.random() * players.length);
        const randomPoints = Math.floor(Math.random() * 10);
        const randomPlayer = players[randomIndex]
        await Player.findByIdAndUpdate(randomPlayer._id, {
            points: randomPlayer.points + randomPoints
        }, null)
    }
    async sortedPlayers(players){
        await players.sort((a, b) => b.points - a.points)
    }
}

module.exports = new PlayerController();