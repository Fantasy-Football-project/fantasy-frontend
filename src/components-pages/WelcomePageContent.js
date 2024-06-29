//The content for the Welcome Page.
import React from "react";
import { Link } from "react-router-dom";

function WelcomePageContent() {
    return (
        <div className="row justify-content-md-center">
            <h1 className='text-center'>Fantasy Football Registration</h1>
            <br />
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">Welcome</h1>
                    <h2 className="lead">Login to play</h2>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-1'>
                        <Link to="/login" className="btn btn-primary" style={{margin: "5px"}}>Login</Link>
                        <Link to="/createLeague" className="btn btn-success">Create League</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePageContent;