import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../css/bull.css";
import MultiBullGame from "./components/multi-bull";

export default function MultiBull(props) {

  return (
    <div className="App">
      <MultiBullGame {...props}/>
    </div>
  );
}
