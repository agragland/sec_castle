import React, {useContext, useState} from 'react';
import apis from "../../api";
import AuthContext from "../../context/AuthContext";
import {useHistory} from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {getLoggedIn} = useContext(AuthContext)
    const history = useHistory()

    async function login(e) {
        e.preventDefault();

        try {
            const loginData = {
                email,
                password
            };

            let loginRes = await apis.loginUser(loginData)
            await getLoggedIn()
            if(loginRes.data.role === "admin")
                history.push("/admin")
            else
                history.push("/castle")

        } catch(err) {
            console.log(err);
        }


    }

    return <div>
        <h1>Login</h1>
        <form onSubmit={login}>
            <input
                type={"email"}
                placeholder={"Email"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                type={"password"}
                placeholder={"Password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button type={"submit"}>Login</button>
        </form>
    </div>

}

export default Login;