import React, { useEffect, useRef, useState } from "react";
import { api } from "@/hooks/useAxios";
import { TypeDataNews } from "@/pages/news/typeNews";
import { RootState, useAppDispatch } from "@/store/store";
import { X } from "lucide-react";
import { notification } from "antd";
import { createNews, updateNews } from "@/store/news.slice";
import {Editor}  from "@tinymce/tinymce-react"; 
import { convertTinyMCEToStrapiJSON, StrapiBlock } from "./until";
import { useSelector } from "react-redux";
import { convertStrapiJSONToTinyMCE } from "./convertStrapiJSONToTinyMCE ";
import { current } from "@reduxjs/toolkit";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface TypeImg  {
  id: number;
  url: string;
};

interface TypeElement {
  element: HTMLElement |null,
  checkId: number,
}

const initialValue = {
  id: '',
  name: "",
  img:  [],
  description:  [],
  documentId: "",
  slug: "",
  introduction : ""
}

const CreatePostNews: React.FC<TypeElement> = ({element , checkId}) => {
  const editingPost = useSelector((state : RootState) => state.news.editingPost)
  const [currentNews, setCurrenNews] = useState<TypeDataNews>(initialValue);
  const listImg: TypeImg[] = Array.isArray(editingPost?.img)
  ? editingPost.img.map((item) => ({
    id: (item as TypeImg).id || 0,
    url: (item as TypeImg).url || "",
  }))
  : [];
  const [post, setPost] = useState<TypeDataNews>(initialValue);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [image, setImage] = useState<FileList | null>(null);
  const [api1, contextHolder] = notification.useNotification();
  const [editorContent, setEditorContent] = useState("");
  const dispatch = useAppDispatch();  
  const editorRef = useRef(null); 

  
  const description  = editingPost?.description
  console.log(description)
  useEffect(() => {
    if (Array.isArray(description) && description.every(item => typeof item === 'object')) {
      const htmlContent = convertStrapiJSONToTinyMCE(description as StrapiBlock[]);
      console.log(123)
      setEditorContent(htmlContent);
    }
  }, [description,checkId]);
 
  useEffect(() => {
    setPost(editingPost ? { ...editingPost } : initialValue);

    if (editingPost) {
      const arrImg: number[] = listImg.map((item) => item.id);
      setPost((prev) => ({
        ...prev,
        img: arrImg, 
      }));
      const url : string[] = listImg.map(item => item.url) 
      setPreviewUrls((pre) => ([
        ...pre,
        ...url
      ]));
    }
  }, [dispatch,editingPost,checkId]);

  useEffect(() => {
    if (!currentNews.id) { // Kiểm tra nếu currentNews chưa được gán giá trị
      setCurrenNews(post);
    }
  }, [post]);


  const handleEditorChange = (content: string) => {
    const jsonDescription = convertTinyMCEToStrapiJSON(content);
    setPost((prev) => ({ ...prev, description: jsonDescription })); 
  };

  const openNotificationUpdateImage = (type: NotificationType) => {
    api1[type]({
      message: 'Update Image successfully',
      duration: 1.5
    })
  };

  const openNotificationAddNews = (type: NotificationType ) => {
    api1[type]({
      message: 'Add news successfully',
      duration: 1.5
    })
  };

  const openNotificationUpdateNews = (type: NotificationType) => {
    const message = type === 'success'
      ? 'updated successfully!'
      : 'No modifications were found. Please update the content before saving.'; 
    api1[type]({
      message,
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
      const listImgId: number[] = [...(post.img as number[]), ...imgId];
      setPost((prev) => ({ ...prev, img: listImgId }));
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
    setImage(file);
    if (file) {
      const filesArray = Array.from(file); 
      // Tạo URL để xem trước ảnh
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(pre => [...pre,...urls])
    }
  };
  // Xử lý submit form
  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if(editingPost) {
          if(currentNews === post) {
            console.log('123')
            openNotificationUpdateNews('warning')
            return 
          }
          else {
            await dispatch(updateNews({
              id: editingPost.documentId,
              body: post
              })).unwrap()
              .then(() => {
                openNotificationUpdateNews('success')
              })
          }

      } else {
        await dispatch(createNews(post)).unwrap()
        .then(() => {
          openNotificationAddNews('success')
        })
      }
      
      if(element) {
        element.style.display = 'none'
      }
      

    } catch (error) {
      console.error('error', error)
    }
  };

  
  const handleCloseAddNews = () => {
    if(element) {
      element.style.display='none'
      setPreviewUrls([])
      setEditorContent('')
    }
  }

  


  return (
    <div className="overflow-auto  relative m-[auto]  max-w-2xl h-[770px] w-[100%] bg-white p-6 shadow-lg rounded-lg">
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
      <form onSubmit={handleSubmit}  className="space-y-4">
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
                    src={editingPost ? `http://localhost:1337${url}` : url}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded-lg border"
                    />
                </div>
                ))}
            </div>
            <button type="button" onClick={updateImg} className="text-[#fff] bg-[#2b7fff] py-[10px] px-[24px] rounded-[10px] cursor-pointer">Save</button>
          </>
        )}
        <div>
          <label className="block font-medium">Introduction</label>
          <textarea
            name="introduction"
            onChange={handleChange}
            value={post.introduction}
            rows={4}
            className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-blue-500"
            placeholder="Nhập giới thiệu bài viết"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium">Mô tả</label>
          <Editor
            apiKey="gmanld62a10sjioflew1n31uj2s53kqfjddiizzcwr7a0f7k"
            onInit={(e, editor) => editorRef.current = editor}
            onEditorChange={(e, editor) => handleEditorChange(editor.getContent())}
            initialValue={editorContent} 
            init={{ 
              height: 300,
              menubar: true,
              plugins: [
                
              ],
              toolbar:
                'undo redo | image | preview | casechange blocks | bold italic  | alignleft aligncenter alignright alignjustify  ',
                placeholder: "Start typing here...",
            }}
              
          />
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
        {editingPost ? 
          <div className="flex gap-5">
            <button
              type="submit"
              className="w-full  bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer transition"
            >
              Update
            </button>
            {/* <button
              type="reset"
              className="w-full bg-[#6B7280] text-white py-2 px-4 rounded-md transition cursor-pointer"
            >
              Reset
            </button> */}
          </div> 
        :
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Đăng bài
          </button>
        }
        
      </form>
    </div>
  );
};

export default CreatePostNews;
