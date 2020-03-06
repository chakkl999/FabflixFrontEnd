import React, { Component } from "react";
import Movies from "../services/Movies";

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

class Search extends Component {
  state = {
    "title": "",
    "filter": "title",
    "year" : "",
    "director": "",
    "genre": "",
    "limit": "10",
    "orderby": "title",
    "direction": "ASC",
    "result": [],
    "page": 0,
    "query": {},
    "searchedKeyword": "",
    "searchedFilter": ""
  };

  componentDidMount() {
    this.setState({"result":[]});
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({"page":0, "query": {}, "searchKeyword": "", "result":[]})

    const {title, filter, year, director, genre, limit, orderby, direction} = this.state;
    let query = {"orderby":orderby, "direction":direction};
    if(filter !== "keyword"){
      if(title !== "") {
        query["title"] = title;
      }
      if(year !== "") {
        query["year"] = year;
      }
      if(director !== "") {
        query["director"] = director;
      }
      if(genre !== "") {
        query["genre"] = genre;
      }
    } else {
      this.setState({"searchedKeyword": title});
    }
    query["limit"] = limit;
    query["offset"] = limit*this.state.page;
    Movies.search(query, filter, title)
      .then(response => { 
        // console.log(response);
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
        if(resultCode === 211) {
          alert(response["data"]["message"])
        }
        // console.log(typeof(response["data"]["movies"]))
        this.setState({"result":response["data"]["movies"], "query": query, "searchedFilter": filter})})
      .catch(error => alert(error));
  };

  handleChange = e => {
    const {name, value} = e.target;
    this.setState({ [name]:value});
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

  setPrevNextPage = () => {
    if (this.state.page !== 0){
      return (<div style={{"display":"flex","flexDirection":"row", "justifyContent":"center"}}><button className="button" onClick={this.getPrevPage}>Previous page</button>/<button className="button" onClick={this.getNextPage}>Next Page</button></div>)
    } else {
      return (<div style={{"display":"flex","flexDirection":"row", "justifyContent":"center"}}><button className="button" onClick={this.getPrevPage} disabled>Previous page</button>/<button className="button" onClick={this.getNextPage}>Next Page</button></div>)
    }
  }

  getNextPage = () => {
    const {page, searchedFilter, searchedKeyword} = this.state;
    let query = this.state.query;
    query["offset"] = (query["limit"]*(page+1)).toString();
    Movies.search(query, searchedFilter, searchedKeyword)
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
        if(response["data"]["resultCode"] === 211) {
          alert("No more results.");
          return;
        }
        this.setState({"result":response["data"]["movies"], "page": page+1, "query": query})})
      .catch(error => alert(error));
  }

  getPrevPage = () => {
    const {page, searchFilter, searchedKeyword} = this.state;
    let query = this.state.query;
    query["offset"] = (query["limit"]*(page-1)).toString();
    Movies.search(query, searchFilter, searchedKeyword)
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
        if(response["data"]["resultCode"] === 211) {
          alert("No more results.");
          return;
        }
        this.setState({"result":response["data"]["movies"], "page": page-1, "query": query})})
      .catch(error => alert(error));
  }

  render() {
    const resultTable = this.state.result.map((movie, Index) => 
      <div key={Index} className = "search-box">
        <button key={movie.movie_id} onClick={()=>this.getDetail(movie.movie_id)}>
          <img src={"https://image.tmdb.org/t/p/w300/" + movie.backdrop_path} alt=""></img>
        </button>
        <label key={movie.title}>Title: {movie.title}</label>
        <label key={movie.year}>Year: {movie.year}</label>
        <label key={movie.director}>Director: {movie.director}</label>
      </div>
    );
    return (
      <div style={{"textAlign":"center"}}>
        <div className="form-box">
          <h1>Search</h1>
          <div className="query-fit">
            <select id="filter" name="filter" value={this.state.filter} onChange={this.handleChange}>
                <option value="title">Title</option>
                <option value="keyword">Keyword</option>
            </select>
            <input
              className="input"
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}>
            </input>
          </div>
          <div className="query">
            <div>
              <label className="label">
                Year
              </label>
              <input
                className="short-input"
                type="number"
                name="year"
                value={this.state.year}
                onChange={this.handleChange}>
              </input>
            </div>
            <div>
              <label className="label">
                Director
              </label>
              <input
                className="short-input"
                type="text"
                name="director"
                value={this.state.director}
                onChange={this.handleChange}>
              </input>
            </div>
            <div>
              <label className="label">
                Genre
              </label>
              <input
                className="short-input"
                type="text"
                name="genre"
                value={this.state.genre}
                onChange={this.handleChange}>
              </input>
            </div>
          </div>
          <div className="query">
            <div>
              <label className="label">
                Limit
              </label>
              <select id="limit" name="limit" value={this.state.limit} onChange={this.handleChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
              </select>
            </div>
            <div>
              <label className="label">
                Orderby
              </label>
              <select id="orderby" name="orderby" value={this.state.orderby} onChange={this.handleChange}>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                    <option value="year">Year</option>
              </select>
            </div>
            <div>
              <label className="label">
                Direction
              </label>
              <select id="direction" name="direction" value={this.state.direction} onChange={this.handleChange}>
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
              </select>
            </div>
          </div>
          <div style={{"marginTop":"20px"}}>
            <button className = "button" onClick={this.handleSubmit}>Search</button>
          </div>
        </div>
        <label>Result(s):</label>
        <div className = "search-container">
          {Object.keys(this.state.result).length !== 0 && resultTable}
        </div>
        {Object.keys(this.state.result).length !== 0 && this.setPrevNextPage()}
      </div>
    ) ;
  }
}

export default Search;
