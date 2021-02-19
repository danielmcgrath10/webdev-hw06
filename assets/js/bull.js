import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../css/bull.css";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { ch_join, ch_push, ch_reset } from "./socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Bull(props) {
  const [state, setState] = useState({
    bullCow: {
      bull: 0,
      cow: 0,
    },
    guesses: [],
    gameActive: true,
  });
  const [curInput, setCurInput] = useState("");
  let { bullCow, guesses, gameActive } = state;

  useEffect(() => {
    ch_join(setState);
  });

  const resetGame = () => {
    ch_reset();
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
    ch_push({ guess: curInput });
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
      <Container id={"game-container"} fluid>
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
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
