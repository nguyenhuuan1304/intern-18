import http from "@/hooks/useAxios";
import { Product } from "../types/ProductType";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const [productsResponse, imagesResponse] = await Promise.all([
            http.get("/products?populate=*"),
            http.get("/product-images?populate=*"),
        ]);

        const productsData = productsResponse.data;
        const imagesData = imagesResponse.data;

        // Tạo Map lưu danh sách ảnh theo documentId
        const productImagesMap = new Map<string, { id: number; documentId: string; color: string; img: { url: string | null }[] }>();

        imagesData.data.forEach((image: any) => {
            productImagesMap.set(image.documentId, {
                id: image.id,
                documentId: image.documentId,
                color: image.color,
                img: image.img?.length
                    ? image.img.map((img: any) => ({
                        url: img.url ? `http://localhost:1337${img.url}` : null,
                    }))
                    : [],
            });
        });

        return productsData.data.map((item: any) => {

            // Tính tổng rating và số lượng đánh giá
            const ratingsArray = item.ratings || [];
            const totalRatings = ratingsArray.reduce((sum: number, rating: any) => sum + (rating.rating || 0), 0);
            const ratingCount = ratingsArray.length;
            const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

            return {
                id: item.id,
                documentId: item.documentId,
                name: item.name,
                prices: item.prices,
                id_shirt_pant: item.id_shirt_pant
                    ? {
                        id: item.id_shirt_pant.id,
                        documentId: item.id_shirt_pant.documentId,
                        S: item.id_shirt_pant.S,
                        M: item.id_shirt_pant.M,
                        L: item.id_shirt_pant.L,
                        XL: item.id_shirt_pant.XL,
                        XXL: item.id_shirt_pant.XXL,
                    }
                    : null,
                id_shoe: item.id_shoe
                    ? {
                        id: item.id_shoe.id,
                        documentId: item.id_shoe.documentId,
                        S38: item.id_shoe.S38,
                        S39: item.id_shoe.S39,
                        S40: item.id_shoe.S40,
                        S41: item.id_shoe.S41,
                        S42: item.id_shoe.S42,
                        S43: item.id_shoe.S43,
                    }
                    : null,
                product_detail: item.product_detail
                    ? {
                        id: item.product_detail.id,
                        documentId: item.product_detail.documentId,
                        description: item.product_detail.description,
                        productStatus: item.product_detail.productStatus,
                        rating: item.product_detail.rating || 0,
                        createdAt: item.product_detail.createdAt,
                        updatedAt: item.product_detail.updatedAt,
                        publishedAt: item.product_detail.publishedAt,
                    }
                    : null,
                rating: averageRating,
                ratingCount, 
                ratings: ratingsArray,
                Image: item.Image.map((img: any) => ({
                    id: img.id,
                    documentId: img.documentId,
                    name: img.name,
                    url: img.url ? `http://localhost:1337${img.url}` : null,
                    formats: img.formats ? { thumbnail: img.formats.thumbnail } : undefined,
                })),
                name_category: item.name_category
                    ? {
                        id: item.name_category.id,
                        documentId: item.name_category.documentId,
                        name: item.name_category.name,
                    }
                    : null,
                product_images: item.product_images.map((img: any) => ({
                    id: img.id,
                    documentId: img.documentId,
                    color: img.color,
                    img: productImagesMap.get(img.documentId)?.img || [],
                })),
                product_sale: item.product_sale
                    ? {
                        id: item.product_sale.id,
                        documentId: item.product_sale.documentId,
                        percent_discount: item.product_sale.percent_discount,
                        createdAt: item.product_sale.createdAt,
                        updatedAt: item.product_sale.updatedAt,
                        publishedAt: item.product_sale.publishedAt,
                    }
                    : null,
            };
        });
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
        throw error;
    }
};