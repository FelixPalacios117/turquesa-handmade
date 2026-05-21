const products = [
  {
    id: 1, name: "Anillo de Plata con Zirconia", price: 45.99,
    category: "anillos", category_name: "Anillos", category_slug: "anillos",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    description: "Elegante anillo de plata esterlina con piedra de zirconia cubica.",
    featured: true,
  },
  {
    id: 2, name: "Anillo Dorado Minimalista", price: 32.50,
    category: "anillos", category_name: "Anillos", category_slug: "anillos",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    description: "Anillo dorado con diseno minimalista, perfecto para uso diario.",
    featured: false,
  },
  {
    id: 3, name: "Anillo de Compromiso Clasico", price: 189.99,
    category: "anillos", category_name: "Anillos", category_slug: "anillos",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
    description: "Hermoso anillo de compromiso con diseno clasico y elegante.",
    featured: true,
  },
  {
    id: 4, name: "Collar de Perlas Naturales", price: 78.00,
    category: "collares", category_name: "Collares", category_slug: "collares",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    description: "Collar con perlas naturales cultivadas, broche de plata.",
    featured: true,
  },
  {
    id: 5, name: "Cadena de Oro Rosa", price: 55.00,
    category: "collares", category_name: "Collares", category_slug: "collares",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
    description: "Delicada cadena en tono oro rosa con dije de corazon.",
    featured: false,
  },
  {
    id: 6, name: "Gargantilla de Cristales", price: 42.00,
    category: "collares", category_name: "Collares", category_slug: "collares",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    description: "Gargantilla con cristales brillantes, ideal para ocasiones especiales.",
    featured: true,
  },
  {
    id: 7, name: "Pulsera de Charms", price: 65.00,
    category: "pulseras", category_name: "Pulseras", category_slug: "pulseras",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
    description: "Pulsera con dijes variados, personalizable y unica.",
    featured: true,
  },
  {
    id: 8, name: "Brazalete Tejido Artesanal", price: 28.00,
    category: "pulseras", category_name: "Pulseras", category_slug: "pulseras",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    description: "Brazalete tejido a mano con hilos de colores y cuentas.",
    featured: false,
  },
  {
    id: 9, name: "Pulsera de Plata con Dijes", price: 52.00,
    category: "pulseras", category_name: "Pulseras", category_slug: "pulseras",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    description: "Pulsera de plata esterlina con dijes de estrellas y lunas.",
    featured: false,
  },
  {
    id: 10, name: "Aretes de Argolla Dorados", price: 25.00,
    category: "aretes", category_name: "Aretes", category_slug: "aretes",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400",
    description: "Aretes de argolla en tono dorado, diseno clasico atemporal.",
    featured: true,
  },
  {
    id: 11, name: "Pendientes de Cristal", price: 38.00,
    category: "aretes", category_name: "Aretes", category_slug: "aretes",
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400",
    description: "Pendientes largos con cristales que brillan con la luz.",
    featured: true,
  },
  {
    id: 12, name: "Aretes Flor de Perla", price: 34.00,
    category: "aretes", category_name: "Aretes", category_slug: "aretes",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400",
    description: "Aretes en forma de flor con centro de perla cultivada.",
    featured: false,
  },
];

export const categories = [
  { id: 1, slug: "anillos", name: "Anillos", icon: "💍", product_count: 3 },
  { id: 2, slug: "collares", name: "Collares", icon: "📿", product_count: 3 },
  { id: 3, slug: "pulseras", name: "Pulseras", icon: "⌚", product_count: 3 },
  { id: 4, slug: "aretes", name: "Aretes", icon: "✨", product_count: 3 },
];

export default products;
