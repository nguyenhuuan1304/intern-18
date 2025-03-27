import { StrapiBlock } from "@/components/createPostNews/until";

interface TypeDescription {
    type: "paragraph",
    children: [
    {
      type: "text",
      text: string
    }
    ]
  }

export interface TypeDataNews {
  name: string;
  img: typeImg[] | number[]  ; // Cho phép nhiều ảnh
  description: TypeDescription[] | string | StrapiBlock[];
  documentId: string,
  slug: string;
  introduction: string,
  is_block?: boolean
} 

interface typeImg  {
    url: string
}
