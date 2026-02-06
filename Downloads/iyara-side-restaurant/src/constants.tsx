
import { Dish, Testimonial } from './types';

export const ALL_DISHES: Dish[] = [
  {
    id: "JAK_001",
    name: "Jollof Rice",
    description: "A flavorful Nigerian rice dish cooked in tomatoes",
    price: 5000,
    image: "https://i.postimg.cc/944RvdbH/jollof.jpg", // Fixed potential broken link to a guessable direct link
    category: "Main Course",
    isAvailable: true,
    sortOrder: 1,
    tags: ['Popular', 'Traditional']
  },
  {
    id: "JAK_002",
    name: "Jollof Rice and diced chicken",
    description: "Jollof rice served with diced chicken and plantains",
    price: 7500,
    image: "https://i.postimg.cc/GmkJdbL4/Jollof-rice-chicken-and-diced-plantains-).jpg",
    category: "Main Course",
    isAvailable: true,
    sortOrder: 2,
    tags: ['Bestseller']
  },
  {
    id: "JAK_003",
    name: "Peppered Fish",
    description: "Grilled fish coated with spicy seasoning",
    price: 13000,
    image: "https://i.postimg.cc/SKX4nQs8/fish-pepper-tilapia.jpg",
    category: "Main Course",
    isAvailable: true,
    sortOrder: 3,
    isSpicy: true
  },
  {
    id: "JAK_004",
    name: "Stew Jollof",
    description: "Special stew served with jollof rice",
    price: 50000,
    image: "https://i.postimg.cc/7ZMQHFwv/stew-jollof-wholesale.jpg",
    category: "Main Course",
    isAvailable: true,
    sortOrder: 4
  },
  {
    id: "JAK_005",
    name: "Stew",
    description: "Traditional Nigerian stew",
    price: 3000,
    image: "https://i.postimg.cc/ZqbsCw5W/Stew.jpg",
    category: "Main Course",
    isAvailable: true,
    sortOrder: 5
  },
  {
    id: "JAK_006",
    name: "Egusi Soup",
    description: "Rich soup made from ground melon seeds",
    price: 2500,
    image: "https://i.postimg.cc/257wFrMx/Egusi-soup.jpg",
    category: "Soup",
    isAvailable: true,
    sortOrder: 6
  },
  {
    id: "JAK_007",
    name: "Okra Soup",
    description: "Traditional okra-based soup",
    price: 3000,
    image: "https://i.postimg.cc/vHn5tG6f/Okra-Soup.jpg",
    category: "Soup",
    isAvailable: true,
    sortOrder: 7
  },
  {
    id: "JAK_008",
    name: "White Soup Ofe Nsala",
    description: "Traditional white soup delicacy",
    price: 10500,
    image: "https://i.postimg.cc/xCqsPqHz/White-soup.jpg",
    category: "Soup",
    isAvailable: true,
    sortOrder: 8
  },
  {
    id: "JAK_009",
    name: "Eba na banga soup",
    description: "Eba served with banga soup",
    price: 7500,
    image: "https://i.postimg.cc/nrz0hgdR/eba-and-soup.jpg",
    category: "Soup",
    isAvailable: true,
    sortOrder: 9
  },
  {
    id: "JAK_010",
    name: "Beans",
    description: "Traditional Nigerian beans stew",
    price: 3000,
    image: "https://i.postimg.cc/7YRQfPrS/beans_ufwwkm.jpg",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 10
  },
  {
    id: "JAK_011",
    name: "Pounded Yam",
    description: "A starchy dish made from yam",
    price: 500,
    image: "https://i.postimg.cc/yd5S0G6K/poundo_vnrgjy_oetqvm.webp",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 11
  },
  {
    id: "JAK_012",
    name: "Moimoi",
    description: "Steamed bean pudding",
    price: 2000,
    image: "https://i.postimg.cc/tJZWfjSL/Moi_Moi_Elewe.jpg",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 12
  },
  {
    id: "JAK_013",
    name: "Plantain",
    description: "Fried plantain slices",
    price: 1000,
    image: "https://i.postimg.cc/JzcJSKxh/Plantain_4_ja1w7o.webp",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 13
  },
  {
    id: "JAK_014",
    name: "Amala",
    description: "Yam flour-based swallow",
    price: 1000,
    image: "https://i.postimg.cc/0QCBQp9b/Amala_oyexry.webp",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 14
  },
  {
    id: "JAK_015",
    name: "Garri and Pounded yam",
    description: "Garri and pounded yam with egusi soup",
    price: 9000,
    image: "https://i.postimg.cc/9Q3t6Djp/Garri_and_pounded_yam_served_with_egusi_soup_ready_to_eat_Premium_Photo.jpg",
    category: "Side Dish",
    isAvailable: true,
    sortOrder: 15
  },
  {
    id: "JAK_016",
    name: "Semo",
    description: "Traditional semolina swallow",
    price: 300,
    image: "https://i.postimg.cc/kDP6ptbr/semo_gg7miv_nmnt90.webp",
    category: "Appetizer",
    isAvailable: true,
    sortOrder: 16
  },
  {
    id: "JAK_017",
    name: "Assorted",
    description: "Assorted meat selection",
    price: 2500,
    image: "https://i.postimg.cc/qMq5JhSq/Assorted_xispda_opscza.jpg",
    category: "Protein",
    isAvailable: true,
    sortOrder: 17
  },
  {
    id: "JAK_018",
    name: "Beef",
    description: "Beef portions",
    price: 1000,
    image: "https://i.postimg.cc/dVTNdMqJ/beef_200_py66ni.jpg",
    category: "Protein",
    isAvailable: true,
    sortOrder: 18
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Chidi Okafor',
    photo: 'https://i.pravatar.cc/150?u=chidi',
    quote: "The Jollof Rice Supreme is easily the best in Asaba. Exceptional service and ambiance.",
    rating: 5,
    occasion: 'Business Dinner'
  },
  {
    id: 't2',
    name: 'Sarah Adeyemi',
    photo: 'https://i.pravatar.cc/150?u=sarah',
    quote: "We hosted our anniversary here and Iyarà Side exceeded all expectations. The Salmon was perfect!",
    rating: 5,
    occasion: 'Anniversary'
  },
  {
    id: 't3',
    name: 'Emeka Nwosu',
    photo: 'https://i.pravatar.cc/150?u=emeka',
    quote: "A true gem in Delta State. The fusion of local and intercontinental flavors is masterfully done.",
    rating: 5,
    occasion: 'Family Lunch'
  }
];
