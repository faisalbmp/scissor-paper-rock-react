import React, { useEffect, useState } from "react";

const ROCK = "rock"
const PAPER = "paper"
const SCISSOR = "scissor"

const useGameRules = () => {
    const [playerChoose, setPlayerChoose] = useState("");
    const [opponentChoose, setOpponentChoose] = useState("");
    const [decideResult, setDecideResult] = useState("");
    const [score, setScore] = useState([0, 0]);
    useEffect(() => {
        const decideWinner = (player, opponent) => {
            if (opponent === player) {
                setDecideResult("its Tied")
            } else if ((player === ROCK && opponent === SCISSOR) || (player === SCISSOR && opponent === PAPER) || (player === PAPER && opponent === ROCK)) {
                setDecideResult("You Win")
                setScore(arr => [arr[0] + 1, arr[1]])
            } else {
                setDecideResult("you lose")
                setScore(arr => [arr[0], arr[1] + 1])
            }
            setOpponentChoose("")
            setPlayerChoose("")
        }
        playerChoose && opponentChoose && decideWinner(playerChoose, opponentChoose)
    }, [playerChoose,
        opponentChoose,
    ])
    return {
        playerChoose,
        setPlayerChoose,
        opponentChoose,
        setOpponentChoose,
        decideResult,
        score,
        setDecideResult,
    }
}

export default useGameRules