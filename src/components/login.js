import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class Login extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.state = {
            email: '',
            password: '',
            error: '',
            emailError: false,
            passwordError: false,
            wait: false
        };
    }

    handleChange(e) {
        if ([e.target.name] == 'email') this.setState({ emailError: false });
        if ([e.target.name] == 'password') this.setState({ passwordError: false });

        this.setState({
            [e.target.name]: e.target.value,
            error: ''
        });
    }

    handleFocus(e) {
        e.target.className = "has-val";
    }

    handleBlur(e) {
        if (e.target.value == "") {
            e.target.className = "";
        }
    }

    login(e) {
        e.preventDefault();
        this.setState({ wait: true });
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => { 
                this.setState({ wait: false }) ;
                this.readUserData();
            })

            .catch((error) => {
                this.setState({ wait: false });
                console.log(error.code);

                if (error.code === 'auth/invalid-email') {
                    this.setState({ emailError: true, error: 'Invalid email' });
                }

                if (error.code === 'auth/wrong-password') {
                    this.setState({ passwordError: true, error: 'Wrong password' })
                }

                if (error.code === 'auth/user-not-found') {
                    this.setState({ emailError: true, error: 'User not found' })
                }
            });
    }

    render() {
        return (
            <div>
                <div className={ this.props.wait ? "loader-wrapper" : "hidden" }>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div className={ this.state.wait ? "loader-wrapper" : "hidden" }>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div className="login-screen">
                    <form>
                        <h1 className="form-header">
                            Login
                        </h1>
                        <div className="input-wrapper" data-validate={this.state.emailError ? this.state.error : ""}>
                            <input value={this.state.email} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="email" name="email" autoComplete="off" />
                            <span className="focus-input" data-placeholder="Email"></span>
                        </div>
                        <div className="input-wrapper" data-validate={this.state.passwordError ? this.state.error : ""}>
                            <input value={this.state.password} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="password" name="password" />
                            <span className="focus-input" data-placeholder="Password"></span>
                        </div>
                        <button type="submit" onClick={this.login} className="btn btn-primary">Login</button>
                        <div className="form-link">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;