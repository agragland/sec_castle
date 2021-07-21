import React from "react";
import {withRouter} from "react-router"
import apis from "../../../api";
import PreviewCode from "../../layout/PreviewCode";

class UpdateProblem extends React.Component {

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
            console.log(prob)
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

    submitUpdate = async (e) => {
        e.preventDefault();
        try {
            const problemData = this.state

            await apis.updateProblem(this.state.problem_id,problemData)
            this.getProblems()
            this.props.history.push("/admin/problems")

        }
        catch (err) {
            console.log(err)
        }
    }

    render()
    {
        return <div>
            <h1>Update Problem</h1>
            <form onSubmit={this.submitUpdate}>
                <input
                    type={"string"}
                    placeholder={"Problem Title"}
                    onChange={(e) => this.setState( () => ({problem_name: e.target.value}))}
                    value = {this.state.problem_name}
                />
                <input
                    type={"string"}
                    placeholder={"Problem Description"}
                    onChange={(e) => this.setState( () => ({description: e.target.value}))}
                    value = {this.state.description}
                />
                <input
                    type={"file"}
                    name={"files"}
                    onChange={(e) => {
                        this.setState( () => ({oracle_file: e.target.files[0]}))
                    }}
                    accept={"text/*"}
                />
                <input
                    type={"file"}
                    name={"files"}
                    onChange={(e) => {
                        this.setState( () => ({src_file: e.target.files[0]}))
                    }}
                    accept={"text/*"}
                />
                <input
                    type={"string"}
                    placeholder={"Difficulty"}
                    onChange={(e) => this.setState( () => ({difficulty: e.target.value}))}
                    value = {this.state.difficulty}
                />
                <button>Submit</button>
            </form>
            <h2>Oracle Preview</h2>
            <PreviewCode file={this.state.oracle_file}/>
            <h2>Source Preview</h2>
            <PreviewCode file={this.state.src_file}/>
        </div>
    }

}

export default withRouter(UpdateProblem)