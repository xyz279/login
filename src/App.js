import React, { Component } from 'react';
import { BrowserRouter, Redirect, Router, Route } from 'react-router-dom';

import fire from './firebase/fire';
import firebase from 'firebase';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import './App.css';

var config = {
    databaseURL: "<database-url>",
    projectId: "<project-id>",
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

var wait = true;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            user: null,
            data: {
                uid: null,
                email: null,
                creationTime: null
            }
        });
        this.authListener = this.authListener.bind(this);
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            wait = false;
            if (user) {
                this.setState({ user });
                this.setState({ data: { uid: user.uid, email: user.email, creationTime: user.metadata.creationTime } })
                localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                localStorage.removeItem('user');
            }
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                <Redirect to="/login" />
                    { this.state.user && <Route path="/login" render={(props) => <Home {...props} uid={this.state.data.uid} email={this.state.data.email} creationTime={this.state.data.creationTime} />} />}
                    {!this.state.user && <Route path="/login" render={(props) => <Login {...props} wait={wait} />} />}
                    {!this.state.user && <Route path="/signup" component={Signup} />}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;