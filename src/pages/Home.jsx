import React, { Component } from "react";
import Movies from "../services/Movies";

const localStorage = require("local-storage");

class Home extends Component {
  state = {
    "dashboard":[]
  };

  componentDidMount(){
    this.get3Movie();
  }

  get3Movie = () => {
    let query = {"title":"shrek"}
    Movies.search(query, "title", "")
      .then(response => { 
        if(response === undefined) {
          return;
        }
        localStorage.set("session_id", response.headers.session_id)
        let resultCode = response["data"]["resultCode"];
        if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
          alert(response["data"]["message"])
          this.props.logout();
          this.props.history.push("/login");
          return
        }
        this.setState({"dashboard":response["data"]["movies"]})})
      .catch(error => alert(error));
  }

  getDetail = (movieID) => {
    Movies.getMovieDetail(movieID)
      .then(response => {
        if(response === undefined) {
          return;
        }
        // console.log(response);
        localStorage.set("session_id", response.headers.session_id)
        let resultCode = response["data"]["resultCode"];
        if(resultCode === 131 || resultCode === 132 || resultCode === 133 || resultCode === 134) {
          alert(response["data"]["message"]);
          this.props.logout();
          this.props.history.push("/login");
          return
        }
        if(resultCode === 211) {
          alert(response["data"]["message"]);
          return;
        }
        this.props.history.push({pathname: "/detail", state: {"movie":response["data"]["movie"]}});
      })
      .catch(error => alert(error));
  }

  render() {
    return (
      <div>
        <h1 style={{"textAlign":"center"}}>Welcome to FabFlix<br/>The only place where you should be buying movies. :)</h1>
        <h2 style={{"textAlign":"center"}}>Check out our movies!!!</h2>
        <div className="home">
          {this.state.dashboard.map((movie, Index) => 
            <div key={Index} className = "search-box">
              <button key={movie.movie_id} onClick={()=>this.getDetail(movie.movie_id)}>
                <img src={"https://image.tmdb.org/t/p/w300/" + movie.backdrop_path} alt=""></img>
              </button>
              <label key={movie.title}>Title: {movie.title}</label>
              <label key={movie.year}>Year: {movie.year}</label>
              <label key={movie.director}>Director: {movie.director}</label>
            </div>)}
        </div>
      </div>
    );
  }
}

export default Home;
