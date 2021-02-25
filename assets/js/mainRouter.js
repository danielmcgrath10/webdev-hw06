import React, { Suspense, useState } from "react";
import "../css/landing.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Landing from "./landing";
import Bull from "./bull";
import {ToastContainer} from "react-toastify";

export default function MainRouter(props) {
  const [name, setName] = useState(undefined);
  return (
    <div className={"App"}>
      <Suspense>
        <Switch>
          <Route
            path={"/home"}
            render={(props) => <Landing {...props} setName={setName} />}
          />
          {/* <Route path={"/loading"} render={(props) => <Loading {...props}/>}/> */}
          <Route path={"/multibull"} render={(props) => <Bull {...props} />} />
          <Route
            path={"/bull"}
            render={(props) => (
              <Bull {...props} name={name} setName={setName} />
            )}
          />
          <Route exact path={"/"}>
            <Redirect to={"/home"} />
          </Route>
        </Switch>
      </Suspense>
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
