import React, { Component} from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Detail from "./pages/Movies";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Complete from "./pages/Complete";

/*
  Here is where we can place all our Page 
  Componenets. Inside of the switch you can list
  as many of <Route>'s as you would like.

  It takes two arguments:
    to="/path"
    componenet={Component}
  
  Remember, if you want to pass some varaibles inside 
  of a componenet inside of Route you must then 
  replace:
    `componenet={Componenet}`
      with
    `render={props => <Componenet {...props} var={var}/>}`
  The reason for this is so that we can keep certain props 
  that the Switch is trying to pass alive such as:
    history
    location
    match

  If you would like the user to be moved to another page
  simply use the history object. You can get it through 
  this.props. 

    IMPORTANT: The three objects will be passed to your 
    componenet automaticly IF they are INSIDE OF SWITCH
    HOWEVER: if you have a component inside of that component
    YOU WILL NEED TO MANNUALY PASS IT along the chain.
  
    history.push("/path") 
      and 
    history.push("/path", {key: value, key2: value})

  are two ways of moving the user to a new page, the 
  latter lets you also supply an object to be given to the new
  page that will be storage in location.state
*/

class Content extends Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route path="/login" render={props => <Login {...props} handleLogin={this.props.handleLogin} isLoggedIn={this.props.isLoggedIn} logout={this.props.logout}/>}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/search" render={props => <Search {...props} logout={this.props.logout}/>}></Route>
          <Route path="/home" render={props => <Home {...props} logout={this.props.logout}/>}></Route>
          <Route path="/detail" render={props => <Detail {...props} logout={this.props.logout}/>}></Route>
          <Route path="/cart" render={props => <Cart {...props} logout={this.props.logout}/>}></Route>
          <Route path="/order" render={props => <Order {...props} logout={this.props.logout}/>}></Route>
          <Route path="/complete" render={props => <Complete {...props} logout={this.props.logout}/>}></Route>
          <Route path="/" render={props => <Login {...props} handleLogin={this.props.handleLogin} isLoggedIn={this.props.isLoggedIn}/>} logout={this.props.logout}></Route>
        </Switch>
      </div>
    );
  }
}

export default Content;
