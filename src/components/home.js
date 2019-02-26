import React, { Component } from 'react';
import firebase from 'firebase';

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.readUserData = this.readUserData.bind(this);
        this.state = {
            firstname: '',
            lastname: ''
        }
    }

    logout() {
        firebase.auth().signOut();
    }

    readUserData(uid) {
        const self = this;

        firebase.database().ref('users').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childKey == uid) {
                    self.setState({ firstname: childData.firstname, lastname: childData.lastname });
                }
            });
        });
    }

    render() {
        return (
            <div className="container">
                <div className="user-card">
                    <div className="user-avatar-wrapper">
                        <div className="user-avatar" src="http://placehold.it/64x64" />
                    </div>
                    {this.props.uid && this.readUserData(this.props.uid)}
                    <div>
                        {this.state.firstname ? <b>First Name:</b> : <div className="text-placeholder" style={{ width: "87px" }}></div>}
                        {this.state.firstname ? this.state.firstname : <div className="text-placeholder" style={{ width: "125px" }}></div>}
                    </div>
                    <div>
                        {this.state.lastname ? <b>Last Name:</b> : <div className="text-placeholder" style={{ width: "80px" }}></div>}
                        {this.state.lastname ? this.state.lastname : <div className="text-placeholder" style={{ width: "140px" }}></div>}
                    </div>
                    <div>
                        {this.state.firstname ? <b>Email:</b> : <div className="text-placeholder" style={{ width: "44px" }}></div>}
                        {this.state.firstname ? this.props.email : <div className="text-placeholder" style={{ width: "133px" }}></div>}
                    </div>
                    <div>
                        {this.state.firstname ? <b>Registered:</b> : <div className="text-placeholder" style={{ width: "44px" }}></div>}
                        {this.state.firstname ? this.props.creationTime : <div className="text-placeholder" style={{ width: "214px" }}></div>}
                    </div>
                    <div className="logout-btn-wrapper">
                        <button className="btn btn-secondary" onClick={this.logout}>Logout</button>
                    </div>
                </div>
            </div>
        );

    }

}

export default Home;