import {players} from "./data.js";
import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import {useState} from "react";
import Log from "./components/Log.jsx";
import {WINNING_COMBINATIONS, INITIAL_GAME_BOARD} from "./data.js";
import GameOver from "./components/GameOver.jsx";

const deriveActivePlayer = (gameTurns) => {
    let currentPlayer = 'X';

    if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
        currentPlayer = 'O'
    }
    return currentPlayer;
}

const deriveWinner = (gameBoard, player) => {
    let winner = null;

    for(const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

        if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
            winner = player[firstSquareSymbol];
        }
    }
    return winner;
}

const deriveGameBoard = (gameTurns) => {
    let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

    for(const turn of gameTurns) {
        const {square, player} = turn;
        const {row, col} = square;

        gameBoard[row][col] = player
    }
    return gameBoard
}

function App() {
    const [gameTurns, setGameTurns] = useState([]);
    const [player, setPlayer] = useState({
        X: 'Player 1',
        O: 'Player 2'
    })
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, player);
    const hasDraw = gameTurns.length === 9 && !winner;
    const activePlayer = deriveActivePlayer(gameTurns);


    const handleSelectedSquare = (rowIndex, colIndex) => {

        setGameTurns((prevState) => {
            const currentPlayer = deriveActivePlayer(prevState);
            return [{square:{row: rowIndex, col: colIndex}, player: currentPlayer}, ...prevState];

        })
    }

    const handleRematch = () => {
        setGameTurns([]);
    }

    const handlePlayerNameChange = (symbol, newName) => {
        setPlayer(prevPlayer => {
            return {
                ...prevPlayer,
                [symbol]: newName
            }
        })
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    {players.map(player => (
                        <Player key={player.symbol} initialName={player.name} symbol={player.symbol}
                                isActive={activePlayer === player.symbol} onChangeName={handlePlayerNameChange}/>
                    ))}
                </ol>
                {(winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch}/>}
                <GameBoard onSelectedSquare={handleSelectedSquare} board={gameBoard}/>
            </div>
            <Log turns={gameTurns}/>
        </main>
    )
}

export default App
