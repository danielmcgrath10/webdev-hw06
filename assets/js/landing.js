import React, { useState } from "react";
import "../css/landing.css";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import _ from "lodash";
import {toast} from "react-toastify";

export default function Landing(props) {
  const history = useHistory();
  const {setName, setUser} = props;
  const [activeBtn, setActiveBtn] = useState(0);
  const [gameName, setGameName] = useState("");
  const [gameUser, setGameUser] = useState("");

  const handleSubmit = () => {
    if(!_.isEmpty(gameName)){
      setName(gameName);
      if(activeBtn == 2) {
        setName(gameName);
        setUser(gameUser);
        history.push("/multibull");
      } else if(activeBtn == 1) {
        console.log(gameName);
        setName(gameName);
        history.push("/bull");
      } 
    } else {
      toast.error("Need to Have a Valid Name");
    }
    
  }
  return (
    <div className={"landing-screen"}>
        <Card style={{ width: "50%" }}>
          <Card.Header>Welcome to Bulls and Cows!</Card.Header>
          <Card.Body id={"landing-card"}>
            <ButtonGroup className={"landing-card-contents"}>
              <Button
                variant={"outline-primary"}
                active={activeBtn == 1}
                onClick={() => setActiveBtn(1)}
              >
                Single
              </Button>
              <Button
                variant={"outline-primary"}
                active={activeBtn == 2}
                onClick={() => setActiveBtn(2)}
              >
                Multiplayer
              </Button>
            </ButtonGroup>
            <FormControl
              className={"landing-card-contents"}
              type={"text"}
              placeholder={"Game Name"}
              value={gameName}
              onInput={(e) => setGameName(e.target.value)}
            />
            {activeBtn == 2 ? (
              <FormControl
                className={"landing-card-contents"}
                type={"text"}
                placeholder={"Username"}
                value={gameUser}
                onInput={(e) => setGameUser(e.target.value)}
              />
            ) : null}
            <Button
              className={"landing-card-contents"}
              variant={"outline-secondary"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Card.Body>
        </Card>
    </div>
  );
}
