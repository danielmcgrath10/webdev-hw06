//imports
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Container, Row, Table} from "react-bootstrap";
import socket, { ch_init, ch_login } from "./socket.js";
import { useHistory } from "react-router-dom";


function SetupPage(props) {
  const { name, user, setName, setUser, channel} = props;
  const history = useHistory();
  const [userState, setUserState] = useState({
    userName: "",
    users: [],
    players: [],
    readys: [],
    lastWinners: [],
  });
  
  const [playerActive, setPlyrActive] = useState(false);
  const [readyActive, setReadyActive] = useState(false);
  let {userName, users, players, readys, lastWinners} = userState;

  const state_update = (st) => {
    setUserState(st);
  };

  useEffect(() => {
    ch_init(channel);
    ch_login(channel, user, setUserState);
    channel.on("view", state_update);
  }, [])

  function playerClick(bool) {
    //ch_push({playerBool: ev.checked});
    // This might go in socket.js
    channel.push("player", {playerBool: bool})
      .receive("ok", state_update)
      .receive("error", (resp) => {
        console.log("unable to update player status", resp)
      });
  }

  const checkReady = (st) => {
    console.log("hello world", st.players, st.readys);
    if(st.players.length === st.readys.length){
      channel.push("newGame", {"name": user})
      .receive("ok", st => {
        history.push("/multibull");
      })
      .receive("error", (resp) => {
        console.log("unable to update player status", resp)
      });
    }
  }

  function readyClick(bool) {
    // ch_push({readyBool: ev.checked});
    // This might go in socket.js
    channel.push("ready", {readyBool: bool})
      .receive("ok", st => {
        state_update(st);
        console.log(st);
        checkReady(st);
      })
      .receive("error", (resp) => {
        console.log("unable to update ready status", resp)
      });
    
  }
      
  function getPlayers() {
    return players.map((element, index) => (
      <tr key={index}>
        <td>{element}</td>
        <td>{readys.includes(element) ? "Ready":"Observer"}</td>
      </tr>
    ))
  }

  function getScoreboard() {
    return users.map((element, index) => (
      <tr key={index}>
        <td>{element.name}</td>
        <td>{element.wins}</td>
        <td>{element.losses}</td>
      </tr>
    ))
  }

  const handleBtn = () => {
   if(playerActive && readyActive) {
      handleReady();
    }
    playerClick(!playerActive);
    setPlyrActive(!playerActive);
  }

  const handleReady = () => {
    readyClick(!readyActive);
    setReadyActive(!readyActive);
  }

  let displayWinners = "Welcome to Bulls and Cows";

  if (lastWinners.length > 0) {
    displayWinners = "Won Last Game: " + lastWinners.toString();
  }

  return (
    <Container>
      <Row style={{paddingBottom: "10px"}}>
        <Col md={"auto"}>
          <Button
            variant={"outline-danger"}
            onClick={() => {
              history.push("/home")
              setName(undefined);
              setUser(undefined);
              
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col xs={10}><h2>Bulls and Cows Game</h2></Col>
      </Row>
      <Row style={{paddingBottom: "15px"}}>
        <Col><h4>User: {user}</h4></Col>
        <Col>
          <Button
            variant={"outline-primary"}
            active={playerActive}
            style={{marginRight: "10px"}}
            onClick={handleBtn}
          >
            Playing
          </Button>
          {
            playerActive ? 
              <Button
                variant={'outline-success'}
                active={readyActive}
                onClick={handleReady}
              >
                Ready
              </Button>
            :
              null
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col><h3>Current Players</h3></Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>
                      Player Name
                    </th>
                    <th>
                      Ready?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPlayers()}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col><h3>Scoreboard</h3></Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>
                      Player Name
                    </th>
                    <th>
                      Wins
                    </th>
                    <th>
                      Loss
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getScoreboard()}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default SetupPage;
