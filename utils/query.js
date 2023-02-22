const pool = require('./sqlHelper')
const { getPlayerData } = require('../services/nhlAPI')
const handleLivePlays = async(currentPlays) => {
    try {
        await Promise.all(currentPlays.map(async play => {
            switch (play.result.event) {
                case 'Hit':
                    await insertHit(play)
                    break
                case 'Goal':
                    await insertGoals(play)
                    await insertAssist(play)
                    break
                case 'Penalty':
                    await insertPenaltyMinutes(play)
                    break
                default:
                    console.log(play.result.event)
            }
        }))
    } catch(e){
        e.message = `Error at handleLivePlays: ${e.message}`
        throw e
    }
}
const checkTableEntry = async(people) =>{
    try{
        const SQL = `SELECT * FROM sports_radar_nhl.player WHERE player_id=${people.id}`
        const selectQuery = await pool.query(SQL)
        return selectQuery[0]
    }catch(e){
        e.message = `Error at checkTableEntry: ${e.message}`
        throw e
    }
}
const insertHit = async(play) => {
    try {
        const playerData = play.players.find(player => player.playerType === 'Hitter')
        const people = await getPlayerData(playerData)
        const selectResult = await checkTableEntry(people[0])
        if(selectResult.length === 0) {
            const sql = `INSERT INTO player (player_id, player_name, player_age, player_number, position_name,
                                             current_team_name,
                                             current_team_id, opponent_team_name, opponent_team_id, hits)
                         VALUES (?)`
            const values = [
                people[0].id,
                people[0].fullName,
                people[0].currentAge,
                people[0].primaryNumber,
                people[0].primaryPosition.name,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                1
            ]
            const insertQuery = pool.query(sql, [values])
            return insertQuery

        }else{
            const sql = `UPDATE player SET hits = hits + 1 WHERE player_id=${people[0].id}`
            return pool.query(sql)
        }
    } catch (e){
        e.message = `Error at insertHit: ${e.message}`
        throw e
    }
}
const insertGoals = async(play) => {
    try {
        const playerData = play.players.find(player => player.playerType === 'Scorer')
        const people = await getPlayerData(playerData)
        people[0].seasonTotal = playerData.seasonTotal
        const selectResult = await checkTableEntry(people[0])
        if (!selectResult) {
            const sql = `INSERT INTO player (player_id, player_name, player_age, player_number, position_name,
                                             current_team_name,
                                             current_team_id, opponent_team_name, opponent_team_id, goals, points)
                         VALUES (?)`
            const values = [
                people[0].id,
                people[0].fullName,
                people[0].currentAge,
                people[0].primaryNumber,
                people[0].primaryPosition.name,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].seasonTotal,
                people[0].seasonTotal
            ]
            return pool.query(sql, [values])
        } else {
            const sql = `UPDATE player SET goals = ${people[0].seasonTotal}, points = ${people[0].seasonTotal} WHERE player_id=${people[0].id}`
            return pool.query(sql)
        }
    } catch(e){
        e.message = `Error at insertGoals: ${e.message}`
        throw e
    }
}
const insertAssist = async(play) => {
    try {
        const playerData = play.players.find(player => player.playerType === 'Assist')
        if(playerData === null || playerData === undefined){
            return Promise.resolve('There is no assist associated with this goal')
        }
        const people = await getPlayerData(playerData)
        people[0].seasonTotal = playerData.seasonTotal
        const selectResult = await checkTableEntry(people[0])
        if (!selectResult) {
            const sql = `INSERT INTO player (player_id, player_name, player_age, player_number, position_name,
                                             current_team_name,
                                             current_team_id, opponent_team_name, opponent_team_id, assists, points)
                         VALUES (?)`
            const values = [
                people[0].id,
                people[0].fullName,
                people[0].currentAge,
                people[0].primaryNumber,
                people[0].primaryPosition.name,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].seasonTotal,
                people[0].seasonTotal
            ]
            return pool.query(sql, [values])
        } else {
            const sql = `UPDATE player SET assists = ${people[0].seasonTotal}, points = ${people[0].seasonTotal} WHERE player_id=${people[0].id}`
            return pool.query(sql)
        }
    }catch(e){
        e.message = `Error at insertAssist: ${e.message}`
        throw e
    }
}
const insertPenaltyMinutes = async(play) =>{
    try {
        const player = play.players.find(player => player.playerType === 'PenaltyOn')
        const people = await getPlayerData(player)
        people[0].penaltyMinutes = play.result.penaltyMinutes
        const selectResult = await checkTableEntry(people[0])
        if (!selectResult) {
            const sql = `INSERT INTO player (player_id, player_name, player_age, player_number, position_name,
                                             current_team_name,
                                             current_team_id, opponent_team_name, opponent_team_id, penalty_minutes)
                         VALUES (?)`
            const values = [
                people[0].id,
                people[0].fullName,
                people[0].currentAge,
                people[0].primaryNumber,
                people[0].primaryPosition.name,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].currentTeam.name,
                people[0].currentTeam.id,
                people[0].penaltyMinutes
            ]
            return pool.query(sql, [values])
        } else {
            const sql = `UPDATE player SET penalty_minutes = ${people[0].penaltyMinutes} WHERE player_id=${people[0].id}`
            return pool.query(sql)
        }
    }catch(e){
        e.message = `Error at insertPenaltyMinutes: ${e.message}`
        throw e
    }
}

module.exports = { handleLivePlays }