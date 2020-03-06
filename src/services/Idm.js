import Socket from "../util/Socket";
import { idmEPs } from "../Config.json";

const { loginEP, registerEP, sessionEP } = idmEPs;

const localStorage = require("local-storage")

async function login(email, password) {
  const payLoad = {
    email: email,
    password: password.split("")
  };

  return await Socket.POST(loginEP, payLoad);
}

async function register(email, password) {
  const payLoad = {
    email : email,
    password : password.split("")
  };
  return await Socket.POST(registerEP, payLoad);
}

async function session() {
  Socket.updateHeader();
  const payLoad = {
    email : localStorage.get("email"),
    session_id : localStorage.get("session_id")
  };
  return await Socket.POST(sessionEP, payLoad);
}

export default {
  login,
  register,
  session
};
