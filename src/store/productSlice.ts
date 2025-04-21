import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "@/components/product/types/ProductType";
import { api } from "@/hooks/useAxios";

interface ProductState {
  products: Product[];
  allProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  allProducts: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const [productsResponse, imagesResponse] = await Promise.all([
        api.get("/products?populate=*"),
        api.get("/product-images?populate=*"),
      ]);
      if (!productsResponse.data || !imagesResponse.data) {
        throw new Error("Invalid response data");
      }
      const productsData = productsResponse.data;
      const imagesData = imagesResponse.data;

      const productImagesMap = new Map<
        string,
        { img: { url: string | null }[] }
      >();
      imagesData.data.forEach((image: any) => {
        productImagesMap.set(image.documentId, {
          img: image.img?.length
            ? image.img.map((img: any) => ({
              url: img.url ? `http://localhost:1337${img.url}` : null,
            }))
            : [],
        });
      });

      return productsData.data.map((item: any) => {
        const ratingsArray = item.ratings || [];
        const totalRatings = ratingsArray.reduce(
          (sum: number, rating: any) => sum + (rating.rating || 0),
          0
        );
        const ratingCount = ratingsArray.length;
        const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

        return {
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          prices: item.prices,
          slug: item.slug,
          rating: averageRating,
          ratingCount,
          usernameRating: item.ratings.username,
          ratings: ratingsArray,
          Image:
            item.Image?.map((img: any) => ({
              id: img.id,
              documentId: img.documentId,
              name: img.name,
              url: img.url ? `http://localhost:1337${img.url}` : null,
              formats: img.formats
                ? {
                  thumbnail: {
                    name: img.formats.thumbnail.name,
                    url: img.formats.thumbnail.url
                      ? `http://localhost:1337${img.formats.thumbnail.url}`
                      : null,
                    width: img.formats.thumbnail.width,
                    height: img.formats.thumbnail.height,
                  },
                }
                : undefined,
            })) || [],
          name_category: item.name_category
            ? {
              id: item.name_category.id,
              documentId: item.name_category.documentId,
              name: item.name_category.name,
              slug: item.name_category.slug,
              children: item.name_category.children || [],
            }
            : null,
          product_images:
            item.product_images?.map((img: any) => ({
              id: img.id,
              documentId: img.documentId,
              color: img.color,
              img: productImagesMap.get(img.documentId)?.img || [],
            })) || [],
          inventory: item.inventories
            ? item.inventories.map((inv: { id: any; documentId: any; size: any; quantity: any }) => ({
              id: inv.id,
              documentId: inv.documentId,
              size: inv.size,
              quantity: inv.quantity,
            }))
            : [],
          product_detail: item.product_detail
            ? {
              id: item.product_detail.id,
              documentId: item.product_detail.documentId,
              description: item.product_detail.description,
              productStatus: item.product_detail.productStatus,
              createdAt: item.product_detail.createdAt,
              updatedAt: item.product_detail.updatedAt,
              publishedAt: item.product_detail.publishedAt,
              product: item,
              averageRating: averageRating,
            }
            : null,
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
      return rejectWithValue("Lỗi khi tải sản phẩm");
    }
  }
);

export const deleteProductByDocumentId = createAsyncThunk(
  "products/deleteByDocumentId",
  async (productDocumentId: string) => {
    try {
      console.log(`Deleting product with documentId: ${productDocumentId}`);

      // Lấy chi tiết sản phẩm theo documentId để lấy các documentId liên quan
      const productRes = await api.get(`/products?filters[documentId][$eq]=${productDocumentId}&populate=*`);
      const product = productRes.data?.data?.[0];

      if (!product) {
        throw new Error("Product not found");
      }

      const relatedDocumentIds = {
        product_detail: product?.product_detail?.documentId,
        product_sale: product?.product_sale?.documentId,
        inventories: product?.inventories?.map((inv: any) => inv?.documentId).filter(Boolean),
        ratings: product?.ratings?.map((rate: any) => rate?.documentId).filter(Boolean),
        product_images: product?.product_images?.map((img: any) => img?.documentId).filter(Boolean),
      };

      console.log(`Deleting from [product-details] using documentId: ${relatedDocumentIds.product_detail}`);
      if (relatedDocumentIds.product_detail) {
        await api.delete(`/product-details/${relatedDocumentIds.product_detail}`);
      }

      console.log(`Deleting from [product-sales] using documentId: ${relatedDocumentIds.product_sale}`);
      if (relatedDocumentIds.product_sale) {
        await api.delete(`/product-sales/${relatedDocumentIds.product_sale}`);
      }

      console.log(`Deleting from [inventories]`);
      for (const invId of relatedDocumentIds.inventories || []) {
        await api.delete(`/inventories/${invId}`);
      }

      console.log(`Deleting from [ratings]`);
      for (const ratingId of relatedDocumentIds.ratings || []) {
        await api.delete(`/ratings/${ratingId}`);
      }

      console.log(`Deleting from [product-images]`);
      for (const imgId of relatedDocumentIds.product_images || []) {
        await api.delete(`/product-images/${imgId}`);
      }

      console.log(`Deleting main product by ID: ${product.id}`);
      await api.delete(`/products/${product.documentId}`);

      console.log(`Đã xoá toàn bộ dữ liệu với documentId: ${productDocumentId}`);
      return product.id;

    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  }
);

export const addFullProduct = createAsyncThunk(
  "products/createProduct",
  async ({ 
    name, 
    prices, 
    description, 
    name_category, 
    product_images, 
    product_detail, 
    product_sale, 
    ratings, 
    slug, 
    carts, 
    inventories,
    imageFiles 
  }: {
    name: string;
    prices: number;
    description: string;
    name_category: string;
    product_images?: File[];
    product_detail?: string;
    product_sale?: string;
    ratings?: string[];
    slug: string;
    carts?: string[];
    inventories?: string[];
    imageFiles?: File[];
  }) => {
    let imageIds: number[] = [];

    if (imageFiles && imageFiles.length > 0) {
      const formData = new FormData();
      imageFiles.forEach((image) => formData.append("files", image));

      const uploadResponse = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      imageIds = uploadResponse.data.map((img: any) => img.id);
    }

    const payload = {
      data: {
        name,
        prices,
        description,
        slug,
        Image: imageIds.length ? imageIds : undefined,
        name_category,
        product_images: product_images ? product_images : [],
        product_detail,
        product_sale,
        ratings,
        carts,
        inventories,
      },
    };

    const response = await api.post("/products", payload);
    return response.data;
  }
);

export const updateFullProduct = createAsyncThunk(
  "products/updateProduct",
  async ({
    documentId,
    name,
    prices,
    description,
    name_category,
    product_images,
    product_detail,
    product_sale,
    ratings,
    slug,
    carts,
    inventories,
    imageFiles
  }: {
    documentId: string;
    name: string;
    prices: number;
    description: string;
    name_category: string;
    product_images?: File[];
    product_detail?: string;
    product_sale?: string;
    ratings?: string[];
    slug: string;
    carts?: string[];
    inventories?: string[];
    imageFiles?: File[];
  }) => {
    let imageIds: number[] = [];

    if (imageFiles && imageFiles.length > 0) {
      const formData = new FormData();
      imageFiles.forEach((image) => formData.append("files", image));

      const uploadResponse = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      imageIds = uploadResponse.data.map((img: any) => img.id);
    }

    const payload = {
      data: {
        name,
        prices,
        description,
        slug,
        Image: imageIds.length ? imageIds : undefined,
        name_category,
        product_images,
        product_detail,
        product_sale,
        ratings,
        carts,
        inventories,
      },
    };

    const response = await api.put(`/products/${documentId}`, payload);
    return response.data;
  }
);

export const fetchSortedProducts = createAsyncThunk(
  "products/fetchSortedProducts",
  async (
    sortType: "low_price" | "high_price" | "latest" | "best_selling" | "featured",
    { rejectWithValue }
  ) => {
    try {
      let sortQuery = "";
      let useClientSideSort = false;

      switch (sortType) {
        case "low_price":
          sortQuery = "prices:asc";
          break;
        case "high_price":
          sortQuery = "prices:desc";
          break;
        case "latest":
          sortQuery = "createdAt:desc";
          break;
        case "best_selling":
          // không sort từ server, xử lý client
          useClientSideSort = true;
          break;
        case "featured":
          sortQuery = "product_sale.percent_discount:desc";
          break;
      }

      const [productsResponse, imagesResponse, orderItemsResponse] = await Promise.all([
        api.get(`/products?populate=*&pagination[pageSize]=1000${sortQuery ? `&sort=${sortQuery}` : ""}`),
        api.get("/product-images?populate=*"),
        api.get("/order-items?pagination[pageSize]=1000"),
      ]);

      if (!productsResponse.data || !imagesResponse.data || !orderItemsResponse.data) {
        throw new Error("Invalid response data");
      }

      const productsData = productsResponse.data;
      const imagesData = imagesResponse.data;
      const orderItemsData = orderItemsResponse.data;

      // Map số lượng đã bán theo tên sản phẩm
      const soldMap = new Map<string, number>();
      orderItemsData.data.forEach((item: any) => {
        const name = item.name;
        const quantity = item.quantity || 0;
        soldMap.set(name, (soldMap.get(name) || 0) + quantity);
      });

      // Tạo map để gán hình ảnh theo documentId
      const productImagesMap = new Map<string, { img: { url: string | null }[] }>();
      imagesData.data.forEach((image: any) => {
        productImagesMap.set(image.documentId, {
          img: image.img?.length
            ? image.img.map((img: any) => ({
              url: img.url ? `http://localhost:1337${img.url}` : null,
            }))
            : [],
        });
      });

      let result = productsData.data.map((item: any) => {
        const ratingsArray = item.ratings || [];
        const totalRatings = ratingsArray.reduce(
          (sum: number, rating: any) => sum + (rating.rating || 0),
          0
        );
        const ratingCount = ratingsArray.length;
        const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

        return {
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          prices: item.prices,
          slug: item.slug,
          rating: averageRating,
          ratingCount,
          usernameRating: item.ratings?.username,
          ratings: ratingsArray,
          soldQuantity: soldMap.get(item.name) || 0,
          Image:
            item.Image?.map((img: any) => ({
              id: img.id,
              documentId: img.documentId,
              name: img.name,
              url: img.url ? `http://localhost:1337${img.url}` : null,
              formats: img.formats
                ? {
                  thumbnail: {
                    name: img.formats.thumbnail.name,
                    url: img.formats.thumbnail.url
                      ? `http://localhost:1337${img.formats.thumbnail.url}`
                      : null,
                    width: img.formats.thumbnail.width,
                    height: img.formats.thumbnail.height,
                  },
                }
                : undefined,
            })) || [],
          product_images:
            item.product_images?.map((img: any) => ({
              id: img.id,
              documentId: img.documentId,
              color: img.color,
              img: productImagesMap.get(img.documentId)?.img || [],
            })) || [],
          inventory: item.inventories
            ? item.inventories.map((inv: any) => ({
              id: inv.id,
              documentId: inv.documentId,
              size: inv.size,
              quantity: inv.quantity,
            }))
            : [],
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

      // Nếu là sort best_selling thì sort client-side theo soldQuantity giảm dần
      if (useClientSideSort) {
        result = result.sort((a: { soldQuantity: number; }, b: { soldQuantity: number; }) => b.soldQuantity - a.soldQuantity);
      }

      return result;
    } catch (error) {
      return rejectWithValue("Lỗi khi tải sản phẩm");
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFullProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFullProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Thêm sản phẩm vào state
      })
      .addCase(addFullProduct.rejected, (state,) => {
        state.loading = false;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.allProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProductByDocumentId.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.documentId !== action.payload
        );
      })
      .addCase(fetchSortedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSortedProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchSortedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;