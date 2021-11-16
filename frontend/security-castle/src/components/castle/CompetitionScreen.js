import React, {useState, useEffect} from "react";
import {Switch, Route, Link, useRouteMatch, useParams} from "react-router-dom"
import apis from "../../api";
import Countdown from "react-countdown";
import ProblemScreen from "./CompProblemScreen";

function CompetitionScreen() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState("")
    const [problems, setProblems] = useState([])
    const [status, setStatus] = useState("")
    const [deadline, setDeadline] = useState("")

    let {join_id} = useParams()
    let {path, url} = useRouteMatch()


    const renderCountdown = () => {
        if(deadline)
        {
            return <div>
                <p>Time Remaining <Countdown date={deadline}/></p>
            </div>
        }
    }

    const problemNavbar = () => {
        return problems.map((problem, i) => {
            return <div key={i}>
                <Link to={`${url}/${problem.problem_id}`}>{problem.problem_name}</Link>
            </div>
            }
        )
    }

    const prepareComp = async () => {
        await apis.getCompByJoinID(join_id).then(compRes =>{
            let comp = compRes.data.data
            console.log(comp)
            setName(comp.name)
            setDescription(comp.description)
            setDuration(comp.duration)
            setProblems(comp.problems)
            setStatus(comp.status)
            setDeadline(comp.deadline)
        })
    }

    const problemRouter = () => {
        return <Switch>
            <Route exact path={`${path}`}>
                <h1>{name}</h1>
                <p>{description}</p>
                {renderCountdown()}
                <p>Select a problem</p>
                {problemNavbar()}
            </Route>
            <Route path={`${path}/:problem_id`}>
                {renderCountdown()}
                <ProblemScreen problems={problems}/>
            </Route>
        </Switch>
    }

    useEffect(() => {
        prepareComp()
    }, [])

    return (<div>

        {problemRouter()}
    </div>)

}

export default CompetitionScreen