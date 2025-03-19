import React from "react";
import Title from "@/components/product/Title";
import ProductDetailList from "@/components/productdetail/ProductDetail";
import Header from "@/components/header/Header";
import ServiceMenu from "@/components/ServiceMenu";
import Footer from "@/components/layout/Footer";
import ProductSale from "@/components/product/SaleSession";

const ProductDetailPage: React.FC = () => {

    return (
        <>
            <Header/>
            <ServiceMenu/>
            <Title
                title="Chi tiết sản phẩm"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Sản phẩm", path: "/product" },
                    { label: "Chi tiết sản phẩm" },
                ]}
            />
            <ProductDetailList />
            <ProductSale/>
            <Footer/>
        </>
    );
};

export default ProductDetailPage;
