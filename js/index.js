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
              onclick="${addToCart(data[i].id)}"
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

const addToCart = (id) => {
  // const item = productList.find((product) => product.id === id);
  console.log("Hello");
};
window.addToCart = addToCart;


// const findProductByID = (id) => {
//   for (let i = 0; i < productList.length; i++) {
//     if (productList[i].id === id) {
//       return i;
//     }
//   }
//   return -1;
// };
// document.getElementById("filter").addEventListener("change", handleFilter);
