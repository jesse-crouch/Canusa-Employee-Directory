import React, { Component } from 'react'

export default class User extends Component {
    render() {
        var location = this.props.user.OU_NAME.split('/');
        if (location.includes('Canusa')) {
            location = location[0] + ' - ' + location[1];
        } else {
            location = location[location.length-2];
        }

        return (
            <div className="user-box">
                <div className="user-name">{this.props.user.DISPLAY_NAME}</div>
                <table className="table user-details">
                    <tbody>
                        <tr style={{display: this.props.user.EMAIL_ADDRESS.length > 1 ? '' : 'none'}}>
                            <td>Email Address</td>
                            <td>{this.props.user.EMAIL_ADDRESS}</td>
                        </tr>
                        <tr style={{display: this.props.user.POSITION.length > 0 ? '' : 'none'}}>
                            <td>Position</td>
                            <td>{this.props.user.POSITION}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>{location}</td>
                        </tr>
                        <tr style={{display: this.props.user.EXTENSION.length > 0 ? '' : 'none'}}>
                            <td>Extension</td>
                            <td>{this.props.user.EXTENSION}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
