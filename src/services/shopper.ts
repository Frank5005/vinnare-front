//import { date } from "zod";
import api from "./api";

export async function getProducts() {
  const response = await api.get("/api/product/store");
  return response.data.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    imageUrl: p.image,
    rate: p.rate,
    quantity: p.quantity,
    available: p.available,
  }));
}

export async function getProductById(id: number) {
  const response = await api.get(`/api/product/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/api/category/store");
  return response.data.map((c: any) => ({
    name: c.name,
  }));
}

export async function getWishlist() {
  const response = await api.get("/api/user/wishlist");

  return response.data.map((p: any) => ({
    id: p.id, 
    title: p.title,
    price: p.price,
    category: p.category,
    description: p.description,
    image: p.image,
    approved: p.approved,
    quantity: p.quantity,
    available: p.available,
  }));
}

export async function addToCart(productId: number, quantity: number) {
  const response = await api.post("/api/cart", {
    productId,
    quantity,
  });
  return response.data;
}

export async function addToWishlist(productId: number) {
  const response = await api.post("/api/user/wishlist/add", {
    productId,
  });
  return response.data;
}
