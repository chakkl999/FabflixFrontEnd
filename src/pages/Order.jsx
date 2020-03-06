import React, { Component } from "react";
import Billing from "../services/Billing";

const localStorage = require("local-storage");

class Order extends Component {
  state = {
      "loading": true,
      "transaction":[]
  };

  componentDidMount(){
      this.getTransaction();
  }

  getTransaction = () => {
    Billing.retrieveTransaction()
    .then(response => {
        // console.log(response);
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
      if(resultCode === 3410 || resultCode === 313) {
        this.setState({"transaction":response["data"]["transactions"], "loading": false});
      }
      else {
        alert(response["data"]["message"]);
      }
    })
    .catch(error => alert(error));
  }

  render() {
      // console.log(this.state.transaction)
      return (this.state.loading ? (<h1 style={{"textAlign":"center"}}>Loading...</h1>) : (this.state.transaction !== undefined && this.state.transaction.length !== 0 ? (
        <div>
            <h1 style={{"textAlign":"center"}}>Order History</h1>
            <div className="cart-container">
                <div className="cart-item">
                    <h1 className="label">Date</h1>
                    <h1 className="label">Price</h1>
                </div>
                {this.state.transaction.map(t => 
                    <div className="cart-item">
                        <label className="label">{t.items[0].sale_date}</label>
                        <label className="label">${t.amount.total}</label>
                    </div>)}
            </div>
      </div>) : (<h1 style={{"textAlign":"center"}}>No order history found.</h1>)));
  }
}

export default Order;