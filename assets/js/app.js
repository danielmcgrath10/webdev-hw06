// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import _ from "lodash";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import NotificationContainer from "react-notifications/lib/NotificationContainer";

function App() {
  const [targetNum, setTargetNum] = useState(undefined);
  const [numGuesses, setNumGuesses] = useState(8);
  const [bullCow, setBullCow] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [curInput, setCurInput] = useState("");

  useEffect(() => {
    if (!targetNum) {
      setNewNum();
    }
  });

  // Received some inspiration on how to get unique digits for this from Stack Overflow
  const setNewNum = () => {
    let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    arr = _.shuffle(arr).slice(0, 4).join("");
    setTargetNum(arr);
  };

  const resetGame = () => {
    setBullCow("");
    setGuesses([]);
    setCurInput("");
    setNewNum();
    setNumGuesses(8);
  };

  const handleInput = (e) => {
    let input = e.target.value;
    if (input !== curInput && input <= 9999) {
      setCurInput(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkWin(e);
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

  const checkCowBull = () => {
    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < curInput.length; i++) {
      let curLetter = curInput[i];
      if (curLetter === targetNum[i]) {
        bulls++;
      } else if (_.includes(targetNum, curLetter)) {
        cows++;
      }
    }
    numGuesses === 1
      ? setBullCow("Out of Guesses")
      : setBullCow(`${bulls} bulls and ${cows} cows`);
  };

  const checkWin = () => {
    if (numGuesses > 0) {
      if (
        _.isEmpty(curInput) ||
        curInput < 1000 ||
        curInput > 9999 ||
        !isValid()
      ) {
        NotificationManager.error("Needs to be a Valid Input");
        return;
      }
      if (!_.isEqual(curInput, targetNum)) {
        checkCowBull();
        setGuesses([...guesses, curInput]);
        setNumGuesses(numGuesses - 1);
      } else {
        setBullCow("You WIN!!!!!!!!");
        setNumGuesses(0);
      }
      setCurInput("");
    } else {
      NotificationManager.error("Game is Over, Need to Reset");
    }
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
        <Row id={"display-row"}>
          <Col>Result: {bullCow}</Col>
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
      </Container>
      <NotificationContainer />
    </div>
  );
}

export default App;