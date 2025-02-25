const PlayerController = require("./App/controllers/api/playerController");


module.exports.initRealTimeRankGameConcept = (io) => {
    io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);
            let interval = null;
            let refreshRate = 0;
    const sendData = async () => {
        try {
            const players = await PlayerController.getAllPlayers()
            await PlayerController.updatePlayers(players)
            await PlayerController.sortedPlayers(players)


            if (socket.connected) {
                socket.emit("showPlayers", players);
            } else {
                console.log("Socket nie jest połączony");
            }
        } catch (error) {
            console.error("Błąd pobierania graczy:", error.message);
            if (socket.connected) {
                socket.emit("showPlayers", {
                    success: false,
                    message: "Błąd podczas pobierania danych.",
                    error: error.message,
                });
            }
        }
    }
            socket.on("requestInterval", (newInterval) => {
                refreshRate = newInterval * 1000;

                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }

                if (refreshRate >= 1000) {
                    interval = setInterval(sendData, refreshRate);
                }
            });

            socket.on("requestData", sendData);

        socket.on("disconnect", () => {

                clearInterval(interval);


            console.log("User disconnected:", socket.id);
        });
    }
    )}
