import React, {createContext, useEffect, useState} from "react"
import apis from "../api";

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [loggedIn, setLoggedIn] = useState({
        state: false,
        email: "",
        role: ""
    })

    async function getLoggedIn() {
        const loggedInRes = await apis.loggedUser()
        setLoggedIn(loggedInRes.data)
    }

    useEffect(() => {
        getLoggedIn()
    }, [])

    return (<AuthContext.Provider value={{loggedIn, getLoggedIn}}>
        {props.children}
    </AuthContext.Provider>)


}


export default AuthContext
export {AuthContextProvider}