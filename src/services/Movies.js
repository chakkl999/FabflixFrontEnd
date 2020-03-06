import Config from "../Config.json";
import Socket from "../util/Socket";

const {searchEP, browseEP, getEP} = Config.movieEPs;

async function search(query, filter, keyword) {
  Socket.updateHeader();
  if (filter === "title") {
    return await Socket.GET(searchEP, query);
  } else {
    console.log(browseEP+"/"+keyword)
    console.log(query)
    return await Socket.GET(browseEP+"/"+keyword, query);
  }
}

async function getMovieDetail(movieID) {
  Socket.updateHeader();
  // console.log(getEP+"/"+movieID);
  return await Socket.GET(getEP+"/"+movieID);
}

export default {
  search,
  getMovieDetail
};
