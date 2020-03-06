import React, { Component } from "react";
import Idm from "../services/Idm";
import Socket from "../util/Socket";

/*
  Using localStorage is similar to how we use
  dictionarys. 
  
  To set a variable call `localStorage.set("key", value)`
  To get a variable call `localStorage.get("key")`

  Local Storage persists through website refreshes so
  it is perfect for storing things we dont want to lose
  like a users session

  You must call `const localStorage = require("local-storage");`
  in any class that you want to use this in, it is the same
  local storage in the entire website regardless of where you call
  it as each website gets the same instance of the storage.

  So think of it as a global dictionary.
*/
const localStorage = require("local-storage");

class Login extends Component {
  state = {
    "email": "",
    "password": ""
  };

  componentDidMount(){
    if(this.props.isLoggedIn){
      Idm.session()
      .then(response => {
        if(response === undefined) {
          return;
        }
        localStorage.set("session_id", response.data.session_id)
        let resultCode = response["data"]["resultCode"];
        if(resultCode === 130) {
          this.props.history.push("/home");
          return
        } else {
          this.props.logout();
          this.props.history.push("/login");
          return;
        }
        })
      .catch(error => alert(error));
    this.setState({email: "", password: ""})
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    Socket.removeHeader();
    const { email, password } = this.state;
    Idm.login(email, password)
      .then(response => { const ispwcorrect = this.props.handleLogin(email, response);
        // console.log(ispwcorrect);
        !ispwcorrect && alert("Email/Password is incorrect.");
        ispwcorrect && localStorage.set("email",email) && 
        localStorage.set("session_id", response["data"]["session_id"]) && this.props.history.push("/home")})
      .catch(error => alert(error));
    this.setState({email: "", password: ""})
  };

  updateField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    const { email, password } = this.state;

    return (
      <div className="form-box">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            onChange={this.updateField}
          />
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={this.updateField}
          />
          <button className="button">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
