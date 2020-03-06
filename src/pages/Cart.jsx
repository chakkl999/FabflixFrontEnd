import React, { Component } from "react";
import Billing from "../services/Billing";

const localStorage = require("local-storage");

class Cart extends Component {
  state = {
      "loading": true,
      "cart":[]
  };

  componentDidMount(){
      this.getcart();
  }

  getcart = () => {
    this.setState({"loading": true});
    Billing.retrieveCart()
      .then(response => {
        if(response === undefined) {
          return;
        }
        localStorage.set("session_id", response.headers.session_id)
        let resultCode = response["data"]["resultCode"];
        if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
          alert(response["data"]["message"]);
          this.props.logout();
          this.props.history.push("/login");
          return
        }
        if(resultCode === 3130 || resultCode === 312) {
          this.setState({"cart":response["data"]["items"], "loading":false});
        }
        else {
          alert(response["data"]["message"]);
        }
      })
      .catch(error => alert(error));
  }

  clearCart = () => {
    this.setState({"loading": true});
    Billing.clearCart()
    .then(response => {
      if(response === undefined) {
        return;
      }
      localStorage.set("session_id", response.headers.session_id)
      let resultCode = response["data"]["resultCode"];
      if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
        alert(response["data"]["message"]);
        this.props.logout();
        this.props.history.push("/login");
        return
      }
      if(resultCode === 3140) {
        this.setState({"cart":response["data"]["items"], "loading":false});
      }
      else {
        alert(response["data"]["message"]);
      }
    })
    .catch(error => alert(error));
  }

  generateOptions(){
    let op = [];
    for(let i = 1; i <= 20; i++) {
      op.push(<option key={i} value={i}>{i}</option>);
    }
    return op;
  }

  handleChange = (value, id) => {
    this.setState({"loading": true});
    Billing.updateCart(id, value)
    .then(response => {
      if(response === undefined) {
        return;
      }
      localStorage.set("session_id", response.headers.session_id)
      let resultCode = response["data"]["resultCode"];
      if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
        alert(response["data"]["message"]);
        this.props.logout();
        this.props.history.push("/login");
        return
      }
      if(resultCode === 3110) {
        this.getcart();
      }
      else {
        alert(response["data"]["message"]);
      }
    })
    .catch(error => alert(error));
  }

  removeItem = (id) => {
    this.setState({"loading": true});
    Billing.deleteItem(id)
    .then(response => {
      if(response === undefined) {
        return;
      }
      localStorage.set("session_id", response.headers.session_id)
      let resultCode = response["data"]["resultCode"];
      if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
        alert(response["data"]["message"]);
        this.props.logout();
        this.props.history.push("/login");
        return
      }
      if(resultCode === 3120) {
        this.getcart();
      }
      else {
        alert(response["data"]["message"]);
      }
    })
    .catch(error => alert(error));
  }

  getTotalCost = () => {
      let total = 0;
      for(let i = 0; i < this.state.cart.length; ++i) {
          total += this.state.cart[i]["unit_price"] * this.state.cart[i]["quantity"];
      }
      return total.toFixed(2);
  }

  checkOutItems = () => {
    this.setState({"loading": true});
    Billing.placeOrder()
    .then(response => {
      if(response === undefined) {
        return;
      }
      localStorage.set("session_id", response.headers.session_id)
      let resultCode = response["data"]["resultCode"];
      if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
        alert(response["data"]["message"]);
        this.props.logout();
        this.props.history.push("/login");
        return
      }
      if(resultCode === 3400) {
        this.setState({"loading": false});
        window.location.assign(response["data"]["approve_url"]);
        return
      }
      else {
        alert(response["data"]["message"]);
      }
    })
    .catch(error => alert(error));
  }

  render() {
    return (this.state.loading ? (<h1 style={{"textAlign":"center"}}>Loading...</h1>) : (this.state.cart !== undefined && this.state.cart.length !== 0 ? (
    <div>
      <div className="cart-container">
        <div className="cart-item">
            <h1 className="label">Title</h1>
            <h1 className="label">Price</h1>
            <h1 className="label">Quantity</h1>
            <button className="button" onClick={this.clearCart}>Clear cart</button>
        </div>
        {this.state.cart.map(item => 
            <div className="cart-item">
                <figure>
                    <img src={"https://image.tmdb.org/t/p/w200/" + item.backdrop_path} alt=""></img>
                    <figcaption>{item.movie_title}</figcaption>
                </figure>
                <p>${(item.unit_price*item.quantity).toFixed(2)}</p>
                <select className="select" id={item.movie_title} name="quantity" value={item.quantity} onChange={e => {this.handleChange(e.target.value, item.movie_id)}}>
                    {this.generateOptions()}
                </select>
                <button className="button" onClick={() => {this.removeItem(item.movie_id)}}>Remove</button>
            </div>)}
      </div>
      <div className="checkout">
        <label className="label">Total:</label>
        <p className="label">${this.getTotalCost()}</p>
        <button className="button" onClick={this.checkOutItems}>Checkout</button>
      </div>
    </div>
    ) : (<h1 style={{"textAlign":"center"}}>Cart is empty.</h1>)
    ));
  }
}

export default Cart;