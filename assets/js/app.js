// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html";
import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Popper from "popper.js";
import Bull from './bull';
import socket from "./socket";

ReactDOM.render(
    <Bull />,
  document.getElementById('root')
);