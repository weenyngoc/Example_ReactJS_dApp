import React, { Component } from 'react'
import AuthServiceAPI from './GameAuthService/AuthServiceAPI';
var md5 = require('md5');
const authAPI = new AuthServiceAPI();

export default class Login extends Component {
    constructor(props) {
        super(props)
    };
    state = {
        username: "",
        password: "",
        passwordMD5: "",
        accessToken: ""
    };
    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting');
        
        this.setState({passwordMD5: md5(this.state.password)}, function(){
            console.log('Pass MD5: ' + this.state.passwordMD5);
            /*
                //Doing some check for username + password
            */
            
            //Calling Auth Service
            authAPI.loginByAccount(this.state.username, this.state.passwordMD5);

        })
        console.log('Username : ' + this.state.username);
        console.log('Password : ' + this.state.password);
        console.log('Password : ' + md5(this.state.password));
        //

    };

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    };
    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    };

    render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={this.state.username}
            onChange = {this.handleUsernameChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={this.state.password}
            onChange = {this.handlePasswordChange}
          />
        </div>
        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" >
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </form>
    )
  }


}