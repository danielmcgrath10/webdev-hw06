import React, { useState } from "react";
import "../css/landing.css";
import { Button, Card, Container, Form, FormControl, InputGroup } from "react-bootstrap";

export default function Landing() {
    const [login, setLogin] = useState(false);
  return (
    <div className={"landing-screen"}>
        {
            login ?
                <Container fluid>

                </Container>
            :
                <Card style={{ width: "50%" }}>
                    <Card.Header>Please Login With Name</Card.Header>
                    <Card.Body>
                    <Card.Text>
                    <InputGroup className={"mb-2"}>
                        <FormControl
                            type={"text"}
                        />
                        <InputGroup.Append>
                        <Button variant={"outline-secondary"}>
                            Submit
                        </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Card.Text>
                    </Card.Body>
                </Card>
        }
    </div>
  );
}
