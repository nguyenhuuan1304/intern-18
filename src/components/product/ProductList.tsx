import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchProducts, fetchSortedProducts } from "@/store/productSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "./types/ProductType";
import { Label } from "@radix-ui/react-label";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import CurrencyFormatter from "@/components/CurrencyFormatter";

const sortOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Bán chạy", value: "best_selling" },
    { label: "Nổi bật", value: "featured" },
    { label: "Giá thấp", value: "low_price" },
    { label: "Giá cao", value: "high_price" },
];

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [mainImages, setMainImages] = useState<{ [key: string]: string }>({});
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const { categorySlug } = useParams<{ categorySlug?: string }>();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        if (!categorySlug) return products;
        return products.filter((product) => product.slug === categorySlug);
    }, [products, categorySlug]);

    const handleCartClick = (product: Product) => {
        const imageUrl = mainImages[product.id] || (product.Image?.length ? product.Image[0].url : "");
        setSelectedProduct({ ...product, imageUrl });
        setShowForm(true);
    };

    const handleCloseForm = () => setShowForm(false);

    const handleOptionClick = (value: string) => {
        setSelectedOption(value);
        dispatch(fetchSortedProducts(value as "latest" | "best_selling" | "featured" | "low_price" | "high_price"));
        navigate(`/product?sort=${value}`);
    };

    const handleImageClick = (productId: string, newImageUrl: string) => {
        setMainImages((prev) => ({ ...prev, [productId]: newImageUrl }));
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
                {/* Ẩn label trên mobile */}
                <Label className="hidden sm:inline">Sắp xếp theo</Label>

                {/* Hiển thị icon khi màn hình nhỏ */}
                <div className="sm:hidden relative w-full flex justify-start">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex space-x-2 items-center">
                        <Filter className="m-2 w-6 h-6 text-cyan-800" />
                        <p>Sắp xếp theo</p>
                    </button>

                    {/* Dropdown menu hiển thị khi bấm vào icon */}
                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-8 bg-white border rounded shadow-lg w-40 z-50">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        handleOptionClick(option.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-300"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hiển thị nút sắp xếp khi màn hình lớn */}
                <div className="hidden sm:flex flex-wrap gap-2 sm:gap-4">
                    {sortOptions.map((option) => (
                        <Button
                            variant="sort"
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className={`${selectedOption === option.value
                                ? "text-cyan-800 border-cyan-800"
                                : "cursor-pointer border-transparent hover:text-cyan-800 hover:border-cyan-800"
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
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden p-2 flex space-x-5 group hover:shadow-lg transition-shadow duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-[70%] flex flex-col space-y-2">

                                <div className="relative overflow-hidden rounded-md">
                                    <img
                                        src={mainImages[product.id] || (product.Image?.length ? product.Image[0].url : "")}
                                        alt={product.name}
                                        className="w-full h-64 object-cover rounded-md transform transition-transform duration-6000 group-hover:scale-150"
                                    />
                                    {product?.product_sale?.percent_discount ? (
                                        <div className="absolute top-4 left-[-40px] bg-orange-600 text-white px-10 py-1 text-sm font-bold rounded transform -rotate-45">
                                            SALE -{product.product_sale.percent_discount}%
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex space-x-2 justify-center h-14">
                                    {product.product_images?.map((image, index) => (
                                        <div key={index} className="flex space-x-2">
                                            {image.img.map((imgObj, imgIndex) => (
                                                imgObj.url && (
                                                    <button
                                                        key={imgIndex}
                                                        className="w-14 h-full cursor-pointer"
                                                        onClick={() => handleImageClick(product.id.toString(), imgObj.url)}
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
                                        <p className="text-gray-500 line-through">
                                            <CurrencyFormatter amount={product?.prices} />
                                        </p>
                                        <p className="text-red-500 text-base font-bold">
                                            <CurrencyFormatter amount={product.prices - (product.prices * product.product_sale.percent_discount) / 100} />
                                        </p>

                                    </div>
                                ) : (
                                    <p className="text-red-500 text-base font-bold">
                                        <CurrencyFormatter amount={product?.prices} />
                                    </p>
                                )}

                                <div className="flex items-center space-x-1 text-sm font-bold">
                                    {[...Array(5)].map((_, i) => {
                                        const fullStars = Math.floor(product.rating);
                                        const hasHalfStar = product.rating % 1 !== 0 && i === fullStars;

                                        return hasHalfStar ? (
                                            <FaStarHalfAlt key={i} className="text-yellow-500 text-sm" />
                                        ) : i < fullStars ? (
                                            <FaStar key={i} className="text-yellow-500 text-sm" />
                                        ) : (
                                            <FaRegStar key={i} className="text-gray-300 text-sm" />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-[30%] flex flex-col items-start text-sm font-medium space-y-2">
                                <p className="font-semibold">Tồn kho</p>
                                {product.inventory && product.inventory.length > 0 ? (
                                    product.inventory.map((inventory) => (
                                        <div
                                            key={inventory.id}
                                            className={`flex justify-between w-full ${inventory.quantity === 0 ? "text-gray-400" : ""}`}
                                        >
                                            <p>{inventory.size}</p>
                                            <p>{inventory.quantity}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Hết hàng</p>
                                )}

                                <div className="mt-auto">
                                    <Link to={`/product-detail/${product.documentId}`} className="w-32 text-center text-blue-500">
                                        Xem chi tiết
                                    </Link>

                                    <button
                                        className={`relative mt-2 flex items-center justify-center w-full py-2 rounded-md border border-transparent 
                                        ${product.inventory?.every(inv => inv.quantity === 0)
                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                : "cursor-pointer bg-blue-700 text-white hover:text-blue-700 hover:border-blue-700 hover:bg-white transition-all"
                                            }`}
                                        onClick={product.inventory?.every(inv => inv.quantity === 0) ? undefined : () => handleCartClick(product)}
                                        disabled={product.inventory?.every(inv => inv.quantity === 0)}
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
                            <div className="relative bg-white rounded-lg p-2">
                                <button
                                    onClick={handleCloseForm}
                                    className="absolute cursor-pointer top-2 right-2 text-red-500 hover:text-red-600"
                                >
                                    <X />
                                </button>

                                {selectedProduct &&
                                    <AddProduct
                                        product={selectedProduct}
                                        onClose={() => setShowForm(false)}
                                        cartDrawerOpen={cartDrawerOpen}
                                        imageUrl={selectedProduct.imageUrl}
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

export default ProductList