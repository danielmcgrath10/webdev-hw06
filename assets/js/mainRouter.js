import React, { Suspense } from "react";
import "../css/landing.css";
import {Switch, Route, Redirect} from "react-router-dom";
import Landing from "./landing";
import Bull from "./bull";

export default function MainRouter(props) {
    return(
        <div className={"App"}>
            <Suspense>
                <Switch>
                    <Route path={"/home"} render={(props) => <Landing {...props}/>}/>
                    {/* <Route path={"/loading"} render={(props) => <Landing {...props}/>}/> */}
                    <Route path={"/bullcow"} render={(props) => <Bull {...props}/>}/>
                    <Route exact path={"/"}><Redirect to={"/home"}/></Route>
                </Switch>
            </Suspense>
        </div>
    )
}