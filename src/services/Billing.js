import Config from "../Config.json";
import Socket from "../util/Socket";

const {addCartEP, getCartEP, clearCartEP, updateCartEP, deleteCartEP, retrieveOrderEP, placeOrderEP, completeOrderEp} = Config.billingEPs;

const localStorage = require("local-storage");

async function insertCart(movieID, quantity) {
  Socket.updateHeader();
  const payLoad = {
    email : localStorage.get("email"),
    movie_id : movieID,
    quantity : quantity
  };
  return await Socket.POST(addCartEP, payLoad);
}

async function retrieveCart() {
    Socket.updateHeader();
    const payLoad = {
        email : localStorage.get("email")
    }
    return await Socket.POST(getCartEP, payLoad);
}

async function clearCart() {
    Socket.updateHeader();
    const payLoad = {
        email : localStorage.get("email")
    }
    return await Socket.POST(clearCartEP, payLoad);
}

async function updateCart(movieID, quantity) {
    Socket.updateHeader();
    const payLoad = {
      email : localStorage.get("email"),
      movie_id : movieID,
      quantity : quantity
    };
    return await Socket.POST(updateCartEP, payLoad);
}

async function deleteItem(movieID) {
    Socket.updateHeader();
    const payLoad = {
        email : localStorage.get("email"),
        movie_id : movieID
    };
    return await Socket.POST(deleteCartEP, payLoad);
}

async function retrieveTransaction() {
    Socket.updateHeader();
    const payLoad = {
        email : localStorage.get("email")
    }
    return await Socket.POST(retrieveOrderEP, payLoad);
}

async function placeOrder() {
    Socket.updateHeader();
    const payLoad = {
        email : localStorage.get("email")
    }
    return await Socket.POST(placeOrderEP, payLoad);
}

async function completeOrder(token, payerID) {
    Socket.updateHeader();
    const payLoad = {
        token : token,
        payerID: payerID
    }
    return await Socket.GET(completeOrderEp, payLoad);
}

export default {
  insertCart,
  retrieveCart,
  clearCart,
  updateCart,
  deleteItem,
  retrieveTransaction,
  placeOrder,
  completeOrder
};
