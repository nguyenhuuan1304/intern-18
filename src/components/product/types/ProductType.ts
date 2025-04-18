export interface ImageFormat {
    name: string;
    url: string;
    width: number;
    height: number;
}

export interface Image {
    id: number;
    documentId: string;
    name: string;
    url: string;
    formats?: {
        thumbnail: ImageFormat;
    };
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    children?: Category[];
}

export interface ProductImage {
    id: number;
    documentId: string;
    color?: string | null;
}

// export interface ShirtPantSize {
//     id: number;
//     documentId: string;
//     S?: number;
//     M?: number;
//     L?: number;
//     XL?: number;
//     XXL?: number;
// }

// export interface ShoeSize {
//     id: number;
//     documentId: string;
//     38?: number;
//     39?: number;
//     40?: number;
//     41?: number;
//     42?: number;
//     43?: number;
// }
type Inventory = {
    length: number;
    id: number;
    documentId: string;
    size: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

export interface Product {
    ratings: any;
    averageRating: number;
    ratingCount?: number;
    img: any;
    id: number;
    documentId: string;
    name: string;
    prices: number;
    Image: Image[];
    name_category: Category;
    product_images: ProductImage[];
    product_detail?: ProductDetail | null;
    rating: number;
    slug: string;
    product_sale?: ProductSale | null;
    imageUrl?: string;
    inventory: Inventory[];
}

export interface ProductDetail {
    id: number;
    documentId: string;
    description: string;
    productStatus: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    product: Product;
    averageRating?: number;
}

export interface ProductImage {
    id: number;
    documentId: string;
    color?: string | null;
    img: { url: string }[];
}

export interface ProductSale {
    id: number;
    documentId: string;
    percent_discount: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}