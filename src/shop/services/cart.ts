import { Cart } from "../entities";
import { newCart } from "../repository";
import { CartRepository } from "../repository/cart";

export class CartService extends CartRepository {
  increase(title: string, price: string, list: Cart[]) {
    if (list.length > 0) {
      const isExist = list.find(
        (cart) => cart.title == title && cart.price == price
      );

      if (isExist) {
        isExist.amount++;
        isExist.total = isExist.amount * parseFloat(isExist.price);
        return isExist.amount;
      }
    }
  }

  decrease(title: string, price: string, list: Cart[]) {
    if (list.length > 0) {
      const isExist = list.find(
        (cart) => cart.title == title && cart.price == price
      );

      if (isExist) {
        isExist.amount--;
        isExist.total = isExist.amount * parseFloat(isExist.price);

        // if (isExist.amount <= 0) {
        //   newCart.delete(isExist.id);
        //   console.log(newCart.delete(isExist.id));
        // }

        if (isExist.amount <= 0) {
          const index = list.indexOf(isExist);
          console.log(index);
          if (index !== -1) {
            list.splice(index, 1);
          }
        }

        return isExist.amount;
      }
    }
  }
}
