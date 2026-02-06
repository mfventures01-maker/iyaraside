
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  sortOrder: number;
  tags?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  quote: string;
  rating: number;
  occasion: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface CateringPackage {
  title: string;
  description: string;
  priceRange: string;
  items: string[];
}
