import { date } from "zod";
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
  }));
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
    ownerId: p.ownerId,
    title: p.title,
    price: p.price,
    category: p.category,
    description: p.description,
    image: p.image,
    approved: p.approved,
    quantity: p.quantity,
    available: p.available,
    //date: p.date,
  }));
}
