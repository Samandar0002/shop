import { Cart } from "../entities";
import { newCart, newProduct, newUser } from "../repository";
import { cartService } from "../services";
import { registerLogin } from "./registerLogin";

const productHTML = `
    <nav class="navbar bg-body-tertiary py-3">
      <div class="container-fluid">
        <a class="navbar-brand">Shop </a>
        <div class="d-flex gap-3">
          <button
            type="button"
            class="btn btn-outline-primary position-relative d-none"
            id="basket"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <i class="bi bi-cart4"> Basket</i>
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger visually-hidden" id="badge"
            >
              99+
            </span>
          </button>

          <button class="btn btn-outline-primary" id="logIn">Log in</button>
        </div>
      </div>
    </nav> 

    <div class="container mt-5">
      <nav class="navbar w-50 bg-body-tertiary rounded">
        <div class="container-fluid">
          <form class="d-flex w-100" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              id="search"
              autocomplete="off"
            />
            <select class="form-select" id="select">
             
            </select>
          </form>
        </div>
      </nav>
      
      <div class="row row-cols-1 row-cols-md-4 g-4 my-3" id="cards"></div>
    </div>

    <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Basket</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            
            <div class="modal-body">
              <div class="container">

                <table class="table">
                  <thead class="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>

                  <tbody class="table-body">
                    
                  </tbody>
                </table>

              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
    </div>
`;

const createCardHTML = (title: string, thumbnail: string, price: string) => `
  <div class="col">
    <div class="card h-100">
      <div class="card-img-top card__img" style="background: url('${thumbnail}') no-repeat center center / cover;"></div>
      <div class="card-body" id="card__body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">$${price}</p>
        <button class="btn btn-primary card__btn">Add to basket</button>
      </div>
    </div>
  </div>
`;

const renderTable = (carts: Cart[]) => {
  let tableHtml = "";

  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    tableHtml += `
      <tr class="table-row">
        <th scope="row">${i + 1}</th>
        <td class="product-title">${cart.title}</td>
        <td class="product-price">${cart.price}</td>
        <td id="table-data" class="d-flex gap-2 align-items-center">
          <button class="btn btn-outline-danger btn-sm" id="decrease">-</button>
          <div class="amount">${cart.amount}</div>
          <button class="btn btn-outline-success btn-sm" id="increase">+</button>
        </td>
        <td>${cart.total}</td>
      </tr>`;
  }

  return tableHtml;
};

export const products = async () => {
  document.body.innerHTML = productHTML;

  const container = document.querySelector("#cards") as HTMLDivElement;
  const badge = document.querySelector("#badge") as HTMLSpanElement;
  const searchElm = document.querySelector("#search") as HTMLInputElement;
  const selectElm = document.querySelector("#select") as HTMLSelectElement;
  const tableBody = document.querySelector(".table-body") as HTMLTableElement;
  const logInBtn = document.querySelector("#logIn") as HTMLButtonElement;
  const basketElm = document.querySelector("#basket") as HTMLButtonElement;

  const increaseBtnElm = document.querySelector(
    "#increase"
  ) as HTMLButtonElement;

  try {
    const response = await fetch("https://dummyjson.com/products?limit=120");
    const json = await response.json();

    for (const product of json.products) {
      container.innerHTML += createCardHTML(
        product.title,
        product.thumbnail,
        product.price
      );

      newProduct.create(
        product.title,
        product.description,
        product.thumbnail,
        product.price
      );
    }

    searchElm.addEventListener("keyup", (e) => {
      e.preventDefault();
      const products = newProduct.search(searchElm.value);
      container.innerHTML = "";
      for (const product of products) {
        container.innerHTML += createCardHTML(
          product.title,
          product.thumbnail,
          product.price
        );
      }
    });

    selectElm.addEventListener("change", (e) => {
      e.preventDefault();
      const products = newProduct.sort(selectElm.value);
      container.innerHTML = "";
      for (const product of products) {
        container.innerHTML += createCardHTML(
          product.title,
          product.thumbnail,
          product.price
        );
      }
    });

    container.addEventListener("click", (e) => {
      const target = e.target as HTMLButtonElement;
      const card = target.closest(".card");
      const title = card.querySelector(".card-title").textContent;
      const price = card.querySelector(".card-text").textContent;

      if (!card) {
        return;
      }

      if (
        target.classList.contains("card__btn") &&
        newUser.getUserList().length > 0
      ) {
        const cartProduct = newCart.add(title, price);
        const counter = newCart.cartList.length;
        target.disabled = true;

        badge.innerText = `${counter > 50 ? "50+" : counter}`;
        badge.classList.remove("visually-hidden");
        target.textContent = "In cart";
        target.className = "btn btn-outline-primary card__btn";
      } else if (target.classList.contains("card__btn")) {
        registerLogin();
      }
    });

    basketElm.addEventListener("click", () => {
      tableBody.innerHTML = renderTable(newCart.cartList);
      const tableRowsElm: NodeListOf<HTMLTableRowElement> =
        tableBody.querySelectorAll(".table-row");

      tableRowsElm.forEach((row) => {
        const title = row.querySelector(".product-title").textContent;
        const price = row.querySelector(".product-price").textContent;
        const tdBtnGroup = row.querySelector("#table-data") as HTMLTableElement;
        const increase = tdBtnGroup.querySelector(
          "#increase"
        ) as HTMLButtonElement;
        const decrease = tdBtnGroup.querySelector(
          "#decrease"
        ) as HTMLButtonElement;
        const amountElm = tdBtnGroup.querySelector(".amount") as HTMLDivElement;

        increase.addEventListener("click", () => {
          amountElm.innerText = `${cartService.increase(
            title,
            price,
            newCart.cartList
          )}`;
        });

        decrease.addEventListener("click", () => {
          const amount = cartService.decrease(title, price, newCart.cartList);
          amountElm.innerText = `${amount}`;
          if (amount <= 0) {
            row.remove();
          }
        });
      });
    });

    if (newUser.userList.length === 0) {
      logInBtn.addEventListener("click", () => {
        registerLogin();
      });
    } else {
      logInBtn.textContent = `Log out (${newUser.userList[0].firstName})`;
      logInBtn.className = "btn btn-outline-danger";
      basketElm.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

products();
