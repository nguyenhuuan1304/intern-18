import React, { useEffect, useRef, useState,memo } from "react";
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
  rating_news: [],
  documentId: "",
  slug: "",
  introduction : "",
  views: 0,
  is_block: false,
  users_permissions_users : []

}

const CreatePostNews: React.FC<TypeElement> = ({element , checkId}) => {
  const editingPost = useSelector((state : RootState) => state.news.editingPost)
  const [currentNews, setCurrenNews] = useState<TypeDataNews>(initialValue);
  const [img,setImg] = useState<TypeImg[]>([])
  

  const [post, setPost] = useState<TypeDataNews>(initialValue);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [image, setImage] = useState<FileList | null>(null);
  const [api1, contextHolder] = notification.useNotification();
  const [editorContent, setEditorContent] = useState("");
  const dispatch = useAppDispatch();  
  const editorRef = useRef(null); 
  const inputImgRef = useRef<HTMLInputElement | null>(null);
  // console.log(listImg)
  // console.log(previewUrls)
  const description  = editingPost?.description
  useEffect(() => {
    if (Array.isArray(description) && description.every(item => typeof item === 'object')) {
      const htmlContent = convertStrapiJSONToTinyMCE(description as StrapiBlock[]);
      setEditorContent(htmlContent);
    }
  }, [description,checkId]);
 
  useEffect(() => {
    setPost(editingPost ? { ...editingPost } : initialValue);

    if (editingPost) {
      const listImg: TypeImg[] = Array.isArray(editingPost?.img)
      ? editingPost.img.map((item) => ({
        id: (item as TypeImg).id || 0,
        url: (item as TypeImg).url || "",
      }))
      : [];
      const arrImg: number[] = listImg.map((item) => item.id);
      const url : string[] = listImg.map(item => item.url) 
      setPost((prev) => ({
        ...prev,
        img: arrImg, 
      }));
      setPreviewUrls((pre) => ([
        // ...pre,
        ...url
      ]));
      setImg(listImg)
    }
  }, [dispatch,editingPost,checkId]);

  useEffect(() => {
    if (!currentNews.id) { // Kiểm tra nếu currentNews chưa được gán giá trị
      setCurrenNews(post);
    }
  }, [post]);
  console.log(previewUrls)

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
    if (!image ) {
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
    const files = e.target.files;
    if (files) {
      const newFilesArray = Array.from(files);
      
      const updatedFiles = image ? [...Array.from(image), ...newFilesArray] : newFilesArray;
      
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      
      setImage(dataTransfer.files);
  
      const urls = newFilesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(pre => [...pre, ...urls]);
  
      // Reset input để có thể chọn lại cùng ảnh
      if (inputImgRef.current) {
        inputImgRef.current.value = '';
      }
    }
  };
  
  // Xử lý submit form
  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if(editingPost) {
          if(currentNews === post) {
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
                setPreviewUrls([])
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

  const handleDeleteImage = (index: number) => {
    const newUrls = [...previewUrls];
    const [imgIndex] =newUrls.splice(index, 1);
    console.log(imgIndex)
    const a = img.findIndex(item => item.url === imgIndex)
    console.log(a)
    console.log('321')
    if(a !== -1) {
      img.splice(a,1)
      console.log(img)
      const arrImg: number[] = img.map((item) => item.id);
      console.log(arrImg)
      setPost((prev) => ({
        ...prev,
        img: arrImg, 
      }));
    }
    setPreviewUrls(newUrls);
    
    if (inputImgRef.current) { //Reset input để lần sau chọn lại cùng file vẫn được
      inputImgRef.current.value = '';
    }
  };

  console.log(post)


  return (
    <div className="overflow-auto h-screen relative m-[auto]  max-w-2xl w-[100%] bg-white p-6 shadow-lg rounded-lg">
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
            ref={inputImgRef}
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
                <div key={index} className="relative w-full h-24 group hover:cursor-pointer">
                    <img
                    src={url.startsWith("blob:") ? url : `http://localhost:1337${url}`}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-[50%] opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity duration-200 z-10"
                    >
                      ✕
                  </button>   
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
            apiKey="mdpwvf2xo8mjc5i0ei4o6glu02bwomsrc4n62dwjykxvlwf0"
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

export default memo(CreatePostNews);
