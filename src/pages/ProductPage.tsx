import React from "react";
import Title from "@/components/product/Title";
import ProductList from "@/components/product/ProductList";

const ProductPage: React.FC = () => {

    return (
        <>
            <Title
                title="Sản phẩm"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Sản phẩm" }
                ]}
            />
            <ProductList />
        </>
    );
};

export default ProductPage;
