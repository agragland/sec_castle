import React, {useEffect, useState} from "react"
import ProblemForm from "./ProblemForm";
import ProblemList from "./ProblemList";
import UpdateProblem from "./UpdateProblem";
import ViewProblem from "./ViewProblem";
import apis from "../../../api";
import {Route, Switch, Link, useRouteMatch, matchPath} from "react-router-dom";


function Problems() {

    const [problems, setProblems] = useState([])
    const [problem, setProblem] = useState({})
    let { path, url } = useRouteMatch()

    const match = matchPath(url,
        {
            path: `/admin/problems`,
        })
    let createUrl = `${url}/create`
    if(!match) {
        createUrl = `${url}/problems/create`
    }

    async function getProblems()
    {
        const problemRes = await apis.getProblems()
        if(problemRes.data.success)
            setProblems(problemRes.data.data)
        else
            setProblems([])
    }

    useEffect(() => {
        getProblems()
    }, [])

    return (<div>


        <Switch>
            <Route exact path={path}>
                <h1>Problems</h1>
                <Link to={`${createUrl}`}>Create Problem</Link>
                <ProblemList problems={problems}/>
            </Route>
            <Route path={`${path}/update/:prob_id`}>
                <UpdateProblem getProblems={getProblems}/>
            </Route>
            <Route path={`${path}/create`}>
                <ProblemForm getProblems={getProblems}/>
            </Route>
            <Route path={`${path}/view/:prob_id`}>
                <ViewProblem getProblems={getProblems}/>
            </Route>
        </Switch>


    </div>)

}

export default Problems