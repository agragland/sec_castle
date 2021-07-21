import React from "react";
import {withRouter} from "react-router"
import apis from "../../../api";
import PreviewCode from "../../layout/PreviewCode";
import Countdown from "react-countdown";

class ViewCompetition extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            join_id: "",
            duration: "",
            users: [],
            problems: [],
            user_flaws: [],
            status: "",
            deadline: "",
        }
    }

    getProblems = () => {

    }

    renderProblems = () => {
       return this.state.problems.map((problem, i) => {
            return (
                <div key={i}>
                    <h2>{problem.problem_name} - {problem.difficulty}</h2>
                    <h3>Oracle Preview</h3>
                    <PreviewCode file={problem.oracle_file}/>
                    <h3>Source Preview</h3>
                    <PreviewCode file={problem.src_file}/>
                </div>)

        })
    }

    renderCountdown = () => {
        if(this.state.deadline)
        {
            return <div>
                <p>Time Remaining <Countdown date={this.state.deadline}/></p>
            </div>
        }
    }

    componentDidMount = async () => {
        await apis.getCompByJoinID(this.props.match.params.join_id).then(compRes => {
            let comp = compRes.data.data
            this.setState( () => ({
                name: comp.name,
                description: comp.description,
                join_id: comp.join_id,
                duration: comp.duration,
                users: comp.users,
                problems: comp.problems,
                user_flaws: comp.user_flaws,
                status: comp.status,
                deadline: comp.deadline,
            }))
        })
    }

    render()
    {
        return <div>
            <h1>View Competition</h1>
            <ul>
                <li>{this.state.name}</li>
                <li>{this.state.description}</li>
                <li>{this.state.status}</li>
            </ul>
            {this.renderCountdown()}
            {this.renderProblems()}
        </div>
    }

}

export default withRouter(ViewCompetition)