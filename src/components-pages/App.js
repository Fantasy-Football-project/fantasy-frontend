//Overall file.
import React , { useState , useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import WelcomePage from './WelcomePage';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import { getAuthToken, request, setAuthToken } from "../axios_helper";
import CreateLeague from './CreateLeague';
import JoinLeague from './JoinLeague';
import Roster from './Roster';
import Matchup from './Matchup';
import Players from './Players';
import League from './League';

function App() {
  
  //this variable is to figure out which content to display (based on if the user is logged in or not)
  const[componentToShow, setComponentToShow] = useState("welcome");
  const[authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken()) {
      setAuthenticated(true);
    }
  })

  const login = () => {
    setComponentToShow("login"); //if user is logged in, the variable is set to "login", and back to "welcome" if the user logs out
  };

  const logout = () => {
    request("POST", "/logout"
    ).then(() => {
      setComponentToShow("welcome");
      setAuthToken(null);
    }).catch(error => console.error('Logout error:', error));
  };

  //Calling the login function in the backend.
  const onLogin = (event, username, password) => {
    event.preventDefault();

    //using the axios helper method - .then/.catch is a try catch
    request(
      "POST",
      "/login",
      {login: username, password: password}
    ).then((response) => {
      setAuthToken(response.data.token);
      console.log('Login successful, response:', response);
      setComponentToShow("authorizedContent"); //on login, the user will view the authorized content
      navigate("/authorizedContent");
    }).catch((error) => {
      setAuthToken(null);
      console.error('Login error:', error);
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
      setAuthToken(response.data.token);
      console.log('Registration successful, response:', response);
      setComponentToShow("authorizedContent"); //when the user registers, they can view the authorized content
      navigate("/authorizedContent");
    }).catch((error) => {
      setAuthToken(null);
      console.error(error.response.data)
    });
  };
  
  //Router creates links for each page and sends user to the specified links based on the button pressed on WelcomePageContent.
  return (    
      <div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col'>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginForm onLogin={onLogin} onRegister={onRegister}/>} />
                
                {authenticated && <Route path="/authorizedContent" element={<AuthContent/>} />}
                {authenticated && <Route path="/createLeague" element={<CreateLeague/>} />}
                {authenticated && <Route path="/joinLeague" element={<JoinLeague/>} />}
                {authenticated && <Route path="/roster" element={<Roster />} />}
                {authenticated && <Route path="/matchup" element={<Matchup />} />}
                {authenticated && <Route path="/players" element={<Players />} />}
                {authenticated && <Route path="/league" element={<League />} />}
              </Routes>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
