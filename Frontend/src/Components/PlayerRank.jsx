import React, { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import "./PlayerRank.css";

const PlayerRank = () => {
    const [players, setPlayers] = useState([]);
    const [refreshInterval, setRefreshInterval] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [playersPerPage, setPlayersPerPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("Połączono z WebSocket");

        socket.on("showPlayers", (players) => {
            console.log("Odebrane dane:", players);
            if (players.success === false) {
                console.error(players.message);
            } else {
                setPlayers(players);
            }
        });

        return () => {
            socket.off("showPlayers");
            console.log("Rozłączono WebSocket");
        };
    }, []);

    useEffect(() => {
        socket.emit("requestInterval", refreshInterval);

        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        if (refreshInterval > 0) {
            const newIntervalId = setInterval(() => {
                socket.emit("requestData");
            }, refreshInterval * 1000);
            setIntervalId(newIntervalId);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [refreshInterval]);

    const filteredPlayers = players.filter((player) =>
        player.nick.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
    const paginatedPlayers = filteredPlayers.slice(
        (currentPage - 1) * playersPerPage,
        currentPage * playersPerPage
    );

    return (
        <div>
            <h1>Ranking Graczy</h1>
            <div className={"inputContainer"}>
            <div className="formRefresh-container">
                <label htmlFor="formRefresh">Częstotliwość odświeżania (s)</label>
                <input
                    id="formRefresh"
                    type="number"
                    className="formRefresh"
                    min={0}
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                />
            </div>
            <div className="search-container">
                <label htmlFor="search">Szukaj gracza:</label>
                <input
                    id="search"
                    type="text"
                    className="search-input"
                    placeholder="Wpisz nick..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="pagination-container">
                <label htmlFor="playersPerPage">Gracze na stronę:</label>
                <select
                    id="playersPerPage"
                    value={playersPerPage}
                    onChange={(e) => {
                        const newPlayersPerPage = Number(e.target.value);
                        const evenPlayersPerPage = newPlayersPerPage === 0 ? 0 : (newPlayersPerPage % 2 === 0 ? newPlayersPerPage : newPlayersPerPage + 1);

                        setPlayersPerPage(evenPlayersPerPage);
                        setCurrentPage(1);
                    }}
                >
                    <option value={0}>0</option>
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                </select>

                <button
                    disabled={currentPage === 1 || totalPages === 0 || playersPerPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    ◀ Poprzednia
                </button>

                <span>Strona {totalPages === 0 || playersPerPage === 0 ? 0 : currentPage} z {totalPages === 0 || playersPerPage === 0 ? 0 : totalPages}</span>

                <button
                    disabled={currentPage === totalPages || totalPages === 0 || playersPerPage === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Następna ▶
                </button>
            </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Lp.</th>
                    <th>Nick gracza</th>
                    <th>Punkty</th>
                    <th>Kolor</th>
                </tr>
                </thead>
                <tbody>
                {paginatedPlayers.map((player, index) => (
                    <tr key={player._id}>
                        <td>{(currentPage - 1) * playersPerPage + index + 1}</td>
                        <td>{player.nick}</td>
                        <td>{player.points}</td>
                        <td style={{ backgroundColor: player.color}}></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerRank;
