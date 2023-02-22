const axios = require('axios')
const baseURL = 'https://statsapi.web.nhl.com'

const getGameStatus = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${baseURL}/api/v1/schedule`
        })

        const {games} = response.data.dates[0]
        const liveGames = games.filter(game => game.status.codedGameState === '3')
        return liveGames
    }catch(e){
        e.message = `Error at getGameStatus: ${e.message}`
        throw e
    }

}

const getLiveDataFeed = async (game,currentDateTime) => {
    try {
        const url = `${baseURL}${game.link}`
        const response = await axios({
            method: 'get',
            url
        })
        const {allPlays} = response.data.liveData.plays
        const currentLivePlays = allPlays.filter(play => play.about.dateTime >= currentDateTime)
        return currentLivePlays
    }catch(e){
        e.message = `Error at getLiveDataFeed: ${e.message}`
        throw e
    }
}

const getPlayerData = async (playerData) => {
    try {
        const url = `${baseURL}${playerData.player.link}`
        const response = await axios({
            method: 'get',
            url
        })
        console.log(response.data)
        return response.data.people
    } catch(e){
        e.message = `Error at getPlayerData: ${e.message}`
        throw e
    }
}

module.exports = { getGameStatus, getLiveDataFeed, getPlayerData }