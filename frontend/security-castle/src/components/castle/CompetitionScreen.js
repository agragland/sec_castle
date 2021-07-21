import React, {useState, useEffect} from "react";
import {Switch, Route, Link, useRouteMatch, useParams} from "react-router-dom"
import apis from "../../api";
import PreviewCode from "../layout/PreviewCode";
import Countdown from "react-countdown";

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

    const ProblemScreen = () => {

        let{problem_id} = useParams()

        let problem = problems.filter(prob => {
            return prob.problem_id === problem_id
        })



        return <div>
            <h2>{problem.problem_name}</h2>
            <PreviewCode file={problem.oracle_file}/>
        </div>

    }

    const problemRouter = () => {
        return <Switch>
            <Route exact path={`${path}`}>
                <p>Select a problem</p>
            </Route>
            <Route path={`${path}/:problem_id`}>
                {ProblemScreen()}
            </Route>
        </Switch>
    }

    useEffect(() => {
        prepareComp()
    }, [])

    return (<div>
        <h1>{name}</h1>
        <p>{description}</p>
        {renderCountdown()}
        {problemNavbar()}
        {problemRouter()}
    </div>)

}

export default CompetitionScreen