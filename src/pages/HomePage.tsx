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
      <div className="fixed md:relative top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="hidden md:block ">
        <ServiceMenu />
      </div>
      <div className="mx-7 py-8 flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="w-full ml-5 md:w-64 flex-shrink-0 hidden md:block">
            <CategorySidebar />
          </div>
          <div className="flex-grow  ">
            <SliderProduct />
          </div>
        </div>

        <div className="mt-3">
          <FeatureSection />
        </div>

        <div className="mt-3"></div>
      </div>
    </Layout>
  );
};

export default HomePage;
