import { ShoppingCart, Star } from "lucide-react";
import AddProduct from "./AddProduct";
import { useState, useEffect } from "react";
import { fetchProducts } from "./service/ProductService";
import { Product } from "./types/ProductType";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sortOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Bán chạy", value: "best_selling" },
    { label: "Nổi bật", value: "featured" },
    { label: "Giá thấp", value: "low_price" },
    { label: "Giá cao", value: "high_price" },
];

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedImages, setSelectedImages] = useState<{ [key: number]: string }>({});
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    // console.log("Render Parent - cartDrawerOpen:", cartDrawerOpen);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
        setAllProducts(data);

        setSelectedImages(
            data.reduce((acc, product) => {
                acc[product.id] = product.Image.length > 0 ? product.Image[0].url : "";
                return acc;
            }, {} as { [key: number]: string })
        );
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleColorClick = (productId: number, imageUrl: string) => {
        setSelectedImages((prev) => ({
            ...prev,
            [productId]: imageUrl,
        }));
    };

    const handleCartClick = (product: Product) => {
        setSelectedProduct(product);
        setShowForm(true);
    };

    const handleCloseForm = () => setShowForm(false);

    const [selectedOption, setSelectedOption] = useState("best_selling");

    const handleOptionClick = (value: string) => {
        setSelectedOption(value);

        let sortedProducts = [...allProducts];

        if (value === "low_price") {
            sortedProducts.sort((a, b) => a.prices - b.prices); // Sắp xếp từ thấp đến cao
        } else if (value === "high_price") {
            sortedProducts.sort((a, b) => b.prices - a.prices); // Sắp xếp từ cao đến thấp
        }

        setProducts(sortedProducts);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center gap-4 px-5">
                <Label className="hidden sm:inline">Sắp xếp theo</Label>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    {sortOptions.map((option) => (
                        <Button
                            variant="sort"
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`${selectedOption === option.value ? "text-cyan-800 border-cyan-800" :
                                "border-transparent hover:text-cyan-800 hover:border-cyan-800"
                                }`}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <hr />

            <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden p-2 flex space-x-5 group hover:shadow-lg transition-shadow duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-3/4 flex flex-col space-y-2">
                                <div className="overflow-hidden rounded-md">

                                    {product?.product_sale?.percent_discount ? (
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={selectedImages[product.id]}
                                                alt={product.name}
                                                className="w-full h-64 object-cover rounded-md transform transition-transform duration-6000 group-hover:scale-150"
                                            />
                                            <div className="absolute top-2 left-[-30px] bg-orange-600 text-white px-8 py-1 text-sm font-bold rounded transform -rotate-45">
                                                -{product.product_sale.percent_discount}%
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={product?.Image?.length ? selectedImages[product.id] : "https://via.placeholder.com/300"}
                                            alt={product?.name}
                                            className="w-full h-64 object-cover rounded-md transform transition-transform duration-6000 group-hover:scale-150"
                                        />
                                    )}
                                </div>

                                <div className="flex space-x-2 justify-center h-16">
                                    {product.product_images?.map((image, index) => (
                                        <div key={index} className="flex space-x-2">
                                            {(Array.isArray(image.img) ? image.img : []).map((imgObj: any, imgIndex: number) => (
                                                imgObj.url && ( // Kiểm tra URL hợp lệ
                                                    <button
                                                        key={imgIndex}
                                                        className="w-16 h-full cursor-pointer"
                                                        onClick={() => handleColorClick(product.id, imgObj.url)}
                                                    >
                                                        <img
                                                            src={imgObj.url}
                                                            className="w-full h-full object-cover rounded-md border border-gray-300 hover:border-blue-500"
                                                            alt={`Color ${index} - Image ${imgIndex}`}
                                                        />
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <h2 className="mt-2 text-lg font-semibold h-12">{product.name}</h2>

                                {product?.product_sale?.percent_discount ? (
                                    <div className="flex space-x-2">
                                        {/* Giá gốc gạch ngang */}
                                        <p className="text-gray-500 line-through">
                                            {product.prices.toLocaleString()}đ
                                        </p>
                                        {/* Giá sau khi giảm */}
                                        <p className="text-red-500 text-base font-bold">
                                            {(
                                                product.prices -
                                                (product.prices * product.product_sale.percent_discount) / 100
                                            ).toLocaleString()}đ
                                        </p>
                                    </div>
                                ) : (
                                    /* Hiển thị giá gốc nếu không có giảm giá */
                                    <p className="text-red-500 text-base font-bold">
                                        {product?.prices.toLocaleString()}đ
                                    </p>
                                )}

                                <div className="flex items-center space-x-1 text-sm font-bold">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`text-sm ${i < Math.round(product.rating || 0) ? "text-yellow-500" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>

                            </div>

                            <div className="w-1/4 flex flex-col items-start text-sm font-medium space-y-2">
                                <p className="font-semibold">Tồn kho</p>
                                {product.id_shirt_pant ? (
                                    Object.entries(product.id_shirt_pant)
                                        .filter(([key]) => key !== "id" && key !== "documentId") // Bỏ qua id và documentId
                                        .map(([size, quantity]) => (
                                            <div key={size} className="flex justify-between w-full">
                                                <p>{size}</p>
                                                <p>{quantity}</p>
                                            </div>
                                        ))
                                ) : product.id_shoe ? (
                                    Object.entries(product.id_shoe)
                                        .filter(([key]) => key !== "id" && key !== "documentId") // Bỏ qua id và documentId
                                        .map(([size, quantity]) => (
                                            <div key={size} className="flex justify-between w-full">
                                                <p>{size}</p>
                                                <p>{quantity}</p>
                                            </div>
                                        ))
                                ) : (
                                    <p>Hết hàng</p>
                                )}
                                <div className="mt-auto">
                                    <Link to={`/product-detail/${product.documentId}`} className="w-32 text-center text-blue-500">
                                        Xem chi tiết
                                    </Link>
                                    <button
                                        className="relative mt-2 flex cursor-pointer items-center justify-center w-full bg-blue-700 text-white py-2 rounded-md border border-transparent overflow-hidden
                                            before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100
                                            hover:text-blue-700 hover:border-blue-700"
                                        onClick={() => handleCartClick(product)}
                                    >
                                        <span className="relative z-10 flex items-center">
                                            <ShoppingCart className="w-5 h-5 ml-2" />
                                        </span>
                                    </button>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {showForm && (
                    <>
                        <div className="fixed top-0 left-0 w-full p-10 bg-gray-800/50 h-full flex justify-center items-center z-50">
                            <div className="relative bg-white rounded-lg p-4">
                                <button
                                    onClick={handleCloseForm}
                                    className="absolute cursor-pointer top-2 right-2"
                                >
                                    ✖
                                </button>

                                {selectedProduct &&
                                    <AddProduct
                                        product={selectedProduct}
                                        onClose={() => setShowForm(false)}
                                        cartDrawerOpen={cartDrawerOpen}
                                        setCartDrawerOpen={setCartDrawerOpen}

                                    />}
                            </div>
                        </div>
                    </>

                )}
            </div >
        </>
    );
};

export default ProductList;