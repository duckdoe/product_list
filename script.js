// gets the the json from data.json and returns it
const productsContainer = document.querySelector(".js-product-container");

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    data.forEach((item) => {
      let html = `<div class="product_container">
                    <div class="product">
                      <img
                        src="${item.image.desktop}"
                        alt="waffles"
                        class="product_img"
                      />
                      <button class="js-add-to-cart-button">
                        <img
                          src="assets/images/icon-add-to-cart.svg"
                          alt="Add to cart"
                        />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                    <div class="product_category">${item.category}</div>
                    <div class="product_name">${item.name}</div>
                    <div class="product_price">$${item.price}</div>
                  </div>`;
      productsContainer.innerHTML += html;
    });

    const addToCartBtn = document.querySelectorAll(".js-add-to-cart-button");
    const productImage = document.querySelectorAll(".product_img");

    addToCartBtn.forEach((button, index) => {
      button.addEventListener("click", function (e) {
        if (e.target == button) {
          let currentProductImage = productImage[index];
          if (!button.classList.contains("product-active")) {
            let count = 0;
            count += 1;
            updateCount(count, currentProductImage);
          }
        }
      });

      const not_added = button.innerHTML;
      function updateCount(count, currentProductImage = null) {
        const added = `
          <img src='assets/images/icon-increment-quantity.svg' class="js-increment small"/>
          <div id="counter">${count}</div>
          <img src="assets/images/icon-decrement-quantity.svg" class="js-decrement small"/>
        `;
        if (count <= 0) {
          button.innerHTML = not_added;
          button.style.borderColor = "var(--Rose-300)";
          button.style.backgroundColor = "var(--Rose-50)";
          button.classList.remove("product-active");
        } else {
          button.innerHTML = added;
          button.classList.add("product-active");
          button.style.backgroundColor = "var(--Red)";
          button.style.borderColor = "var(--Red)";
          if (currentProductImage != null) {
            currentProductImage.style.border = "1px solid hsl(14, 86%, 42%)";
          }
          decrement(count);
          increment(count);
        }

        function decrement() {
          const decrementButton = document.querySelectorAll(".js-decrement");
          decrementButton.forEach((button) => {
            button.addEventListener("click", () => {
              count -= 1;
              updateCount(count);
            });
          });
        }

        function increment() {
          const incrementButton = document.querySelectorAll(".js-increment");
          incrementButton.forEach((button) => {
            button.addEventListener("click", () => {
              count += 1;
              updateCount(count);
            });
          });
        }

        return count;
      }
    });
  });
