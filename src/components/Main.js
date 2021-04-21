import React, { Component } from 'react';
import $ from 'jquery';
import User from './User';
import { uuid } from 'uuidv4';
import extensions from '../fetchExtensions';
import Cookies from 'js-cookie';

const server = 'http://10.5.1.57:5650';

export default class Main extends Component {
    constructor() {
        super();

        this.fetchUsers = this.fetchUsers.bind(this);
        this.filterUsers = this.filterUsers.bind(this);

        this.state = {
            users: []
        }
    }

    fetchUsers() {
        $.post(server + '/getAllUsers', { token: Cookies.get('token') }, result => {
            if (result.error) {
                alert(result.error);
            } else {
                document.getElementById('login-content').style.display = 'none';
                document.getElementById('main-content').style.display = '';

                // Filter for actual users
                var users = [];
                for (var i in result.users) {
                    var name = result.users[i].DISPLAY_NAME.split(' ');
                    if (name.length > 1) {
                        if (!name[0].match(/[0-9]/g) && !name[1].match(/[0-9]/g) && name[0].charAt(0) === name[0].charAt(0).toUpperCase()) {
                            for (var j in extensions) {
                                if (extensions[j][0] === result.users[i].DISPLAY_NAME) {
                                    result.users[i].POSITION = extensions[j][1];
                                    result.users[i].EXTENSION = extensions[j][2];
                                }
                            }
                            result.users[i].POSITION = result.users[i].POSITION ? result.users[i].POSITION : '';
                            result.users[i].EXTENSION = result.users[i].EXTENSION ? result.users[i].EXTENSION : '';
                            users.push(<User key={uuid()} user={result.users[i]} />);
                        }
                    }
                }
                console.log(users[0].props.user);
                this.setState({
                    allUsers: users,
                    users: users
                }, () => {
                    document.getElementById('loading-text').style.display = 'none';
                });
            }
        });
    }

    componentDidMount() {
        // Check for token cookie
        if (Cookies.get('token')) {
            this.fetchUsers();
        } else {
            document.getElementById('login-content').style.display = '';
        }
    }

    filterUsers(name, email, location, extension) {
        var users = this.state.allUsers;
        users = users.filter(user => {
            var match = false;
            if (name && user.props.user.DISPLAY_NAME.toLowerCase().includes(name.toLowerCase())) match = true;
            if (email && user.props.user.EMAIL.toLowerCase().includes(email.toLowerCase())) match = true;
            if (location && user.props.user.OU_NAME.toLowerCase().includes(location.toLowerCase())) match = true;
            if (extension && user.props.user.EXTENSION.toLowerCase().includes(extension.toLowerCase())) match = true;

            if (!name && !email && !location && !extension) {
                return true;
            } else {
                return match;
            }
        });
        this.setState(prevState => {
            return {
                allUsers: prevState.allUsers,
                users: users
            }
        });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h3 style={{margin: '2%'}}>Employee Directory</h3>
                <div id="login-content" style={{display: 'none'}}>
                    <div className="form-group">
                        <input id="usernameInput" value="admin" className="form-control" placeholder="Username" style={{width: '20%', margin: '1% auto'}} />
                    </div>
                    <div className="form-group">
                        <input id="passwordInput" value="canusa" className="form-control" placeholder="Password" type="password" style={{width: '20%', margin: '1% auto'}} />
                    </div>
                    <button className="btn btn-primary" onClick={() => {
                        // Login
                        $.post(server + '/login', {
                            username: document.getElementById('usernameInput').value,
                            password: document.getElementById('passwordInput').value
                        }, result => {
                            if (result.error) {
                                alert(result.error);
                            } else {
                                // Set json web token cookie, expires in 8 hours
                                Cookies.set('token', result.token, { expires: 0.34 });
                                this.fetchUsers();
                            }
                        });
                    }}>Login</button>
                </div>
                <div id="main-content" style={{display: 'none'}}>
                    <div id="search-fields">
                        <input className="form-control" id="nameSearchField" placeholder="Name" style={{width: '20%', margin: '1% auto'}} onChange={e => {
                            this.filterUsers(document.getElementById('nameSearchField').value, null, null, null);
                        }} />
                        <input className="form-control" id="emailSearchField" placeholder="Email" style={{width: '20%', margin: '1% auto'}} onChange={e => {
                            this.filterUsers(null, document.getElementById('emailSearchField').value, null, null);
                        }} />
                        <input className="form-control" id="locationSearchField" placeholder="Location" style={{width: '20%', margin: '1% auto'}} onChange={e => {
                            this.filterUsers(null, null, document.getElementById('locationSearchField').value, null);
                        }} />
                        <input className="form-control" id="extensionSearchField" placeholder="Extension" style={{width: '20%', margin: '1% auto'}} onChange={e => {
                            this.filterUsers(null, null, null, document.getElementById('extensionSearchField').value);
                        }} />
                    </div>
                    <h5 id="loading-text">Loading...</h5>
                    <div id="users">
                        {this.state.users}
                    </div>
                </div>
            </div>
        )
    }
}
