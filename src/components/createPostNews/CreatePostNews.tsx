import React, { ReactNode, useRef, useState } from "react";
import { api } from "@/hooks/useAxios";
import { TypeDataNews } from "@/pages/news/typeNews";
import { useAppDispatch } from "@/store/store";
import { createNews } from "@/store/news.slice"; 
import { X } from "lucide-react";
import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface TypeImg  {
  id: number;
  url: string;
};

interface TypeElement {
  element: HTMLElement | null
}

const CreatePostNews: React.FC<TypeElement> = ({element}) => {
  const [post, setPost] = useState<TypeDataNews>({
    name: "",
    img:  [],
    description:  [],
    documentId: "",
    slug: "",
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [image, setImage] = useState<FileList | null>(null);
  const [api1, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();

  const openNotificationUpdateImage = (type: NotificationType) => {
    api1[type]({
      message: 'Update Image success',
      duration: 1.5
    })
  };

  const openNotificationAddNews = (type: NotificationType) => {
    api1[type]({
      message: 'Add news success',
      duration: 1.5
    })
  };


  const updateImg = async () => {
    if (!image) {
        alert("Vui lòng chọn một ảnh!");
        return;
    }
    
    const formData = new FormData()
    for (let i = 0; i < image.length; i++) {
      formData.append("files", image[i]); 
    }
    const response = await api.post("upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    if(response) {
      console.log(response.data)
      const arrImg :TypeImg[] = Array.from(response.data)
      const imgId : number[]  = arrImg.map((item )  => item.id)
      console.log(imgId)
      setPost((prev) => ({ ...prev, img: imgId }));
      openNotificationUpdateImage('success')
    }
  }

  // Xử lý thay đổi input, text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý upload nhiều ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    console.log(file)   
    setImage(file);
    if (file) {
      const filesArray = Array.from(file); // Chuyển FileList thành mảng
      // Tạo URL để xem trước ảnh
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  // Xử lý submit form
  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(post)
    try {
      const response = await dispatch(createNews(post))
      if(response) {
        if(element) {
          element.style.display='none'
        }
        openNotificationAddNews('success')
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      alert("Tạo bài viết thất bại! Vui lòng thử lại.");
    }
  };

  
  const handleCloseAddNews = () => {
    if(element) {
      element.style.display='none'
    }
  }

  return (
    <div className=" relative m-[auto] lg:top-[10%] max-w-2xl  w-[100%] bg-white p-6 shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Tạo bài viết mới</h2>
      <div className="absolute top-[4px] right-[12px] ">
        <button 
          className="cursor-pointer p-[10px] text-[#fff] bg-[#2b7fff] hover:bg-blue-600 rounded-[4px]"
          onClick={handleCloseAddNews}
        >
          <X/>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên bài viết</label>
          <input
            type="text"
            name="name"
            value={post.name}
            onChange={handleChange}
            className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-blue-500"
            placeholder="Nhập tên bài viết"
          />
        </div>

        <div>
          <label className="block font-medium">Chọn ảnh</label>
          <input
            type="file"
            accept="image/*"
            multiple // Cho phép chọn nhiều ảnh
            onChange={handleImageUpload}
            className="mt-2 w-full cursor-pointer border rounded-md px-3 py-2"
          />
        </div>

        {previewUrls.length > 0 && (
            <>
            <div className="mt-4 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                <div key={index} className="relative w-full h-24">
                    <img
                    src={url}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded-lg border"
                    />
                </div>
                ))}
            </div>
            <button type="button" onClick={updateImg} className="text-[#fff] bg-[#2b7fff] py-[10px] px-[24px] rounded-[10px] cursor-pointer">Save</button>
            </>
        )}

        {/* Mô tả */}
        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            name="description"
            onChange={handleChange}
            rows={4}
            className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-blue-500"
            placeholder="Nhập mô tả bài viết"
          />
          {/* <div className="custom-editor" onClick={focus}> 
           <Editor     
                // ref={editorRef}            
                editorState={editorState}
                onChange={setEditorState}
            />
            </div> */}
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            value={post.slug}
            onChange={handleChange}
            className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-blue-500"
            placeholder="slug-bai-viet"
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
};

export default CreatePostNews;
