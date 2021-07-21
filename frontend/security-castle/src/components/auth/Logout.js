import React, {useContext} from "react"
import {useHistory} from "react-router-dom"
import apis from "../../api";
import AuthContext from "../../context/AuthContext";

function LogoutButton() {

    const {getLoggedIn} = useContext(AuthContext)

    const history = useHistory()

    async function logout()
    {
        await apis.logoutUser()
        await getLoggedIn()
        history.push("/")

    }

    return <button onClick={logout}>
        Log Out
    </button>
}

export default LogoutButton