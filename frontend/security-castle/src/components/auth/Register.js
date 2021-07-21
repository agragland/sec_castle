import React, {useContext, useState} from 'react';
import apis from "../../api";
import AuthContext from "../../context/AuthContext";
import {useHistory} from "react-router-dom";

function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pass_confirm, setPassConfirm] = useState("");
    const [role, setRole] = useState(false);

    const {getLoggedIn} = useContext(AuthContext)
    const history = useHistory()

    async function register(e) {
        e.preventDefault();

        try {
            const registerData = {
                name,
                email,
                password,
                pass_confirm,
                role: role ? "admin": "basic"
            };

            await apis.registerUser(registerData)
            await getLoggedIn()
            if(role)
                history.push("/admin")
            else
                history.push("/")

        } catch(err) {
            console.log(err);
        }


    }

    return <div>
        <h1>Register a new account</h1>
        <form onSubmit={register}>
            <input
                type={"string"}
                placeholder={"Name"}
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
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
            <input
                type={"password"}
                placeholder={"Verify Password"}
                onChange={(e) => setPassConfirm(e.target.value)}
                value={pass_confirm}
            />
            <label htmlFor={"admin"}>Admin: </label>
            <input
                type={"checkbox"}
                name={"admin"}
                onChange={(e) => setRole(!role)}
                value={role}
            />


            <button type={"submit"}>Register</button>
        </form>
    </div>

}

export default Register;