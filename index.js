const moment = require('moment')
const {getGameStatus, getLiveDataFeed} = require('./services/nhlAPI')
const { handleLivePlays } = require('./utils/query')

console.log("Hello New World")
setInterval(readFromNHL,6000)
let currentDateTime
async function readFromNHL(){
    try {
        currentDateTime = moment().utc().format()
        const games = await getGameStatus()
        if (games.length > 0) {
            console.log(games)
            await Promise.all(games.map(async (game) => {
                const currentPlays = await getLiveDataFeed(game, currentDateTime)
                await handleLivePlays(currentPlays)
            }))
        } else {
            process.exit()
        }
    }catch(e){
        e.message = `Error at readFromNHL: ${e.message}`
        throw e
    }
}
