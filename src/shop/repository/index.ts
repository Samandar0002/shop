import { CartRepository } from "./cart";
import { ProductRepository } from "./product";
import { UserRepository } from "./user";
export { CartRepository } from "./cart";

const newUser = new UserRepository();
const newProduct = new ProductRepository();
const newCart = new CartRepository();

export { newUser, newProduct, newCart };
