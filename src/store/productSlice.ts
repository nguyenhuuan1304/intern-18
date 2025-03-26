import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    sortProducts(state, action: PayloadAction<string>) {
      const value = action.payload;
      let sortedProducts = [...state.allProducts];

      if (value === "low_price") {
        sortedProducts.sort((a, b) => a.prices - b.prices);
      } else if (value === "high_price") {
        sortedProducts.sort((a, b) => b.prices - a.prices);
      }

      state.products = sortedProducts;
    },
  },
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
      });
  },
});

export const { sortProducts } = productSlice.actions;
export default productSlice.reducer;
