import { Cart } from "../entities";
import { faker } from "@faker-js/faker";

export class CartRepository {
  public cartList: Array<Cart> = [];

  add(title: string, price: string) {
    const existingProduct = this.cartList.find(
      (cart) => cart.title === title && cart.price === price
    );

    if (!existingProduct) {
      const cart = new Cart(faker.string.uuid(), title, price);
      this.cartList.push(cart);
    }
  }

  delete(id: string) {
    const index = this.cartList.findIndex((cart) => cart.id === id);
    if (index !== -1) {
      this.cartList.splice(index, 1);
    }
  }

  getCartList() {
    return this.cartList;
  }

  getNames() {
    return this.cartList.map((cart) => cart.title);
  }

  getPrices() {
    return this.cartList.map((cart) => cart.price);
  }

  // Assuming Cart has amount property
  getAmounts() {
    return this.cartList.map((cart) => cart.amount);
  }

  // Assuming Cart has total property
  getTotals() {
    return this.cartList.map((cart) => cart.total);
  }
}
