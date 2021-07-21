import React from "react";
import {Switch, Route, useRouteMatch, Link} from "react-router-dom";
import AdminMain from "../components/admin/AdminMain";
import Competitions from "../components/admin/competitions/Competitions";
import Problems from "../components/admin/problems/Problems";


function AdminRouter() {

    let { path, url } = useRouteMatch()

    return (
        <div>
            <Link to={`${url}/problems`}>Problems</Link>
            <Link to={`${url}/competitions`}>Competitions</Link>

            <Switch>
                <Route exact path={path}>
                    <AdminMain/>
                </Route>
                <Route path={`${path}/competitions`}>
                    <Competitions/>
                </Route>
                <Route path={`${path}/problems`}>
                    <Problems/>
                </Route>
            </Switch>
        </div>
    )

}



export default AdminRouter