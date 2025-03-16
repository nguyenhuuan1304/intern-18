import React from "react";
import Layout from "@/components/layout/Layout";
import CategorySidebar from "@/components/sidebar/CategorySidebar";
import ServiceMenu from "@/components/ServiceMenu";
import SliderProduct from "@/components/SliderProduct";
import FeatureSection from "@/components/FeatureSection";
import Header from "@/components/header/Header";
const HomePage: React.FC = () => {
  return (
    <Layout>
      <Header/>
      <div className="mx-7 py-8 flex flex-col justify-centen items-center">
        <div className="hidden md:block">
          <ServiceMenu />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="w-full ml-5 md:w-64 flex-shrink-0 ">
            <CategorySidebar />
          </div>
          <div className="flex-grow ">
            <SliderProduct />
          </div>
        </div>
        <div className="mt-3">
          <FeatureSection />
        </div>
        <div className="mt-3">
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
