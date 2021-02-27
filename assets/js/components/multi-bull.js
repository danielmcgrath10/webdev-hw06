import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../../css/bull.css";
import {
  Button,
  Card,
  Col,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ch_join, ch_reset, ch_push, state_update } from "../socket";
import { useHistory } from "react-router-dom";

export default function MultiBullGame(props) {
  const {channel, name, setName, user, setUser } = props;
  const history = useHistory();

  const [state, setState] = useState({
    guesses: [],
    gameActive: false,
    name: undefined
  });
  const [curInput, setCurInput] = useState("");
  let { bullCow, guesses, gameActive } = state;

  useEffect(() => {
    if(gameActive === false){
      history.push("/setup");
    }
    ch_join(setState);
    channel.on("view", state_update);
  }, [gameActive]);

  const resetGame = () => {
    ch_reset(channel);
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
    ch_push(channel, {guess: curInput});
    setCurInput("");
  };

  const getTableData = () => {
    return guesses.map((element, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{element.guess}</td>
        <td>{element.eval.bull}</td>
        <td>{element.eval.cow}</td>
      </tr>
    ));
  };

  return (
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
                history.push("/setup");
            }}
            >
            Cancel
            </Button>
            Bulls and Cows: {name}
        </Card.Header>
        <Card.Body id={"game-container"}>
            <>
                <Row id={"display-row"}>
                <Col>
                    Result: {`${bullCow[user].eval} bulls and ${bullCow.cow} cows`}
                </Col>
                <Col>
                    <Table striped bordered size="sm">
                    <thead>
                        <tr>
                          <th>Name</th>
                          <th>Guess</th>
                          <th>Bulls</th>
                          <th>Cows</th>
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
        </Card.Body>
    </Card>
  );
}
