import React from "react";
import Title from "@/components/product/Title";
import ProductDetailList from "@/components/productdetail/ProductDetail";
import Header from "@/components/header/Header";
import ServiceMenu from "@/components/ServiceMenu";
import Footer from "@/components/layout/Footer";
import { useMediaQuery } from "usehooks-ts";

const ProductDetailPage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <>
            <Header/>
            {!isMobile && <ServiceMenu />}
            <Title
                title="Chi tiết sản phẩm"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Sản phẩm", path: "/product" },
                    { label: "Chi tiết sản phẩm" },
                ]}
            />
            <ProductDetailList />
            <Footer/>
        </>
    );
};

export default ProductDetailPage;
