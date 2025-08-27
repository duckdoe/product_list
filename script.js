window.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  async function getData() {
    try {
      let data = await fetch("data.json");
      let dataJson = await data.json();

      return dataJson;
    } catch (e) {
      console.error(e);
    }
  }

  const productContainer = document.querySelector(".js-product-container");

  getData().then((products) => {
    products.forEach((product) => {
      let html = `<div class="product_container">
                    <div class="product">
                      <img
                        src="${product.image.desktop}"
                        alt="waffles"
                        class="product_img"
                      />
                      <button class="js-add-to-cart-button" data-id=${productID(product)}>
                        <img
                          src="assets/images/icon-add-to-cart.svg"
                          alt="Add to cart"
                        />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                    <div class="product_category">${product.category}</div>
                    <div class="product_name">${product.name}</div>
                    <div class="product_price">$${product.price}</div>
                  </div>`;
      productContainer.innerHTML += html;
    });
    const addToCartBtn = document.body.querySelectorAll(
      ".js-add-to-cart-button"
    );
    addToCartBtn.forEach((button) => {
      button.addEventListener("click", () => {
        console.log(button)
        let product = getProduct(products, button)
        cart.push(product);
        displayCart();
      });
    });
  });

  function productID(product) {
    return product.category.split(' ').join('-')
  }

  function getProduct(products, button) {
    for (let product of products) {
      if (product.category.split(' ').join('-') === button.getAttribute("data-id")) return product;
    }
  }

  const emptyCart = document.querySelector(".empty_cart");
  const fullCart = document.querySelector(".full_cart");
  const cartItemContainer = document.querySelector(".cart_item_container");
  const itemsLength = document.querySelector(".items_length");

  function displayCart() {
    if (cart.length > 0) {
      fullCart.style.display = "block";
      emptyCart.style.display = "none";
    } else {
      emptyCart.style.display = "flex";
      fullCart.style.display = "none";
    }
    let html = '';
    cart.forEach((cartItem) => {
      html += `<div class="cart_item">
                <div class="cart_item_info">
                  <div class="cart_item_header">
                    <span>${cartItem.name}</span>
                  </div>
                  <div class="cart_item_price">
                    <div class="amount">1x</div>
                    <div class="price">@$5.50</div>
                    <div class="total_price">$${cartItem.price}</div>
                  </div>
                </div>
                <div class="remove_item">
                  <img
                    src="assets/images/icon-remove-item.svg"
                    alt="remove icon"
                  />
                </div>
              </div>
`;
      console.log(html);
    });
    cartItemContainer.innerHTML = html;
    itemsLength.textContent = cart.length;
  }

  displayCart();
});
