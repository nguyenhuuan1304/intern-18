import React from "react";
import Title from "@/components/product/Title";
import ProductList from "@/components/product/ProductList";
import Header from "@/components/header/Header";
import ServiceMenu from "@/components/ServiceMenu";
import Footer from "@/components/layout/Footer"

const ProductPage: React.FC = () => {

    return (
        <>
            <Header/>
            <ServiceMenu/>
            <Title
                title="Sản phẩm"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Sản phẩm" }
                ]}
            />
            <ProductList />
            <Footer/>
        </>
    );
};

export default ProductPage;
