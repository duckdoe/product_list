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
                    <picture>
                    <source srcset="${
                      product.image.mobile
                    }" media="(width < 768px)"/>
                    <source srcset="${
                      product.image.desktop
                    }" media="(width > 768px)"/>
                      <img
                        src="${product.image.desktop}"
                        alt="waffles"
                        class="product_img"
                      />
                      </picture>
                      <button class="js-add-to-cart-button" data-id=${getProductProperty(
                        product,
                        "category"
                      )}>
                        <img
                        src="assets/images/icon-add-to-cart.svg"
                        />
                        <span>Add to cart</span>
                      </button>
                    </div>
                    <div class="product_category">${product.category}</div>
                    <div class="product_name">${product.name}</div>
                    <div class="product_price">$${product.price.toFixed(
                      2
                    )}</div>
                  </div>`;
      productContainer.innerHTML += html;
    });
    const addToCartBtn = document.body.querySelectorAll(
      ".js-add-to-cart-button"
    );
    addToCartBtn.forEach((button) => {
      button.addEventListener("click", () => {
        let product = getProduct(products, button);
        let found = false;
        if (!found) {
          cart.push(product);
          for (item of cart) {
            if (item.amount > 1) continue;
            item.amount = 1;
          }
        }
        displayCart();
        let img = button.parentElement.firstChild.nextSibling;
        img.style.border = "1px solid var(--Red)";
        button.classList.add("space");
        button.innerHTML = `
                        <div class="decrement_icon_container">
                        <img
                        src="assets/images/icon-decrement-quantity.svg"
                        alt="Decrement Icon"
                        class="decrement"
                        /></div>
                        <span id="item_amount_counter" style="color: hsl(0,0%,100%);">1</span>
                        <div class="increment_icon_container">
                        <img
                        src="assets/images/icon-increment-quantity.svg"
                        alt="increment Icon"
                        class="increment"
                        /></div>`;
        function decrementIncrementIcons() {
          const incrementIcon = document.querySelectorAll(
            ".increment_icon_container"
          );
          const decrementIcon = document.querySelectorAll(
            ".decrement_icon_container"
          );
          const itemAmountCounter = document.querySelectorAll(
            "#item_amount_counter"
          );

          for (let i = 0; i < incrementIcon.length; i++) {
            itemAmountCounter[i].addEventListener("click", (e) => {
              e.stopPropagation();
              return;
            });
            incrementIcon[i].addEventListener("click", (e) => {
              let button = incrementIcon[i].parentElement;
              e.stopPropagation();
              cart.map((item) => {
                if (
                  item.category.split(" ").join("-") ==
                  button.getAttribute("data-id")
                ) {
                  item.amount += 1;
                  displayCart();
                }
                itemAmountCounter[i].textContent = item.amount;
              });
            });
            decrementIcon[i].addEventListener("click", (e) => {
              e.stopPropagation();
              let button = decrementIcon[i].parentElement;
              cart.map((item) => {
                if (
                  item.category.split(" ").join("-") ==
                  button.getAttribute("data-id")
                ) {
                  item.amount -= 1;
                  displayCart();
                }
                itemAmountCounter[i].textContent = item.amount;
              });
            });
          }
        }
        decrementIncrementIcons();
        button.style.background = "var(--Red)";
      });
    });
  });

  function getProductProperty(product, property) {
    return product[property].split(" ").join("-");
  }

  function getProduct(products, button) {
    for (let product of products) {
      if (
        getProductProperty(product, "category") ===
        button.getAttribute("data-id")
      )
        return product;
    }
  }

  const emptyCart = document.querySelector(".empty_cart");
  const fullCart = document.querySelector(".full_cart");
  const cartItemContainer = document.querySelector(".cart_item_container");
  const itemsLength = document.querySelector(".items_length");
  const total = document.querySelector(".total");
  function displayCart() {
    if (cart.length > 0) {
      fullCart.style.display = "block";
      emptyCart.style.display = "none";
    } else {
      emptyCart.style.display = "flex";
      fullCart.style.display = "none";
    }
    let totalPrice = 0;
    cart.map((item) => {
      totalPrice += item.amount * item.price;
    });
    total.textContent = "$" + totalPrice.toFixed(2);
    let html = "";
    cart.forEach((cartItem) => {
      html += `<div class="cart_item">
                <div class="cart_item_info">
                  <div class="cart_item_header">
                    <span>${cartItem.name}</span>
                  </div>
                  <div class="cart_item_price">
                    <div class="amount">${cartItem.amount}x</div>
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
    });
    cartItemContainer.innerHTML = html;
    itemsLength.textContent = cart.length;
    const removeIcon = document.querySelectorAll(".remove_item");
    removeIcon.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        cart.splice(index, 1);
        displayCart();
      });
    });
  }

  displayCart();
});
