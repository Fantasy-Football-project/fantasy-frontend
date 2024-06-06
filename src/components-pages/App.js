//Overall file.
import React , { useState , useEffect } from 'react';
import './App.css';
import logo from '../logo.svg';
import WelcomePage from './WelcomePage';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import { request , setAuthToken } from "../axios_helper";

function App() {
  
  //this variable is to figure out which content to display (based on if the user is logged in or not)
  const[componentToShow, setComponentToShow] = useState("welcome");

  const login = () => {
    setComponentToShow("login"); //if user is logged in, the variable is set to "login", and back to "welcome" if the user logs out
  };

  const logout = () => {
    setComponentToShow("welcome");
  };

  const onLogin = (event, username, password) => {
    event.preventDefault();

    //using the axios helper method - .then/.catch is a try catch
    request(
      "POST",
      "/login",
      {login: username, password: password}
    ).then((response) => {
      setComponentToShow("authorizedContent"); //on login, the user will view the authorized content
      setAuthToken(response.data.token);
    }).catch((error) => {
      setComponentToShow("welcome");
    });
  };

  const onRegister = (event, firstName, lastName, username, password) => {
    event.preventDefault();

    //using the axios helper method
    request(
      "POST",
      "/register",
      {firstName: firstName, lastName: lastName, login: username, password: password}
    ).then((response) => {
      setComponentToShow("authorizedContent"); //when the user registers, they can view the authorized content
      setAuthToken(response.data.token);
    }).catch((error) => {
      setComponentToShow("welcome");
    });
  };
  
  return (
    <div>
      <h1 className='text-center'>Fantasy Football Registration</h1>
      <br />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            {componentToShow === "welcome" && <WelcomePage />}
            {componentToShow === "authorizedContent" && <AuthContent />}
            {componentToShow === "login" && <LoginForm onLogin={onLogin} onRegister={onRegister}/>}
            <div className='row justify-content-center'>
              <div className='col-1'>
                <button className="btn btn-primary" style={{margin: "5px"}} onClick={() => setComponentToShow("login")}>Login</button>
                <button className="btn btn-dark" onClick={() => setComponentToShow("welcome")}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
