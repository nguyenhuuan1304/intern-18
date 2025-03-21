import axios from "axios";
import { Category } from "../product/types/ProductType";

interface CategoryResponse {
  data: Category[];
}

const categoryApi = {
  getAllCategories: async (): Promise<CategoryResponse> => {
    const response = await axios.get<CategoryResponse>(
     "http://localhost:1337/api/categories?populate=children&pagination[limit]=3000"
    );
    return response.data;
  },
};

export default categoryApi;
