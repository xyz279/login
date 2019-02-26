import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
            error: '',
            emailError: false,
            passwordError: false,
            passwordConfirmError: false,
            firstnameError: false,
            lastnameError: false
        };
    }

    handleChange(e) {
        if ([e.target.name] == 'firstname') this.setState({ firstnameError: false });
        if ([e.target.name] == 'lastname') this.setState({ lastnameError: false });
        if ([e.target.name] == 'email') this.setState({ emailError: false });
        if ([e.target.name] == 'password') this.setState({ passwordError: false });
        if ([e.target.name] == 'passwordConfirm') this.setState({ passwordConfirmError: false });

        this.setState({
            [e.target.name]: e.target.value
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

    signup(e) {
        e.preventDefault();
        this.setState({ wait: true });
        if (this.state.password == this.state.passwordConfirm && !this.checkString(this.state.firstname) && !this.checkString(this.state.lastname)) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((u) => {
                    this.setState({ wait: false });
                    this.props.history.push('/login');
                    this.writeUserData(u.user.uid, this.state.firstname, this.state.lastname);
                })

                .catch((error) => {
                    this.setState({ wait: false });

                    if (error.code === 'auth/invalid-email') {
                        this.setState({ emailError: true, error: 'Invalid email' });
                    }

                    if (error.code === 'auth/wrong-password') {
                        this.setState({ passwordError: true, error: 'Password is empty' })
                    }

                    if (error.code === 'auth/weak-password') {
                        this.setState({ passwordError: true, error: 'At least 6 chars' })
                    }
                })
        } else {
            this.setState({ wait: false });

            if (this.state.password != this.state.passwordConfirm) {
                this.setState({ passwordConfirmError: true, error: 'Passwords doesn\'t match' });
            } else if (this.checkString(this.state.firstname)) {
                this.setState({ firstnameError: true, error: 'Invalid First Name' });
            } else if (this.checkString(this.state.lastname)) {
                this.setState({ lastnameError: true, error: 'Invalid Last Name' });
            }
        }
    }

    checkString(string) {
        if (string) {
            var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*/g;

            if (format.test(string)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    writeUserData(uid, firstname, lastname) {
        firebase.database().ref('users/' + uid).set({
            firstname,
            lastname
        }).then((data) => {
            console.log('data ', data)
        }).catch((error) => {
            console.log('error ', error)
        })
    }

    render() {
        return (
            <div>
                <div className={ this.state.wait ? "loader-wrapper" : "hidden" }>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div className="login-screen">
                    <form>
                        <h1 className="form-header">
                            Sign up
                        </h1>
                        <div className="input-wrapper" data-validate={this.state.firstnameError ? this.state.error : ""}>
                            <input value={this.state.firstname} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="text" name="firstname" autoComplete="off" />
                            <span className="focus-input" data-placeholder="First Name"></span>
                        </div>
                        <div className="input-wrapper" data-validate={this.state.lastnameError ? this.state.error : ""}>
                            <input value={this.state.lastname} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="text" name="lastname" autoComplete="off" />
                            <span className="focus-input" data-placeholder="Last Name"></span>
                        </div>
                        <div className="input-wrapper" data-validate={this.state.emailError ? this.state.error : ""}>
                            <input value={this.state.email} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="email" name="email" autoComplete="off" />
                            <span className="focus-input" data-placeholder="Email"></span>
                        </div>
                        <div className="input-wrapper" data-validate={this.state.passwordError ? this.state.error : ""}>
                            <input value={this.state.password} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="password" name="password" />
                            <span className="focus-input" data-placeholder="Password"></span>
                        </div>
                        <div className="input-wrapper" data-validate={this.state.passwordConfirmError ? this.state.error : ""}>
                            <input value={this.state.passwordConfirm} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} type="password" name="passwordConfirm" />
                            <span className="focus-input" data-placeholder="Confirm password"></span>
                        </div>
                        <button type="submit" onClick={this.signup} className="btn btn-primary">Sign up</button>
                        <div className="form-link">
                           Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;