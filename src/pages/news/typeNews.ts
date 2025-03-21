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
  description: TypeDescription[] | string;
  documentId: string
  slug: string;
} 

interface typeImg  {
    url: string
}
