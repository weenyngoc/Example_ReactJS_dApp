import { Component } from "react";
const axios = require('axios')

export default class AuthServiceAPI extends Component{
    loginByAccount = function(username, password) {
        var data = {username, password};
        axios.post('http://gapi.place:3001/api/v1/user/login-by-account', data)
            .then(res => {return res})
            .catch(errorCode => {
                console.error('There was an error!', errorCode);
        })
    };

    signMessage = function(address, ip) {
        var data = {publicAddress: address, ip_login: ip};
        axios.post('http://gapi.place:3001/api/v1/user/sign-message', data)
        .then(res => {return res})
        .catch(errorCode => {
            console.error('There was an error!', errorCode);
    })
    }

    render(){
        return <div>Auth service</div>
    }
}