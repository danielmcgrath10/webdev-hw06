import React from "react";
import _ from "lodash";
import "../css/bull.css";
import BullGame from "./components/bullGame";

export default function Bull(props) {

  return (
    <div className="App">
      <BullGame {...props}/>
    </div>
  );
}
