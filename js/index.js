import { Product } from "../models/product.js";

let productList = [];
let cart = [];

const fetchProducts = async () => {
  try {
    const res = await axios({
      url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "GET",
    });
    productList = mapProducts(res.data);
    renderProducts(productList);
  } catch (error) {
    console.log("Error at fetchProducts: " + error);
  }
};

const mapProducts = (data) => {
  const res = data.map((item) => {
    return new Product(
      item.name,
      item.price,
      item.screen,
      item.backCamera,
      item.frontCamera,
      item.img,
      item.desc,
      item.type,
      item.id,
      item.quantity
    );
  });

  return res;
};

const renderProducts = (data) => {
  data = data || productList;
  let productListHTML = "";
  for (let i = 0; i < data.length; i++) {
    let formattedNum = formatNum(data[i].price);
    // console.log(formattedNum);
    productListHTML += `
        <div class="col-sm-4">
        <div style="margin: 20px 0; padding: 15px; height="420px" class="card">
          <img
            class="card-img-top"
            src="${data[i].img}"
            alt=""
            width="100%"
            height="380px"
          />
          <div class="card-body">
            <div class="card-title fw-bolder fs-5 text-center">
              ${data[i].name}
            </div>
            <div style="margin-bottom: 10px" class="card-text text-start fs-6">
                ${data[i].desc}
            </div>
            <div
              style="margin: 10px"
              class="card-text fw-bolder text-center text-danger fs-5"
            >
              Price: ${formattedNum}₫
            </div>
            <button
              id="addToCart"
              style="width: 100%"
              type="button"
              class="btn btn-success fw-bold"
              onclick="addToCart(${data[i].id})"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>`;
  }
  document.getElementById("productList").innerHTML = productListHTML;
};

fetchProducts();

const formatNum = (num) => {
  var str = num.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
};

const handleFilter = () => {
  let categorizedList = [];
  let type = document.getElementById("filter").value;
  if (type === "SamSung") {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].type === "Samsung") {
        categorizedList.push(productList[i]);
      }
    }
  } else if (type === "Apple") {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].type === "Iphone") {
        categorizedList.push(productList[i]);
      }
    }
  } else if (type === "All") {
    return renderProducts(productList);
  }
  // console.log(categorizedList);
  renderProducts(categorizedList);
};

window.handleFilter = handleFilter;

// ---------------------------------------------------------------------------
//------------------------------------Cart------------------------------------

const addToCart = (id) => {
  const parseID = parseInt(id);
  if (checkExistedItem(id)) {
    changeNumberOfUnits("plus", id);
  } else {
    for (let i = 0; i < productList.length; i++) {
      if (+productList[i].id === parseID) {
        cart.push({
          ...productList[i],
          numberOfUnits: 1,
        });
      }
    }
    updateCart(cart);
  }
  // console.log(cart);
};
window.addToCart = addToCart;

const updateCart = () => {
  document.getElementById("warning").innerHTML = ``;
  document.getElementById("total-checkout").style.display = "block";
  // console.log("This is update Cart");
  renderCartItem(cart);
  renderTotalPrice();
  checkCartEmpty();
};

const checkExistedItem = (id) => {
  for (let i = 0; i < cart.length; i++) {
    if (+cart[i].id === id) {
      return true;
    }
  }
  return false;
};

// const countNum

// if (!cart) {
//   console.log(123);
//   document.getElementById(
//     "cartList"
//   ).innerHTML = `<h1 class="text-center text-danger fs-4">Cart is empty! Let's buy something!</h1>`;
// }
const renderCartItem = (cart) => {
  let cartListHTML = "";
  for (let i = 0; i < cart.length; i++) {
    // console.log(cart[i].img);
    let formattedNum = formatNum(cart[i].price);
    let totalPriceOfEachItem = formatNum(
      getTotalPriceOfEachItem(cart[i].price, cart[i].numberOfUnits)
    );
    // console.log(totalPrice);
    cartListHTML += `     
    <tr>
    <th scope="row">
      <img
        src="${cart[i].img}"
        alt=""
        width="80px"
        height="80px"
      />
    </th>
    <td>${cart[i].name}</td>
    <td>${formattedNum} ₫</td>
    <td>
      <button onclick="changeNumberOfUnits('plus', ${cart[i].id})" type="button" class="btn btn-primary">
        <i class="fa fa-plus"></i>
      </button>
      <span style="padding: 0 12px">${cart[i].numberOfUnits}</span>
      <button onclick="changeNumberOfUnits('minus', ${cart[i].id})" type="button" class="btn btn-primary">
        <i class="fa fa-minus"></i>
      </button>
    </td>
    <td>${totalPriceOfEachItem} ₫</td>
    <td>
      <button onclick="removeItemFromCart(${cart[i].id})" type="button" class="btn btn-danger">
      <i class="fa fa-times"></i>
      </button>
    </td>
  </tr>
  `;
  }
  document.getElementById("cartList").innerHTML = cartListHTML;
};

const getTotalPriceOfEachItem = (unitPrice, quantity) => {
  let totalPriceOfEachItem = 0;
  return (totalPriceOfEachItem += +unitPrice * +quantity);
};
window.getTotalPriceOfEachItem = getTotalPriceOfEachItem;

const renderTotalPrice = () => {
  let totalPriceHTML = "";
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
  });
  totalPrice = formatNum(totalPrice);
  totalPriceHTML = `(${totalPrice})`;
  document.getElementById("total").innerHTML = totalPrice;
};

const changeNumberOfUnits = (action, id) => {
  // console.log("This is changeNumberOfUnits");
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if (+item.id === id) {
      if (action === "minus") {
        numberOfUnits--;
      } else if (action === "plus") {
        numberOfUnits++;
      }
    }
    return {
      ...item,
      numberOfUnits,
    };
  });
  updateCart();
};
window.changeNumberOfUnits = changeNumberOfUnits;
// document.getElementById("filter").addEventListener("change", handleFilter);

const checkCartEmpty = () => {
  if (cart.length === 0) {
    document.getElementById("warning").innerHTML = `
    <h3 class="my-4 text-danger">Your Cart is empty! Let's buy something first</h3>
    `;
    document.getElementById("total-checkout").style.display = "none";
  }
};
checkCartEmpty();

const removeItemFromCart = (id) => {
  console.log("Cart Before Filter: " + cart);
  cart = cart.filter((item) => {
    +item.id !== +id;
    console.log("item id: " + item.id);
    console.log("id: "+id);
  });
  console.log("Cart After Filter: " + cart);

  updateCart();
};
window.removeItemFromCart = removeItemFromCart;
