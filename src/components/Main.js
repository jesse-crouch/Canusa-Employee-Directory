import React, { Component } from 'react';
import $ from 'jquery';
import User from './User';
import { uuid } from 'uuidv4';
import extensions from '../fetchExtensions';

export default class Main extends Component {
    constructor() {
        super();

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        $.get('http://10.5.1.57:5650/getAllUsers', result => {
            if (result.error) {
                alert(result.error);
            } else {
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

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h3 style={{margin: '2%'}}>Employee Directory</h3>
                <input className="form-control" id="searchField" placeholder="Search" style={{width: '20%', margin: '1% auto'}} onChange={e => {
                    var users = this.state.allUsers;
                    users = users.filter(user => {
                        var match = false;
                        if (user.props.user.DISPLAY_NAME.toLowerCase().includes(e.target.value.toLowerCase())) match = true;
                        if (user.props.user.EMAIL_ADDRESS.toLowerCase().includes(e.target.value.toLowerCase())) match = true;
                        if (user.props.user.OU_NAME.toLowerCase().includes(e.target.value.toLowerCase())) match = true;
                        if (user.props.user.POSITION.toLowerCase().includes(e.target.value.toLowerCase())) match = true;
                        if (user.props.user.EXTENSION.toLowerCase().includes(e.target.value.toLowerCase())) match = true;

                        return match;
                    });
                    this.setState(prevState => {
                        return {
                            allUsers: prevState.allUsers,
                            users: users
                        }
                    });
                }} />
                <h5 id="loading-text">Loading...</h5>
                <div id="users">
                    {this.state.users}
                </div>
            </div>
        )
    }
}
