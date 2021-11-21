import React, {useState, useEffect, useContext} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router-dom"
import apis from "../../api";
import PreviewCode from "../layout/PreviewCode";
import AuthContext from "../../context/AuthContext";

const ProblemScreen = (user_flaw) => {
    const [num_attempts, setNumAttempts] = useState(0)
    const [attempts, setAttempts] = useState([])
    const [score, setScore] = useState(0)
    const [curr_prob, setCurrProb] = useState("")
    let flaw_selection = []

    let {loggedIn} = useContext(AuthContext)
    let {join_id, problem_id} = useParams()
    let {path, url} = useRouteMatch()
    const history = useHistory()



    const goBack = () => {
        history.goBack()
    }

    async function prepareProblem()
    {
        let payload = {
            user: loggedIn.email,
            problem_id: parseInt(problem_id)
        }

        await apis.getProbFlawInfo(join_id, payload).then(response => {
            let prob = response.data.data
            console.log(prob)
            setAttempts(prob.attempts)
            setNumAttempts(prob.num_attempts)
            setScore(prob.score)
        })
        await apis.getProblemByProblemID(parseInt(problem_id)).then(probRes => {
            setCurrProb(probRes.data.data)
        })
    }

    async function submitAttempt()
    {
        let payload = {
            user: loggedIn.email,
            problem_id: parseInt(problem_id),
            attempts: attempts,
            score: score
        }
        if(Array.isArray(flaw_selection))
        {
            if(payload.attempts.length > 0)
            {
                let filteredAttempt = []
                let filterFlag
                flaw_selection.forEach(value => {
                    filterFlag = false
                    payload.attempts.forEach(arr => {
                        if(arr.includes(value))
                        {
                            console.log(true + " " + value)
                            filterFlag = true
                        }
                    })

                    if(!filterFlag)
                    {
                        console.log(false + " " + value)
                        filteredAttempt.push(value)
                    }
                })

                filteredAttempt.forEach(value => {
                    if(curr_prob.flaw_lines.includes(parseInt(value)))
                    {
                        payload.score++
                    }
                })

            }
            else
            {
                flaw_selection.forEach(value => {
                    if(curr_prob.flaw_lines.includes(parseInt(value)))
                    {
                        payload.score++
                    }
                })
            }
            payload.attempts = [...payload.attempts, flaw_selection]
        }


        await apis.updateProbFlawInfo(join_id, payload).then(response =>{
            let update_flaw = response.data
            setAttempts(update_flaw.attempts)
            setScore(update_flaw.score)
        })



    }

    let flawHandler = data => {
        flaw_selection = data
    }

    useEffect(() => {
        prepareProblem()
    }, [])


    if(curr_prob === "" || num_attempts === 0)
    {
        return <div/>
    }
    else if(curr_prob.flaw_lines.length === score)
    {
        console.log({
            attempts,
            score
        })

        return (<div>
            <button type="button" onClick={goBack}>
                Go Back
            </button>
            <h2>Complete!</h2>
            <h2>{curr_prob.problem_name} -- Attempts: {num_attempts-attempts.length}</h2>
            <p>Current score: {score}</p>
            <PreviewCode file={curr_prob.src_file}/>
        </div>)
    }
    else if(attempts.length === num_attempts)
    {
        console.log({
            attempts,
            score
        })

        return (<div>
            <button type="button" onClick={goBack}>
                Go Back
            </button>
            <h2>All attempts used</h2>
            <h2>{curr_prob.problem_name} -- Attempts: {num_attempts-attempts.length}</h2>
            <p>Total score: {score}</p>
            <PreviewCode file={curr_prob.src_file}/>
        </div>)
    }
    else
    {
        console.log({
            attempts,
            score
        })

        return (<div>
            <button type="button" onClick={goBack}>
                Go Back
            </button>
            <h2>{curr_prob.problem_name} -- Attempts: {num_attempts-attempts.length}</h2>
            <p>Current score: {score}</p>
            <PreviewCode file={curr_prob.oracle_file} check_flag={true} onChange={flawHandler}/>
            <button type={"button"} onClick={submitAttempt}>
                Submit
            </button>
        </div>)
    }


}

export default ProblemScreen