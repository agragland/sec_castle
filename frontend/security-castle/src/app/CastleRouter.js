import React from "react"
import {Switch, Route, useRouteMatch, Link} from "react-router-dom";
import CompetitionMain from "../components/castle/CompetitionMain";
import CompetitionScreen from "../components/castle/CompetitionScreen";

function CastleRouter()
{
    let { path, url } = useRouteMatch()

    return (
        <div>
            <h1>Security Castle</h1>
            <Switch>
                <Route exact path={path}>
                    <CompetitionMain/>
                </Route>
                <Route path={`${path}/join/:join_id`}>

                </Route>
                <Route path={`${path}/competition/:join_id`}>
                    <CompetitionScreen/>
                </Route>
            </Switch>

        </div>
    )
}

export default CastleRouter