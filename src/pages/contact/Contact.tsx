import Header from '@/components/header/Header'
import ContactPage from '@/components/contact/Contact'
import Title from '@/components/product/Title'

const Contact = () => {
  return (
    <div>
        <Header/>
        <Title
                title="Liên hệ"
                breadcrumb={[
                    { label: "Trang chủ", path: "/" },
                    { label: "Liên hệ" }
                ]}
            />
        <ContactPage/>
    </div>
  )
}

export default Contact