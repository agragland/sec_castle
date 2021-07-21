import React from "react";
import {withRouter} from "react-router"
import {Link} from "react-router-dom"
import apis from "../../../api";

class CompetitionForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            creator: "",
            duration: "",
            problems_available: [],
            problems_selected: [],
        }
    }

    componentDidMount = async () => {
        const problemRes = await apis.getProblems()
        if(problemRes.data.success)
                this.setState( () => ({
                    problems_available: problemRes.data.data
                }))
        else
            this.setState( () => ({
                problems_available: []
            }))
        this.setState( () => ({
            creator: this.props.creator
        }))
    }

    getComps = () => {
        this.props.getComps()
    }

    submitCompetition = async (e) => {
        e.preventDefault();
        try {
            let {name, description, creator, duration} = this.state
            let problems = []

            if(this.state.problems_selected.length)
                this.state.problems_selected.forEach(problem => {
                    problems.push(problem._id)
                })
            else
            {
                return
            }

            const payload = {name, description, creator, duration, problems}

            await apis.createComp(payload)
            this.getComps()
            this.props.history.push("/admin/competitions")
        }
        catch(err) {
            console.log(err)
        }
    }

    renderSelectedProblems = () => {
        return this.state.problems_selected.map((problem, i) => {
            return (
                <div>
                    <li>{problem.problem_name} {problem.description}</li>
                    <Link to={``}>Preview</Link>
                    <button onClick={() => {this.removeProblemFromComp(problem)}}>Remove</button>
                </div>
            )
        })
    }

    renderAvailableProblems = () => {
        return this.state.problems_available.map((problem, i) => {
            return (
                <div>
                    <li>{problem.problem_name} {problem.description}</li>
                    <Link to={``}>Preview</Link>
                    <button onClick={() => {this.addProblemToComp(problem)}}>Add</button>
                </div>
            )
        })
    }

    addProblemToComp = (problem) => {
        let availArr = [...this.state.problems_available]
        let selectedArr = [...this.state.problems_selected]
        let index = availArr.indexOf(problem)
        if(index > -1)
        {
            availArr.splice(index, 1)
            selectedArr.push(problem)
            this.setState(() => ({
                    problems_available: availArr,
                    problems_selected: selectedArr
            }))
        }
    }

    removeProblemFromComp = (problem) => {
        let availArr = [...this.state.problems_available]
        let selectedArr = [...this.state.problems_selected]
        let index = selectedArr.indexOf(problem)
        if(index > -1)
        {
            selectedArr.splice(index, 1)
            availArr.push(problem)
            this.setState(() => ({
                problems_available: availArr,
                problems_selected: selectedArr
            }))
        }
    }

    render()
    {
        return <div>
            <h1>Create Competition</h1>
            <form onSubmit={this.submitCompetition}>
                <input
                    type={"string"}
                    placeholder={"Competition Name"}
                    onChange={(e) => this.setState(() => ({name: e.target.value}))}
                    value = {this.state.name}
                />
                <input
                    type={"string"}
                    placeholder={"Description"}
                    onChange={(e) => this.setState(() => ({description: e.target.value}))}
                    value = {this.state.description}
                />
                <input
                    type={"number"}
                    placeholder={"Duration"}
                    onChange={(e) => this.setState(() => ({duration: e.target.value}))}
                    value = {this.state.duration}
                    min={"5"}
                    max={"300"}
                />
                <button>Submit</button>
            </form>
            <h2>Selected Problems</h2>
            <ul>
                {this.renderSelectedProblems()}
            </ul>
            <h2>Available Problems</h2>
            <ul>
                {this.renderAvailableProblems()}
            </ul>
        </div>
    }
}

export default withRouter(CompetitionForm)