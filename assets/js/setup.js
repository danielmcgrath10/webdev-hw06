//imports
import React, {useState} from "react";
import {Table} from "react-bootstrap";
import socket from "./socket.js";

function SetupPage(props) {
  const {name } = props;

  const [state, setState] = useState({
    userName: "",
    users: [],
    player: false,
    ready: false,
    players: [],
    readys: [],
    lastWinners: [],
  });

  let channel = socket.channel("game:" + name, {});

  const state_update = (st) => {
    setState(st);
  };

  function playerClick(ev) {
    //ch_push({playerBool: ev.checked});
    // This might go in socket.js
    channel.push("player", ev.checked)
           .receive("ok", state_update)
           .receive("error", (resp) => {
             console.log("unable to update player status", resp)
           });
  }

  function showReadyCheck() {
    if (state.player) {
      return <p>Ready? <input type="checkbox" id="readyCheck" onClick={readyClick}/></p>;
    } else {
      return <p>Observing next game</p>;
    }
  }

  function readyClick(ev) {
    // ch_push({readyBool: ev.checked});
    // This might go in socket.js
    channel.push("ready", ev.checked)
           .receive("ok", state_update)
           .receive("error", (resp) => {
             console.log("unable to update ready status", resp)
           });
    
  }
      
  function getPlayers() {
    return state.players.map((element, index) => (
      <tr>
        <td>{element}</td>
        <td>{state.readys.includes(element)}</td>
      </tr>
    ))
  }

  function getScoreboard() {
    return state.users.map((element, index) => (
      <tr key={index}>
        <td>{element.name}</td>
        <td>{element.wins}</td>
        <td>{element.losses}</td>
      </tr>
    ))
  }

  let displayWinners = "Welcome to Bulls and Cows";

  if (state.lastWinners.length > 0) {
    displayWinners = "Won Last Game: " + state.lastWinners.toString();
  }

  return (
    <div className="Setup">
      <h2>Bulls and Cows Game</h2>
      <div className="row">
        <div className="column">
          <h3>{displayWinners}</h3>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <p>User: {state.userName}</p>
        </div>
        <div className="column">
          <p>Playing Next Game? <input type="checkbox" id="playerCheck" onClick={playerClick}/></p>
        </div>
        <div className="column">
          {showReadyCheck()}
        </div>
      </div>
      <div className="row">
        <div className="column">
          <div className="row">
            <div className="column">
              <h6>Players</h6>
            </div>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Ready?</th>
              </tr>
            </thead>
            <tbody>{getPlayers()}</tbody>
          </Table>
        </div>
        <div className="column">
          <div className="row">
            <div className="column">
              <h6>Scoreboard</h6>
            </div>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>{getScoreboard()}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SetupPage;
