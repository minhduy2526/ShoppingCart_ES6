import { Product } from "../models/product.js";

let productList = [];

const addNewProduct = () => {
  let id = document.getElementById("txtID").value;
  let name = document.getElementById("txtProductName").value;
  let screen = document.getElementById("txtScreen").value;
  let image = document.getElementById("txtImage").value;
  let frontCamera = document.getElementById("txtFrontCamera").value;
  let backCamera = document.getElementById("txtBackCamera").value;
  let quantity = +document.getElementById("txtQuantity").value;
  let price = +document.getElementById("txtPrice").value;
  let type = document.getElementById("type").value;
  let description = document.getElementById("txtDescription").value;

  let newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    description,
    type,
    id,
    quantity
  );

  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "POST",
    data: newProduct,
  })
    .then((res) => {
      console.log(res);
      fetchProducts();
    })
    .catch((err) => {
      console.log(err);
    });
};
window.addNewProduct = addNewProduct;

const renderProducts = (data) => {
  data = data || productList;
  let dataHTML = "";
  for (let i = 0; i < data.length; i++) {
    let formattedNum = formatNum(data[i].price);

    dataHTML += `
        <tr>
        <td>${i + 1}</td>
        <td>${data[i].id}</td>
        <td>
        <img
        src="${data[i].img}"
        alt=""
        width="80px"
        height="80px"
      />
        </td>
        <td>${data[i].name}</td>
        <td>${formattedNum}₫</td>
        <td>${data[i].type}</td>
        <td>${data[i].quantity}</td>
        <td>${data[i].desc}</td>
        <td>
            <button class = "btn btn-danger" onclick="deleteProduct('${
              data[i].id
            }')">Xóa</button>
            <button class = "btn btn-info" onclick="getProductByID('${
              data[i].id
            }')">Update</button>
        </td>
      </tr>
        `;
  }
  document.getElementById("tbodyProduct").innerHTML = dataHTML;
};

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
fetchProducts();

const formatNum = (num) => {
  var str = num.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
};

const deleteProduct = (id) => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + id,
    method: "DELETE",
  })
    .then((res) => {
      fetchProducts();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.deleteProduct = deleteProduct;

const getProductByID = (id) => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + id,
    method: "GET",
  })
    .then((res) => {
      let foundedProduct = res.data;
      document.getElementById("txtID").value = foundedProduct.id;
      document.getElementById("txtProductName").value = foundedProduct.name;
      document.getElementById("txtScreen").value = foundedProduct.screen;
      document.getElementById("txtImage").value = foundedProduct.img;
      document.getElementById("txtFrontCamera").value =
        foundedProduct.frontCamera;
      document.getElementById("txtBackCamera").value =
        foundedProduct.backCamera;
      document.getElementById("txtQuantity").value = foundedProduct.quantity;
      document.getElementById("txtPrice").value = foundedProduct.price;
      document.getElementById("type").value = foundedProduct.type;
      document.getElementById("txtDescription").value = foundedProduct.desc;
      document.getElementById("btnCreate").style.display = "none";
      document.getElementById("btnUpdate").style.display = "inline";
      document.getElementById("txtID").disabled = true;
    })
    .catch((error) => {
      console.log(error);
    });
};
window.getProductByID = getProductByID;

const updateProduct = () => {
  let id = document.getElementById("txtID").value;
  let name = document.getElementById("txtProductName").value;
  let screen = document.getElementById("txtScreen").value;
  let image = document.getElementById("txtImage").value;
  let frontCamera = document.getElementById("txtFrontCamera").value;
  let backCamera = document.getElementById("txtBackCamera").value;
  let quantity = +document.getElementById("txtQuantity").value;
  let price = +document.getElementById("txtPrice").value;
  let type = document.getElementById("type").value;
  let description = document.getElementById("txtDescription").value;

  let updatedProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    description,
    type,
    id,
    quantity
  );

  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + id,
    method: "PUT",
    data: updatedProduct,
  }).then((res) => {
    fetchProducts();
    document.getElementById("btnReset").click();
    document.getElementById("btnCreate").style.display = "block";
    document.getElementById("btnUpdate").style.display = "none";
    document.getElementById("txtID").disabled = false;
  });
};

window.updateProduct = updateProduct;
