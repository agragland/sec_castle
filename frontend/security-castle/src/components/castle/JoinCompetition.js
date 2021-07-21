import React, {useContext, useState, useEffect} from "react"
import {useHistory, useRouteMatch} from "react-router-dom"
import apis from "../../api"
import AuthContext from "../../context/AuthContext";

function JoinCompetition() {

    const [join_id, setJoinID] = useState("")
    const [user, setUser] = useState("")

    const {path, url} = useRouteMatch()

    const {loggedIn, getLoggedIn} = useContext(AuthContext)
    const history = useHistory()

    async function joinCompetition(e) {
        e.preventDefault()

        try {
            const payload = {user}
            let res = await apis.joinComp(join_id, payload)
            if(res.status === 400)
            {

            }
            else
            {
                history.push(`/competition/${join_id}`)
            }
        }
        catch(err) {
            console.log(err)
        }


    }

    async function getUser()
    {
        await getLoggedIn()
        setUser(loggedIn.email)
    }

    useEffect(() => {
        getUser()
    }, [])

    return <div>
        <h1>Join Competition</h1>
        <form onSubmit={joinCompetition}>
            <label>Join ID:</label>
            <input
                type={"string"}
                placeholder={"Join ID"}
                onChange={(e) => setJoinID(e.target.value)}
            />
            <button>Join</button>
        </form>
    </div>
}

export default JoinCompetition