import React from "react"
import {Link, useRouteMatch, matchPath} from "react-router-dom"

function ProblemList({ problems }) {

    let { url } = useRouteMatch()

    function renderProblems()
    {
        const match = matchPath(url,
            {
                path: `/admin/problems`,
            })

        let updateUrl = `${url}/update`
        let previewUrl = `${url}/view`

        if(!match) {
            updateUrl = `${url}/problems/update`
            previewUrl = `${url}/problems/view`
        }

        return problems.map((problem, i, j) => {
            return (
                <div key={i}>
                    <li>{problem.problem_name} {problem.problem_id}</li>
                    <Link to={`${updateUrl}/${problem.problem_id}`}>Update</Link>
                    <Link to={`${previewUrl}/${problem.problem_id}`}>View</Link>
                </div>
            )
        })
    }

    return (<>
        <ul>
            {renderProblems()}
        </ul>
    </>)

}

export default ProblemList