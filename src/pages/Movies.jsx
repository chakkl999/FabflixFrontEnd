import React, { Component } from "react";
import Billing from "../services/Billing";

const localStorage = require("local-storage");

class Detail extends Component {
  state = {
    "quantity": 1
  };

  convertGenre(genres){
    let temp = genres.map(g => g.name);
    return temp.join(", ");
  }

  convertPeople(people){
    let temp = people.map(p => p.name);
    return temp.join(", ");
  }

  handleChange = e => {
    const {name, value} = e.target;
    this.setState({ [name]:value});
  }

  generateOptions(){
    let op = [];
    for(let i = 1; i <= 20; i++) {
      op.push(<option key={i} value={i}>{i}</option>);
    }
    return op;
  }

  addtocart = () => {
    Billing.insertCart(this.props.location.state.movie.movie_id, this.state.quantity)
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
        if(resultCode === 3100) {
          this.setState({"movieDetail":response["data"]["movie"]});
          alert("Item has been added to cart.")
        }
        else {
          alert(response["data"]["message"]);
        }
      })
      .catch(error => alert(error));
  }

  render() {
    const detail = this.props.location.state.movie;
    return (detail &&
    <div className="detail-container">
      <h1 style={{"textAlign":"center"}}>{detail["title"]}</h1>
      <img src={"https://image.tmdb.org/t/p/w500/" + detail.backdrop_path} alt="" style={{"margin":"20px", "textAlign":"center"}}></img>
      <div>
        <div className="detail-layout">
          <div>
            <h1 className="label">Summary:</h1>
            <p>{detail["overview"]}</p>
          </div>
          <div>
            <h1 className="label">Year:</h1>
            <p>{detail["year"]}</p>
          </div>
          <div>
            <h1 className="label">Director:</h1>
            <p>{detail["director"]}</p>
          </div>
          <div>
            <h1 className="label">Rating:</h1>
            <p>{detail["rating"]}</p>
          </div>
          <div>
            <h1 className="label">Budget:</h1>
            <p>{"$"+detail["budget"]}</p>
          </div>
          <div>
            <h1 className="label">Revenue:</h1>
            <p>{"$"+detail["revenue"]}</p>
          </div>
          <div>
            <h1 className="label">Genre:</h1>
            <p>{this.convertGenre(detail["genres"])}</p>
          </div>
          <div>
            <h1 className="label">People:</h1>
            <p>{this.convertPeople(detail["people"])}</p>
          </div>
        </div>
        <div className="purchase-container">
          <select className="select" id="quantity" name="quantity" value={this.state.quantity} onChange={this.handleChange}>
            {this.generateOptions()}
          </select>
          <button className="button" onClick={this.addtocart}>Add to cart</button>
        </div>
      </div>
    </div>);
  }
}

export default Detail;
