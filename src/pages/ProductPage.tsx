import React from "react";
import Title from "@/components/product/Title";
import ProductList from "@/components/product/ProductList";
import Header from "@/components/header/Header";
import ServiceMenu from "@/components/ServiceMenu";
import Footer from "@/components/layout/Footer";
import { useMediaQuery } from "usehooks-ts";

const ProductPage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <>
            <Header />
            {!isMobile && <ServiceMenu />}
            <Title
                title="Sản phẩm"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Sản phẩm" }
                ]}
            />
            <ProductList />
            <Footer />
        </>
    );
};

export default ProductPage;
