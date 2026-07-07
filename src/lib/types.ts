export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

export type PublicProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  video: string | null;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar: string | null;
  theme: string;
  phone: string | null;
  address: string | null;
  city: string | null;
};

export type ProductSort = "new" | "price-asc" | "price-desc" | "name";
