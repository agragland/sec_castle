import React from "react";
import {withRouter} from "react-router"
import apis from "../../../api";
import PreviewCode from "../../layout/PreviewCode";

class ViewProblem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            problem_id: "",
            problem_name: "",
            description: "",
            oracle_file: "",
            src_file: "",
            difficulty: ""
        }
    }

    getProblems = () => {
        this.props.getProblems()
    }

    componentDidMount = async () => {
        await apis.getProblemByProblemID(this.props.match.params.prob_id).then(probRes => {
            let prob = probRes.data.data
            this.setState( () => ({
                problem_id: prob.problem_id,
                problem_name: prob.problem_name,
                description: prob.description,
                oracle_file: prob.oracle_file,
                src_file: prob.src_file,
                difficulty: prob.difficulty,
            }))

        })
    }

    render()
    {
        return <div>
            <h1>View Problem</h1>
            <ul>
                <li>{this.state.problem_id}</li>
                <li>{this.state.problem_name}</li>
                <li>{this.state.description}</li>
                <li>{this.state.difficulty}</li>
            </ul>
            <h2>Oracle Preview</h2>
            <PreviewCode file={this.state.oracle_file}/>
            <h2>Source Preview</h2>
            <PreviewCode file={this.state.src_file}/>
        </div>
    }

}

export default withRouter(ViewProblem)