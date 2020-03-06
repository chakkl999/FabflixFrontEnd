import Axios from "axios";

import Config from "../Config.json";

const { baseUrl, pollLimit, gatewayEPs } = Config;

const localStorage = require("local-storage");

const HTTPMethod = Object.freeze({
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE"
});

function initSocket() {
  // const { common } = Axios.defaults.headers;

  // common["email"] = localStorage.get("email");
  // common["session_id"] = localStorage.get("session_id");

  Axios.defaults.baseURL = baseUrl;
}

function updateHeader() {
  const { common } = Axios.defaults.headers;

  common["email"] = localStorage.get("email");
  common["session_id"] = localStorage.get("session_id");
}

function removeHeader() {
  const { common } = Axios.defaults.headers;

  delete common["email"];
  delete common["session_id"];
}

async function GET(path, data) {
  return await sendHTTP(HTTPMethod.GET, path, data);
}

async function POST(path, data) {
  return await sendHTTP(HTTPMethod.POST, path, data);
}

async function DELETE(path) {
  return await sendHTTP(HTTPMethod.DELETE, path);
}

async function sendHTTP(method, path, data) {
  let response;
  switch (method) {
    case HTTPMethod.GET:
      if(data !== undefined) {
        response = await Axios.get(path, {params:data});
      } else {
        response = await Axios.get(path);
      }
      break;
    case HTTPMethod.POST:
      response = await Axios.post(path, data);
      break;
    case HTTPMethod.DELETE:
      response = await Axios.delete(path);
      break;
    default:
    // Should never reach here
  }

  /************************************************
        TODO Do error checking on response 
  ************************************************/
  if (response.status !== 204) {
    if (response.status === 500) {
      alert("Server error. Please try again.");
      return undefined;
    }
    return response
  }
  return await getReport(response);
}

async function getReport(response) {
  const axiosConfig = {
    headers: { transaction_id: response.headers["transaction_id"] }
  };

  return await pollForReport(axiosConfig);
}

async function pollForReport(axiosConfig) {
  let noContent = 204;

  for (let i = 0; i < pollLimit; i++) {
    const response = await Axios.get(gatewayEPs.reportEP, axiosConfig);

    // console.log("asdf");
    if (response.status !== noContent) {
      /************************************************
            TODO More Robust checking for response  
      ************************************************/
      if (response.status === 500) {
          alert("Server error. Please try again.");
          return undefined;
      }
      return response;
    } else await timeOut();
  }

  return undefined;
}

async function timeOut() {
  return new Promise(resolve => {
    let pollingLimit = 100;
    setTimeout(() => resolve(), pollingLimit);
  });
}

export default {
  initSocket,
  GET,
  POST,
  DELETE,
  updateHeader,
  removeHeader
};
