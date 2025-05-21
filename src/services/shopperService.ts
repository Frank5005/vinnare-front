import api from "./api";

export async function getProducts() {
  const response = await api.get("/api/product/store", {
    withCredentials:false,
  });
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
  return response.data;
}

export async function addToWishlist(userId: string, productId: number) {
  const response = await api.post("/api/user/wishlist/add", {
    product_id: productId,
    user_id: userId,
  });
  return response.data;
}

export const removeFromWishlist = async (productId: number) => {
  const res = await api.delete(`api/user/wishlist/${productId}`);
  return res.data;
};

export const getWishlistItemId = async (productId: number) => {
  const res = await api.get(`api/user/wishlist/item`, {
    params: {
      productId,
    },
  });
  return res.data;
};

export async function getCart(){
  const response = await api.get("/api/cart/full");
  return response.data.map((p: any) => ({
    id: p.productId,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.image,
    quantity: p.quantity,
    available: p.available,
    categoryId: p.categoryId,
  }));
}

export async function addToCart(productId: number, quantity: number) {
  const response = await api.post("/api/cart", {
    productId,
    quantity,
  });
  return response.data;
}

export async function removeFromCart(productId: number){
  const response = await api.delete(`api/cart/${productId}`);
  return response.data;
}

export async function useCoupon(code: string){
  const response = await api.get("/api/coupons/use", {
    params: {code},
  });
  return response.data;
}

export async function buyProducts(code: string){
  const response = await api.post("/api/purchases", {
    params: {code},
  });
  return response.data;
}
