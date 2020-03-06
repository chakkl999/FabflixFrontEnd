import React, { Component } from "react";
import Billing from "../services/Billing";

const localStorage = require("local-storage");

class Order extends Component {
    state = {
        "orderComplete": false
    }

    componentDidMount(){
        this.completeOrder();
    }

    completeOrder = () => {
        const queryString = require("query-string");
        const param = queryString.parse(this.props.location.search);
        this.setState({"orderComplete": false})
        Billing.completeOrder(param.token, param.PayerID)
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
            console.log(response)
            if(resultCode === 3420) {
                this.setState({"orderComplete": true})
            }
            else {
                alert(response["data"]["message"]);
            }
        })
        .catch(error => alert(error));
    }

    render() {
        return (!this.state.orderComplete ? (<h1 style={{"textAlign":"center"}}>Completing order...</h1>):(<h1 style={{"textAlign":"center"}}>Order completed!</h1>));
    }
}

export default Order;