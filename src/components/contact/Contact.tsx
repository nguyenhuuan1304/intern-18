import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.676104073145!2d106.635!3d10.762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752!2sKho%20Sỉ%20Thể%20Thao%20Lộc%20Sport!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
          width="100%"
          height="100%"
          allowFullScreen={false}
          loading="lazy"
          title="Kho Sỉ Thể Thao Lộc Sport"
        ></iframe>
      </div>
      <div className="w-full md:w-2/3 p-4 space-y-5">
        <h2 className="text-2xl text-cyan-800 font-bold mb-4">Thông tin liên hệ</h2>
        <p><strong>Địa chỉ:</strong> 12 Đại Lộ Khoa Học, Gềnh Ráng, Quy Nhơn</p>
        <p><strong>Điện thoại:</strong> 0985639992 - 0967454042</p>
        <p><strong>Email:</strong>interntip1batch18@gmail.com</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-800">Liên hệ với chúng tôi</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên của bạn</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email của bạn</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Điện thoại của bạn</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
