import Header from '@/components/header/Header';
import ContactPage from '@/components/contact/Contact';
import Title from '@/components/product/Title';
import Footer from "@/components/layout/Footer";
import ServiceMenu from '@/components/ServiceMenu';

const Contact = () => {
  return (
    <div>
        <Header/>
        <ServiceMenu />
        <Title
                title="Liên hệ"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Liên hệ" }
                ]}
            />
        <ContactPage/>
        <Footer/>
    </div>
  )
}

export default Contact