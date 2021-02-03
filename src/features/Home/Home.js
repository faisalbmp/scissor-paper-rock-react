import React, { useEffect, useRef, useState } from "react";
import useConnectmqtt from "./useFunction/useConnectmqtt";
import { v1 as uuid } from 'uuid';
import styled from "styled-components";

const ROCK = "rock"
const PAPER = "paper"
const SCISSOR = "scissor"
const Button = styled.button`
    font-size:50px;
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
    margin-right:20px;
    :disabled{
        color: transparent;  
  text-shadow: 0 0 0 grey;
    }
    `
const Card = styled.div`
    border
`
const Home = () => {
    const [playerChoose, setPlayerChoose] = useState("");
    const [displayPlayerChoose, setDisplayPlayerChoose] = useState("");
    const [opponentChoose, setOpponentChoose] = useState("");
    const [displayOpponentChoose, setDisplayOpponentChoose] = useState("");
    const [score, setScore] = useState([0, 0]);
    const [round, setRound] = useState(0);
    const [opponentRound, setOpponentRound] = useState(0);
    const [decideResult, setDecideResult] = useState("");
    const [/*connectionStatus*/, setConnectionStatus] = useState(false);
    const [opponentReady, setOpponentReady] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const userId = useRef(uuid())
    const readyPlayer = () => {
        if (client && !playerReady) {
            client.publish('scissorpaperrockreact.com', `{ "userId": "${userId.current}","Ready": true }`)
            setPlayerReady(true)
        }
    }

    const { client } = useConnectmqtt(readyPlayer);
    useEffect(() => {
        client?.subscribe('scissorpaperrockreact.com');
        client?.on('connect', () => setConnectionStatus(true));
        let Rede = opponentReady
        client?.on('message', (topic, payload, packet) => {
            const data = JSON.parse(payload.toString())
            if (data.userId !== userId.current && data.msg) {
                setOpponentChoose(data.msg)
                setOpponentRound(data.round)
            }
            if (data.userId !== userId.current && data.Ready && !opponentReady && !Rede) {
                Rede = true
                setOpponentReady(true)
                client.publish('scissorpaperrockreact.com', `{ "userId": "${userId.current}","Ready": true }`)
            }
        });
    }, [client, playerChoose, opponentReady]);
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
            setDisplayOpponentChoose(opponent)
            setRound(r => r + 1);
        }
        playerChoose && opponentChoose && opponentRound == round && decideWinner(playerChoose, opponentChoose)
    }, [playerChoose,
        opponentChoose,
        opponentRound,
        round])


    const handleClickPlayer = async (e) => {
        await setPlayerChoose(e);
        await setDisplayPlayerChoose(e)
        await client.publish('scissorpaperrockreact.com', `{ "userId": "${userId.current}", "msg": "${e}" ,"round":"${round}"}`)
    }

    return (
        <div className="container text-center p-5">
            {opponentReady ?
                <div className="card text-center">
                    <h2>Score</h2>
                    <div className="d-flex flex-row justify-content-around align-items-start">
                        {score[0] >= 5 ?
                            <h3>You Win</h3>
                            : score[1] >= 5 ?
                                <h3>You Lose</h3> :
                                <>
                                    <h3>{score[0]}</h3>
                                    <h3>{score[1]}</h3>
                                </>
                        }
                    </div>
                </div>
                : null}
            {
                !opponentReady ? <h1>Waiting Opponent</h1> :
                    <>
                        <h1>Rock Paper Scissor</h1>
                        <div className="d-flex flex-row justify-content-center">
                            <Button disabled={playerChoose} onClick={() => handleClickPlayer(ROCK)}>🤜</Button>
                            <Button disabled={playerChoose} onClick={() => handleClickPlayer(PAPER)}>🤚</Button>
                            <Button disabled={playerChoose} onClick={() => handleClickPlayer(SCISSOR)}>🤞</Button>
                        </div>
                    </>
            }
            {opponentReady ?
                <Card>
                    <div className="d-flex flex-row justify-content-around align-items-start">
                        <div className="d-flex flex-column  text-center">
                            <h2>You</h2>
                            {displayPlayerChoose === ROCK ? <h3>🤜</h3> :
                                displayPlayerChoose === PAPER ? <h3>🤚</h3> :
                                    displayPlayerChoose === SCISSOR ? <h3>🤞</h3>
                                        : null
                            }
                        </div>
                        <div className="d-flex flex-column text-center">
                            <h2>Opponent</h2>
                            {displayPlayerChoose && displayPlayerChoose !== playerChoose && displayOpponentChoose === ROCK ? <h3>🤜</h3> :
                                displayPlayerChoose && displayPlayerChoose !== playerChoose && displayOpponentChoose === PAPER ? <h3>🤚</h3> :
                                displayPlayerChoose && displayPlayerChoose !== playerChoose && displayOpponentChoose === SCISSOR ? <h3>🤞</h3>
                                        : <h3></h3>
                            }
                        </div>
                    </div>
                </Card>
                : null}
        </div>
    )
}

export default Home;