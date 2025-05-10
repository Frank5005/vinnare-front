import api from "./api";

export async function getProducts() {
  const response = await api.get("/api/product/store");
  return response.data.map((p: any) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    imageUrl: p.image,
    category: p.category,
  }));
}

export async function getCategories() {
  const response = await api.get("/api/category/store");
  return response.data.map((c: any) => ({
    name: c.name
  }));
}
