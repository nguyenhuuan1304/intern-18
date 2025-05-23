import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import { RootState, AppDispatch } from "@/store/store";
import CurrencyFormatter from "@/components/CurrencyFormatter";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SaleSession: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.products.products);
    const loading = useSelector((state: RootState) => state.products.loading);
    const [index, setIndex] = useState(0);

    const saleProducts = products.filter(
        (product) => product.product_sale && product.product_sale.percent_discount !== undefined && product.product_sale.percent_discount > 0
    );

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        if (saleProducts.length > 0) {
            const interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % saleProducts.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [saleProducts]);

    const currentProduct = saleProducts.length > 0 ? saleProducts[index] : null;

    return (
        <div className="border-t mt-4">
            <motion.div
                className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <h2 className="text-lg md:text-xl font-semibold text-cyan-800 mb-4">
                    Sản phẩm đang sale
                </h2>
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải...</p>
                ) : (
                    <div className="relative w-full max-w-lg mx-auto">
                        {currentProduct ? (
                            <>
                                <div className="relative w-full h-96 overflow-hidden rounded-lg">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentProduct.id} 
                                            src={currentProduct.Image[0]?.url}
                                            alt={currentProduct.name}
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </AnimatePresence>
                                    <div className="absolute top-4 left-[-40px] bg-orange-600 text-white px-10 py-1 text-sm font-bold rounded transform -rotate-45">
                                        SALE -{currentProduct.product_sale?.percent_discount}%
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {currentProduct.name}
                                    </h3>
                                    <p className="text-gray-500 line-through">
                                        <CurrencyFormatter amount={currentProduct.prices}/>
                                    </p>
                                    <p className="text-red-500 text-base font-bold">
                                        <CurrencyFormatter amount={currentProduct.prices - (currentProduct.prices * (currentProduct.product_sale?.percent_discount ?? 0)) / 100}/>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center">
                                Hiện chưa có sản phẩm nào đang giảm giá.
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SaleSession;