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

export const fetchSortedProducts = createAsyncThunk(
  "products/fetchSortedProducts",
  async (
    sortType: "low_price" | "high_price" | "latest" | "best_selling" | "featured",
    { rejectWithValue }
  ) => {
    try {
      let sortQuery = "";
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
          sortQuery = "";
          break;
        case "featured":
          sortQuery = "";
          break;
        default:
          break;
      }

      const [productsResponse, imagesResponse] = await Promise.all([
        api.get(`/products?populate=*&sort=${sortQuery}`),
        api.get("/product-images?populate=*"),
      ]);

      if (!productsResponse.data || !imagesResponse.data) {
        throw new Error("Invalid response data");
      }

      const productsData = productsResponse.data;
      const imagesData = imagesResponse.data;

      // Tạo map để gán hình ảnh theo `documentId`
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
          usernameRating: item.ratings?.username,
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
