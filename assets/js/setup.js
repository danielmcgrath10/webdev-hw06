//imports
import React, {useState} from "react";
import {Button, ButtonGroup, Col, Container, Row, Table} from "react-bootstrap";
import socket, { ch_init } from "./socket.js";
import { useHistory } from "react-router-dom";


function SetupPage(props) {
  const {name, user, setName, setUser} = props;
  const history = useHistory();

  const [state, setState] = useState({
    userName: user,
    users: [{name: "danny", wins: 2, losses: 2}],
    players: ["danny"],
    readys: [],
    lastWinners: [],
  });
  const [btnActive, setBtnActive] = useState(2);
  let {userName} = state;

  let channel = socket.channel("game:" + name, {});

  const state_update = (st) => {
    setState(st);
  };

  function playerClick(ev) {
    //ch_push({playerBool: ev.checked});
    // This might go in socket.js
    ch_init(channel);
    channel.push("player", ev.checked)
           .receive("ok", state_update)
           .receive("error", (resp) => {
             console.log("unable to update player status", resp)
           });
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
      <tr key={index}>
        <td>{element}</td>
        <td>{state.readys.includes(element) ? "Ready":"Observer"}</td>
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

  const handleBtn = (num) => {
    setBtnActive(num);
  }

  let displayWinners = "Welcome to Bulls and Cows";

  if (state.lastWinners.length > 0) {
    displayWinners = "Won Last Game: " + state.lastWinners.toString();
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
        <Col><h4>User: {userName}</h4></Col>
        <Col>
          <ButtonGroup>
            <Button
              variant={"outline-primary"}
              active={btnActive == 1}
              onClick={() => handleBtn(1)}
            >
              Playing
            </Button>
            <Button
              variant={"outline-primary"}
              active={btnActive == 2}
              onClick={() => handleBtn(2)}
            >
              Observing
            </Button>
          </ButtonGroup>
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
