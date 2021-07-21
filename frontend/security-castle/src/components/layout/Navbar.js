import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import LogoutButton from "../auth/Logout";

function Navbar()  {

    const {loggedIn} = useContext(AuthContext)

    return <div>
        {
            loggedIn.state === false && (
                <>
                <Link to={"/register"}>Register</Link>
                <Link to={"/login"}>Login</Link>
            </>
        )}
        {
            loggedIn.state === true && (
                <>
                <Link to={"/castle"}>Castle</Link>
                {
                    loggedIn.role === "admin" && <Link to={"/admin"}>Admin</Link>
                }
                <LogoutButton/>
            </>
            )}
    </div>
}

export default Navbar;