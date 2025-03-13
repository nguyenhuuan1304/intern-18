import { Product } from "../types/ProductType";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const [productsResponse, imagesResponse] = await Promise.all([
            fetch("http://localhost:1337/api/products?populate=*"),
            fetch("http://localhost:1337/api/product-images?populate=*")
        ]);

        const productsData = await productsResponse.json();
        const imagesData = await imagesResponse.json();

        // Tạo Map lưu danh sách ảnh theo documentId
        const productImagesMap = new Map();
        imagesData.data.forEach((image: any) => {
            productImagesMap.set(image.documentId, {
                id: image.id,
                documentId: image.documentId,
                color: image.color,
                img: image.img?.length
                    ? image.img.map((img: any) => ({
                        url: img.url ? `http://localhost:1337${img.url}` : null
                    }))
                    : [],
            });
        });

        console.log(" Dữ liệu API sản phẩm:", productsData);
        console.log(" Dữ liệu API ảnh sản phẩm:", imagesData);

        return productsData.data.map((item: any) => ({
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
            Image: item.Image.map((img: any) => ({
                id: img.id,
                documentId: img.documentId,
                name: img.name,
                url: img.url ? `http://localhost:1337${img.url}` : null,
                formats: img.formats ? {
                    thumbnail: img.formats.thumbnail,
                } : undefined,
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
        }));
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return [];
    }
};
