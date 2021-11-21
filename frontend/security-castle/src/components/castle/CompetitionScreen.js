import React, {useState, useEffect, useContext} from "react";
import {Switch, Route, Link, useRouteMatch, useParams} from "react-router-dom"
import apis from "../../api";
import Countdown from "react-countdown";
import ProblemScreen from "./CompProblemScreen";
import AuthContext from "../../context/AuthContext";

function CompetitionScreen() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState("")
    const [problems, setProblems] = useState([])
    const [status, setStatus] = useState("")
    const [deadline, setDeadline] = useState("")
    const [user_flaw, setUserFlaw] = useState("")

    let {loggedIn, getLoggedIn} = useContext(AuthContext)
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

        await getLoggedIn()


        await apis.getCompByJoinID(join_id).then(compRes =>{
            let comp = compRes.data.data
            setName(comp.name)
            setDescription(comp.description)
            setDuration(comp.duration)
            setProblems(comp.problems)
            setStatus(comp.status)
            setDeadline(comp.deadline)

           comp.user_flaws.forEach(user_flaw => {
                if(user_flaw.user === loggedIn.email)
                {
                    setUserFlaw(user_flaw)
                }
            })
        })
    }

    const problemRouter = () => {
        {
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
                    <ProblemScreen user_flaw={user_flaw}/>
                </Route>
            </Switch>
        }

    }

    useEffect(() => {
        prepareComp()
    }, [])

    return (<div>
        {problemRouter()}
    </div>)

}

export default CompetitionScreen