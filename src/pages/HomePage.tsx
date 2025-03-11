import React from "react";
import Layout from "@/components/layout/Layout";
import CategorySidebar from "@/components/sidebar/CategorySidebar";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <CategorySidebar />
          </div>

          <div className="flex-grow">{/* <ProductGrid /> */}</div>
        </div>
      </div>

    </Layout>
  );
};

export default HomePage;
