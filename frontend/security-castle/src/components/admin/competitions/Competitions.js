import React, {useEffect, useState, useContext} from "react";
import apis from "../../../api";
import {Route, Switch, Link, useRouteMatch, matchPath} from "react-router-dom";
import Countdown from "react-countdown"
import CompetitionForm from "./CompetitionForm";
import AuthContext from "../../../context/AuthContext";
import ViewCompetition from "./ViewCompetition";


function Competitions() {

    const [competitions, setCompetitions] = useState([])
    const [creator, setCreator] = useState("")

    const {loggedIn, getLoggedIn} = useContext(AuthContext)
    let { path, url } = useRouteMatch()

    const match = matchPath(url,
        {
            path: `/admin/competitions`,
        })
    let createUrl = `${url}/create`
    let previewUrl = `${url}/view`
    if(!match) {
        createUrl = `${url}/competitions/create`
        previewUrl = `${url}/competitions/view`
    }

    async function getComps()
    {
        await getLoggedIn()
        setCreator(loggedIn.email)
        const compRes = await apis.getComps(loggedIn.email)
        if(compRes.data.success)
            setCompetitions(compRes.data.data)
        else
            setCompetitions([])
    }

    async function activateCompetition(comp) {
        comp.status = "active"
        await apis.activateComp(comp.join_id)
        getComps()
        renderActiveComps()
    }

    function renderWaitingComps()
    {
        return competitions.map((comp, i) => {
            if (comp.status === "waiting")
                return <>
                    <li key={i}>{comp.name}</li>
                    <button onClick={() => {activateCompetition(comp)}}>Activate</button>
                </>
        })
    }

    function renderActiveComps()
    {

        return competitions.map((comp, i) => {
            if (comp.status === "active")
                return <div key={i}>
                    <li >{comp.name}</li>
                    <Countdown date={comp.deadline}/>
                    <Link to={`${previewUrl}/${comp.join_id}`}>View</Link>
                </div>
        })
    }

    function renderCompletedComps()
    {
        return competitions.map((comp, i) => {
            if (comp.status === "complete")
                return <>
                    <li key={i}>{comp.name}</li>
                </>
        })
    }

    useEffect( () => {
        getComps()
    }, [])


    return(
        <div>

            <Switch>
                <Route exact path={path}>
                    <h1>Competitions</h1>
                    <Link to={`${createUrl}`}>Create Competition</Link>
                    <h2>Queued Competitions</h2>
                    <ul>
                        {renderWaitingComps()}
                    </ul>
                    <h2>Active Competitions</h2>
                    <ul>
                        {renderActiveComps()}
                    </ul>
                    <h2>Completed Competitions</h2>
                    <ul>
                        {renderCompletedComps()}
                    </ul>
                </Route>
                <Route path={`${path}/create`}>
                    <CompetitionForm creator={creator} getComps={getComps}/>
                </Route>
                <Route path={`${path}/view/:join_id`}>
                    <ViewCompetition/>
                </Route>
            </Switch>

        </div>
    )

}

export default Competitions