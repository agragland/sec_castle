import React from "react";
import {withRouter} from "react-router"
import apis from "../../../api";

class ViewResults extends React.Component {
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
            deadline: ""
        }
    }
    renderResults = () => {
        function renderProblems(problems) {
            return problems.map((problem, i) => {
                return (
                    <div key={i}>
                        <p>Problem {problem.problem_id} - Score: {problem.score} - Attempts: {problem.num_attempts-problem.attempts.length} </p>
                    </div>
                )
            })
        }

        return this.state.user_flaws.map((user, i) => {
            return (
                <div key={i}>
                    <h2>
                        {user.user}
                    </h2>
                    {renderProblems(user.problems)}
                </div>
            )
        })
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

    render = () => {
        return <div>
            <h1>View Results</h1>
            <ul>
                <li>{this.state.name}</li>
                <li>{this.state.description}</li>
            </ul>
            {this.renderResults()}
        </div>
    }

}

export default withRouter(ViewResults)