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
      setUser(gameUser);
      history.push("/setup");
    } else {
      toast.error("Need to Have a Valid Name");
    }
    
  }
  return (
    <div className={"landing-screen"}>
        <Card style={{ width: "50%" }}>
          <Card.Header>Welcome to Bulls and Cows!</Card.Header>
          <Card.Body id={"landing-card"}>
            <FormControl
              className={"landing-card-contents"}
              type={"text"}
              placeholder={"Game Name"}
              value={gameName}
              onInput={(e) => setGameName(e.target.value)}
            />
            <FormControl
              className={"landing-card-contents"}
              type={"text"}
              placeholder={"Username"}
              value={gameUser}
              onInput={(e) => setGameUser(e.target.value)}
            />
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
