const WebSocket = require('ws');
const { generateRandomWebSocketId } = require('../middlewares/passwordMiddleware.js');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = {};
         
        this.wss.on('connection', async (ws, req) => {
            const uniqueId = await generateRandomWebSocketId();
            ws.id = uniqueId;
            this.clients[uniqueId] = ws;
            const clientData = {
                clientId: uniqueId
            };
            this.sendMessage(ws.id, Segments.CLIENT, "OnClientConnected", clientData);
            ws.on('close', () => {
                delete this.clients[uniqueId];
            });

            console.log("Socket connected " + ws.id);
            this.intializeSockets(ws);
        });
    }

    intializeSockets(ws) {
        ws.on('close', () => {});

        ws.on('message', async (message) => {
            try {
                console.log(String(message));
                const parsedMessage = JSON.parse(String(message));
                console.log(parsedMessage);
                let dataObject = parsedMessage.data.reduce((obj, item) => {
                    obj[item.key] = item.value;
                    return obj;
                }, {});

                switch (parsedMessage.action) {
                    case 'joinPlayer':
                        const player = this.playerManager.joinPlayer(dataObject.playerName, ws);
                        console.log(player);
                        this.sendMessage(ws.id, Segments.PLAYER, "OnPlayerConnected", playerData);
                        break;
                    case 'createMatch':
                        console.log(dataObject);
                        const createdMatch = await this.matchManager.createMatch(dataObject.roomId);

                        const matchData = {

                            matchId: createdMatch.MatchId
                        }

                        this.sendMessage(ws.id, Segments.MATCH, "OnCreatedMatch", matchData);
                        break;
                    case 'getMatchById':
                        const match = this.matchManager.getMatchById(dataObject.matchId);
                        this.sendMessage(ws.id, Segments.MATCH, "OnGetMatchById", match.MatchId);
                        break;
                    case 'findAvailableMatch':
                        const foundedMatch = this.matchManager.findAvailableMatch();
                        console.log(foundedMatch);
                        this.sendMessage(ws.id, Segments.MATCH, "OnfindAvailableMatch", foundedMatch.MatchId);
                        break;
                    case 'joinPlayerToMatch':

                        console.log(ws);
                        const joinedPlayer = await this.playerManager.joinPlayerToMatch(dataObject.playerName, ws, dataObject.deckId);

                        const playerData = {

                            matchId: dataObject.matchId,
                        }

                        console.log(joinedPlayer);
                        this.sendMessage(ws.id, Segments.PLAYER, "OnjoinPlayerToMatch", playerData);


                        break;

                        case 'useCard':

                        await this.playerManager.placeCard(ws.id, dataObject);
                        console.log(dataObject)

                        break;
                        case 'dealDamage':

                        this.playerManager.dealDamage(dataObject.hitterCardId, dataObject.dealerCardId);
                        console.log(dataObject)

                        break;
                        case 'setTurrets':

                        await this.playerManager.getTurrets(dataObject.itemId);

                        break;
                    case 'setPlayerToReadyToPlay':

                        await this.playerManager.setPlayerToLoaded(ws.id, dataObject.matchId);

                        const startedMatchData = {

                            matchId: dataObject.matchId
                        }

                        this.sendMessage(ws.id, Segments.MATCH, "OnPlayerReadyToPlay", startedMatchData);
                        break;
                    default:
                        console.log('Received unhandled action:', parsedMessage.action);
                }
            } catch (err) {
                console.error('Failed to parse message:', message, 'Error:', err);
            }
        });
    }

    startTimer(match) {
        match.gameIsPlaying = true;
        this.timerManager.startTimer(match, this.onTimerTick.bind(this), this.onTimerEnd.bind(this));
        this.foodManager.startFoodGeneration(match, this.onFoodGenerated.bind(this));
    }

    removePlayerFromMatch(ws, match) {
        const index = match.users.indexOf(ws);
        if (index !== -1) {
            match.users.splice(index, 1);
        }

        console.log("Users connected " + match.users.length + " users finished " + match.usersFinished.length);

        if (match.gameIsPlaying) {
            if (match.users.length <= match.usersFinished.length && !match.gameIsFinished) {
                this.finishGame(match);
            }
        }
    }

    finishGame(match) {
        match.gameIsFinished = true;
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, Segments.GAME, 'OnFinishGame', {});
        });

        setTimeout(() => {
            match.users.forEach(userSocket => {
                userSocket.close();
            });
            this.matchManager.deleteMatch(match.matchId);
        }, 2000);
    }

    onFoodGenerated(match, food) {
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, 'OnFoodGenerated', food);
        });
    }

    onTimerTick(match) {
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, Segments.TIMER, 'OnCountdown', match.currentTime);
        });
    }

    onTimerEnd(match) {

        match.gameIsPlaying = false;
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, Segments.TIMER, 'OnCountdownFinish', {currentTime: 0,});
        });

        setTimeout(() => {
            this.timerManager.startTimer(match, this.onPreparingLaunchTimerTick.bind(this), this.onLaunchTimerEnd.bind(this), 5);
        }, 1000);
    }

    onPreparingLaunchTimerTick(match) {
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, 'OnLaunchCountdown', match.currentTime);
        });
    }

    onLaunchTimerEnd(match) {
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, 'OnLaunchDogs', 0);
        });
    }

    sendMessage(id, segment, action, message) {
        const client = this.clients[id];
       
        if (client) {
            if(segment == Segments.TURRET)console.log(message)
            client.send(JSON.stringify({
                segment: segment,
                action: action,
                data: message
            }));
        }
    }

    onPlayerArrive(match, data) {
        console.log("On player arrive");
        const transformedData = data.data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        console.log("Transformed data ", transformedData);

        match.usersFinished.push(data);

        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, 'OnPlayerArrived', transformedData);
        });

        console.log("Players in game ", match.users);
        console.log("On players finished ", match.usersFinished);

        if (match.users.length <= match.usersFinished.length && !match.gameIsFinished) {
            setTimeout(() => {
                this.finishGame(match);
            }, 2000);
        }
    }

    handleFoodEaten(match, data) {
        match.users.forEach(userSocket => {
            this.sendMessage(userSocket.IdSocket.id, 'OnFoodEaten', data.data[0].value);
        });
    }
}

module.exports = WebSocketServer;
