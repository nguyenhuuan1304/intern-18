import { StrapiBlock } from "@/components/createPostNews/until";
import {User} from "@/components/header/Header"

export interface TypeDescription {
    type: "paragraph",
    children: [
    {
      type: "text",
      text: string
    }
    ]
  }

export interface RatingNews {
  id: number,
  username: string,
  rating: number
}
interface TypeUserPermission {
  id: string,
  name:string
}

export interface TypeDataNews {
  name: string;
  img: typeImg[] | number[]  ; // Cho phép nhiều ảnh
  description: TypeDescription[] | string | StrapiBlock[];
  id: string,
  documentId: string,
  slug: string;
  introduction: string,
  is_block: boolean,
  rating_news: RatingNews[] | number[],
  views: number,
  users_permissions_users :  User[]  | number[] ,
  createdAt?: string 
} 

export interface typeImg  {
    url: string
}
