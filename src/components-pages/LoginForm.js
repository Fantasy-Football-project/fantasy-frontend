//Login and register form.
import React , { useState, useEffect } from "react";

const LoginForm = ( props ) => {
    const [active, setActive] = useState("login");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [login, setLogin] = useState(""); //username
    const [password, setPassword] = useState("");
    const { onLogin, onRegister } = props; //these are used to determine if the user is registered and/or logged in. basically the login form will be hidden if credentials are passed in

    //Updates the firstName field when the input field for firstName changes.
    const handleFirstNameChange = ( event ) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = ( event ) => {
        setLastName(event.target.value);
    }

    const handleLoginChange = ( event ) => {
        setLogin(event.target.value);
    }

    const handlePasswordChange = ( event ) => {
        setPassword(event.target.value);
    }

    //Allows the parent component or something to handle the login logic.
    const onSubmitLogin = ( event ) => {
        event.preventDefault();
        onLogin(event, login, password);
    }

    //allows the parent component or something to handle the register logic.
    const onSubmitRegister = ( event ) => {
        event.preventDefault();
        onRegister(event, firstName, lastName, login, password);
    }

    return(
        <div className="row justify-content-center">
            <div className="col-4">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={"nav-link" + (active === "login" ? " active" : "")} id="tab-login" onClick={() => setActive("login")}>Login</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={"nav-link" + (active === "register" ? " active" : "")} id="tab-register" onClick={() => setActive("register")}>Register</button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className={"tab-pane fade" + (active === "login" ? " show active" : "")} id="pills-login">
                        <form onSubmit={onSubmitLogin}>
                            <div className="form-outline mb-4">
                                <input type="login" id="loginName" name="login" className="form-control" onChange={handleLoginChange}/>
                                <label className="form-label" htmlFor="loginName">Username</label>
                            </div>

                            <div className="form-outline mb-4">
                                <input type="password" id="loginPassword" name="password" className="form-control" onChange={handlePasswordChange}/>
                                <label className="form-label" htmlFor="loginPassword">Password</label>
                            </div>

                            <button type="submit" className="btn btn-info">Sign In</button>
                        </form>
                    </div>

                    <div className={"tab-pane fade" + (active === "register" ? " show active" : "")} id="pills-register">
                        <form onSubmit={onSubmitRegister}>
                            <div className="form-outline mb-4">
                                <input type="text" id="firstName" name="firstName" className="form-control" onChange={handleFirstNameChange}/>
                                <label className="form-label" htmlFor="firstName">First Name</label>
                            </div>

                            <div className="form-outline mb-4">
                                <input type="text" id="lastName" name="lastName" className="form-control" onChange={handleLastNameChange}/>
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                            </div>

                            <div className="form-outline mb-4">
                                <input type="text" id="login" name="login" className="form-control" onChange={handleLoginChange}/>
                                <label className="form-label" htmlFor="login">Username</label>
                            </div>

                            <div className="form-outline mb-4">
                                <input type="password" id="password" name="password" className="form-control" onChange={handlePasswordChange}/>
                                <label className="form-label" htmlFor="password">Password</label>
                            </div>

                            <button type="submit" className="btn btn-info">Register</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginForm;