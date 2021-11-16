import React, {useState, useEffect} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router-dom"
import apis from "../../api";
import PreviewCode from "../layout/PreviewCode";

const ProblemScreen = () => {

    const [curr_prob, setCurrProb] = useState("")

    let {problem_id} = useParams()
    let {path, url} = useRouteMatch()
    const history = useHistory()

    const goBack = () => {
        history.goBack()
    }

    async function prepareProblem()
    {
        console.log(path)
        console.log(url)
        await apis.getProblemByProblemID(parseInt(problem_id)).then(probRes => {
            setCurrProb(probRes.data.data)
        })
    }

    let flawHandler = data => {
        console.log(data)
    }

    useEffect(() => {
        prepareProblem()
    }, [])


    if(curr_prob === "")
    {
        return <div/>
    }
    else
    {
        return (<div>
            <button type="button" onClick={goBack}>
                Go Back
            </button>
            <h2>{curr_prob.problem_name}</h2>
            <PreviewCode file={curr_prob.oracle_file} check_flag={true} onChange={flawHandler}/>
        </div>)
    }


}

export default ProblemScreen