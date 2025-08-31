window.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  async function getData() {
    try {
      let data = await fetch("/data.json");
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
    cart.map((item) => {
      const buttons = document.querySelectorAll(".js-add-to-cart-button");
      for (let button of buttons) {
        if (
          button.getAttribute("data-id").split(" ").join("-") ===
          item.category.split(" ").join("-")
        ) {
          let img = button.parentElement.firstChild.nextSibling;
          img.style.border = "1px solid var(--Red)";
          button.style.background = "var(--Red)";
          button.style.border = "1px solid var(--Red)";
          button.classList.add("space");
          button.innerHTML = `
                        <div class="decrement_icon_container">
                        <img
                        src="assets/images/icon-decrement-quantity.svg"
                        alt="Decrement Icon"
                        class="decrement"
                        /></div>
                        <span id="item_amount_counter" style="color: hsl(0,0%,100%);">${item.amount}</span>
                        <div class="increment_icon_container">
                        <img
                        src="assets/images/icon-increment-quantity.svg"
                        alt="increment Icon"
                        class="increment"
                        /></div>`;
        }
      }
    });
    const decrementButton = document.querySelectorAll(
      ".decrement_icon_container"
    );
    decrementButton.forEach((decrementButton) => {
      decrementButton.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        let elementId = e.currentTarget.parentElement
          .getAttribute("data-id")
          .split(" ")
          .join("-");
        cart.map((item, index) => {
          if (item.category.split(" ").join("-") === elementId) {
            if (item.amount <= 1) {
              cart.splice(index, 1);
              const buttons = document.querySelectorAll(
                ".js-add-to-cart-button"
              );
              for (let button of buttons) {
                if (
                  button.getAttribute("data-id").split(" ").join("-") ===
                  item.category.split(" ").join("-")
                ) {
                  let img = button.parentElement.firstChild.nextSibling;
                  img.style.border = "none";
                  button.style.background = "var(--Rose-100)";
                  button.style.border = "1px solid hsl(12, 20%, 72%)";
                  button.classList.remove("space");
                  button.innerHTML = ` <img src="assets/images/icon-add-to-cart.svg"/>
           <span>Add to cart</span>`;
                }
              }
            } else {
              --item.amount;
            }
            displayCart();
          }
        });
      });
    });

    const incrementButton = document.querySelectorAll(
      ".increment_icon_container"
    );
    incrementButton.forEach((incrementButton) => {
      incrementButton.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        let elementId = e.currentTarget.parentElement
          .getAttribute("data-id")
          .split(" ")
          .join("-");
        for (item of cart) {
          if (item.category.split(" ").join("-") === elementId) {
            item.amount += 1;
            displayCart();
          }
        }
      });
    });
    total.textContent = "$" + totalPrice.toFixed(2);
    const amountDisplay = document.querySelectorAll(".amount");
    amountDisplay.forEach((display) => {
      display.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("Hello");
      });
    });
    let html = "";
    const confirmButton = document.querySelector(".full_cart button");

    confirmButton.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      modal.style.display = "block";
      displayOrder(cart);
    });

    let itemNumber = 0;
    cart.forEach((cartItem) => {
      itemNumber += cartItem.amount;
      itemsLength.textContent = itemNumber;
      html += `<div class="cart_item">
                <div class="cart_item_info">
                  <div class="cart_item_header">
                    <span>${cartItem.name}</span>
                  </div>
                  <div class="cart_item_price">
                    <div class="amount">${cartItem.amount}x</div>
                    <div class="price">@${cartItem.price.toFixed(2)}</div>
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
    const removeIcon = document.querySelectorAll(".remove_item");
    removeIcon.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        cart.map((item) => {
          const buttons = document.querySelectorAll(".js-add-to-cart-button");
          for (let button of buttons) {
            if (
              button.getAttribute("data-id").split(" ").join("-") ===
              item.category.split(" ").join("-")
            ) {
              let img = button.parentElement.firstChild.nextSibling;
              img.style.border = "none";
              button.style.background = "var(--Rose-100)";
              button.style.border = "1px solid hsl(12, 20%, 72%)";
              button.classList.remove("space");
              button.innerHTML = ` <img src="assets/images/icon-add-to-cart.svg"/>
           <span>Add to cart</span>`;
            }
          }
        });
        cart.splice(index, 1);
        displayCart();
      });
    });
  }
  displayCart();
  function displayOrder(cart) {
    const orderContainer = document.querySelector(".modal .order .container");
    const orderTotal = document.querySelector(
      ".modal main .order .order_total .total"
    );
    let totalOrderPrice = 0;
    let html = "";
    cart.forEach((item) => {
      html += `                     <div class="ordered__item">
            <div class="ordered_item_details">
              <img
                src="${item.image.mobile}"
                alt="${item.category}"
              />
              <span>
                <div class="product_name">${item.name}</div>
                <div class="details">
                  <div class="amount">${item.amount}x</div>
                  <div class="price">@${item.price.toFixed(2)}</div>
                </div>
              </span>
            </div>
            <div class="total_price">$${(item.amount * item.price).toFixed(
              2
            )}</div>
          </div>

`;
      totalOrderPrice += item.amount * item.price;
    });
    orderTotal.textContent = "$" + totalOrderPrice.toFixed(2);
    orderContainer.innerHTML = html;
  }

  const startNewOrderButton = document.querySelector(".modal footer button");
  startNewOrderButton.addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    cart = [];
    displayCart();
    const button = document.querySelectorAll(".js-add-to-cart-button");
    button.forEach((button) => {
      let img = button.parentElement.firstChild.nextSibling;
      img.style.border = "none";
      button.style.background = "var(--Rose-50)";
      button.style.border = "1px solid hsl(12, 20%, 72%)";
      button.classList.remove("space");
      button.innerHTML = `<img
                        src="assets/images/icon-add-to-cart.svg"
                        />
                        <span>Add to cart</span>`;
    });
    itemsLength.textContent = 0;
  });
});
