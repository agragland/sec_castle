import React, {useContext} from "react";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import AuthContext from "../context/AuthContext";
import AdminRouter from "./AdminRouter";
import CastleRouter from "./CastleRouter";

function Router() {

    const {loggedIn} = useContext(AuthContext)

    return(<BrowserRouter>
        <Navbar/>
        <Switch>
            <Route exact path="/">
                {loggedIn.state ? <Redirect to={"/castle"}/> : <Redirect to={"/register"}/>}
            </Route>
            {
                loggedIn.state === false && <>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route path="/login">
                        <div>
                            <Login/>
                        </div>
                    </Route>
                </>
            }
            {
                (loggedIn.state === true && loggedIn.role === "admin") &&
                <>
                    <Route path="/admin">
                        <div>
                            <AdminRouter/>
                        </div>
                    </Route>
                </>
            }
            {
                (loggedIn.state === true && loggedIn.role === "basic") &&
                <>
                    <Route path="/castle">
                        <div>
                            <CastleRouter/>
                        </div>
                    </Route>
                </>
            }



        </Switch>
    </BrowserRouter>)
}

export default Router;