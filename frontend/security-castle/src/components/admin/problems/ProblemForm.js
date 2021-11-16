import React, {useState} from "react"
import {useHistory} from "react-router-dom"
import apis from "../../../api"

function ProblemForm({getProblems}) {

    const [problem_id, setProblemID] = useState("")
    const [problem_name, setProblemName] = useState("")
    const [description, setDesc] = useState("")
    const [oracle_file, setOracleFile] = useState("")
    const [src_file, setSrcFile] = useState("")
    const [difficulty, setDiff] = useState("")
    const [flaw_lines, setFlawLines] = useState([])
    const history = useHistory()

    async function submitProblem(e) {
        e.preventDefault();

        try {

            const formData = new FormData()
            formData.append('problem_id',problem_id)
            formData.append('problem_name', problem_name)
            formData.append('description', description)
            formData.append('difficulty',difficulty)
            formData.append('files', oracle_file)
            formData.append('files',src_file)
            formData.append('flaw_lines',flaw_lines)

            console.log(flaw_lines)

            await apis.submitProblem(formData)
            getProblems()
            history.push("/admin/problems")

        }
        catch (err) {
            console.log(err)
        }
    }




    return <div>
        <h1>Create Problem</h1>
        <form onSubmit={submitProblem} id={"problem_form"}>
            <input
                type={"integer"}
                placeholder={"Problem ID"}
                onChange={(e) => setProblemID(e.target.value)}
                value = {problem_id}
            />
            <input
                type={"string"}
                placeholder={"Problem Title"}
                onChange={(e) => setProblemName(e.target.value)}
                value = {problem_name}
            />
            <input
                type={"string"}
                placeholder={"Problem Description"}
                onChange={(e) => setDesc(e.target.value)}
                value = {description}
            />
            <input
                type={"file"}
                name={"files"}
                onChange={(e) => {
                    setOracleFile(e.target.files[0])
                }}
            />
            <input
                type={"file"}
                name={"files"}
                onChange={(e) => {
                    setSrcFile(e.target.files[0])
                }}
            />
            <input
                type={"string"}
                placeholder={"Difficulty"}
                onChange={(e) => setDiff(e.target.value)}
                value = {difficulty}
            />
            <input
                type={"string"}
                placeholder={"Flaw Lines"}
                onChange={(e) => setFlawLines(e.target.value)}
            />
            <button>Submit</button>
        </form>
    </div>

}

export default ProblemForm