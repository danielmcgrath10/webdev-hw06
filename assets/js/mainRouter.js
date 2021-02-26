import React, { Suspense, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Landing from "./landing";
import Bull from "./bull";
import { ToastContainer } from "react-toastify";
import MultiBull from "./multibull";
import SetupPage from "./setup";

export default function MainRouter(props) {
  const [name, setName] = useState(undefined);
  const [user, setUser] = useState(undefined);
  return (
    <div className={"App"}>
      <Suspense>
        <Switch>
          <Route
            path={"/home"}
            render={(props) => (
              <Landing {...props} setUser={setUser} setName={setName} />
            )}
          />
          <Route path={"/setup"} render={(props) => <SetupPage name={name} {...props}/>}/>
          <Route
            path={"/multibull"}
            render={(props) => (
              <MultiBull
                {...props}
                name={name}
                setName={setName}
                user={user}
                setUser={setUser}
              />
            )}
          />
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
