import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../css/bull.css";
import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket";
import { useHistory } from "react-router-dom";

export default function Bull(props) {
  const { name, setName } = props;
  const history = useHistory();

  const [state, setState] = useState({
    bullCow: {
      bull: 0,
      cow: 0,
    },
    guesses: [],
    gameActive: false,
  });
  const [curInput, setCurInput] = useState("");
  let channel = socket.channel("game:" + name, {});
  let { bullCow, guesses, gameActive } = state;
  let callback = null;

  const state_update = (st) => {
    setState(st);
  };

  function ch_join(cb) {
    callback = cb;
    callback(state);
  }

  const joinGame = () => {
    channel
      .join()
      .receive("ok", state_update)
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });
  };

  useEffect(() => {
    ch_join(setState);
    if (!gameActive) {
      joinGame();
    }
  });

  const resetGame = () => {
    joinGame();
    channel
      .push("reset", {})
      .receive("ok", state_update)
      .receive("error", (resp) => {
        console.log("Unable to push", resp);
      });
    setCurInput("");
  };

  const handleInput = (e) => {
    let input = e.target.value;
    if (input !== curInput && input <= 9999) {
      setCurInput(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkWin();
    }
  };

  // Received some inspiration for this from Stack Overflow
  // and the documentation for lodash functions
  const isValid = () => {
    for (let i = 0; i < curInput.length; i++) {
      if (_.includes(curInput, curInput[i], i + 1)) {
        return false;
      }
    }
    return true;
  };

  const checkWin = () => {
    if (
      _.isEmpty(curInput) ||
      curInput.length !== 4 ||
      guesses.includes(curInput) ||
      !isValid()
    ) {
      toast.error("Invalid Input");
      return;
    }
    joinGame();
    channel
      .push("guess", { guess: curInput })
      .receive("ok", state_update)
      .receive("error", (resp) => {
        console.log("Unable to push", resp);
      });
    setCurInput("");
  };

  const getTableData = () => {
    return guesses.map((element, index) => (
      <tr key={index}>
        <td>{element}</td>
      </tr>
    ));
  };

  return (
    <div className="App">
      <Card style={{ width: "75%", height: "75%" }}>
        <Card.Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant={"outline-primary"}
            onClick={() => {
              history.push("/home");
              setName(undefined);
            }}
          >
            Cancel
          </Button>
          Bulls and Cows: {name}
        </Card.Header>
        <Card.Body id={"game-container"}>
          {gameActive ? (
            <>
              <Row id={"display-row"}>
                <Col>
                  Result: {`${bullCow.bull} bulls and ${bullCow.cow} cows`}
                </Col>
                <Col>
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        <th>Guesses</th>
                      </tr>
                    </thead>
                    <tbody>{getTableData()}</tbody>
                  </Table>
                </Col>
              </Row>
              <Row id={"input-row"}>
                <InputGroup className={"mb-2"}>
                  <FormControl
                    type={"number"}
                    onKeyPress={handleKeyPress}
                    onInput={handleInput}
                    value={curInput}
                  />
                  <InputGroup.Append>
                    <Button onClick={checkWin} variant={"outline-secondary"}>
                      Enter
                    </Button>
                    <Button onClick={resetGame} variant={"outline-secondary"}>
                      Reset
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Row>
            </>
          ) : guesses.length == 8 ? (
            <>
              <Row>
                You Are Out of Guesses, Please Press the Reset Button Below
              </Row>
              <Row>:`(</Row>
              <Row>
                <Button onClick={resetGame} variant={"outline-secondary"}>
                  Reset
                </Button>
              </Row>
            </>
          ) : (
            <>
              <Row>YOU WIN!!!!</Row>
              <Row>
                <Button onClick={resetGame} variant={"outline-secondary"}>
                  Reset
                </Button>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
