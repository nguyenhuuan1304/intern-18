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

export interface ShirtPantSize {
    id: number;
    documentId: string;
    S?: number;
    M?: number;
    L?: number;
    XL?: number;
    XXL?: number;
}

export interface ShoeSize {
    id: number;
    documentId: string;
    38?: number;
    39?: number;
    40?: number;
    41?: number;
    42?: number;
    43?: number;
}

export interface Product {
    ratings: any;
    averageRating: number;
    img: any;
    id: number;
    documentId: string;
    name: string;
    prices: number;
    Image: Image[];
    name_category: Category;
    product_images: ProductImage[];
    id_shirt_pant?: ShirtPantSize | null;
    id_shoe?: ShoeSize | null;
    product_detail?: ProductDetail | null;
    rating: number;
    product_sale?: ProductSale | null;
}

export interface ProductDetail {
    // id: number;
    // documentId: string;
    // description: string;
    // productStatus: string;
    // rating: number;
    // createdAt: string;
    // updatedAt: string;
    // publishedAt: string;
    // product: Product;
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
    img: string[];
}

export interface ProductSale {
    id: number;
    documentId: string;
    percent_discount: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}