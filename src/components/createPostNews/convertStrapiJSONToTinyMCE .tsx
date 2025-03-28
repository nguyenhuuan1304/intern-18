export const convertStrapiJSONToTinyMCE = (strapiBlocks: StrapiBlock[]): string => {
    return strapiBlocks
      .map((block) => {
        if (block.type === "heading") {
          return `<h${block.level}>${processInlineNodes(block.children)}</h${block.level}>`;
        }
        if (block.type === "paragraph") {
          return `<p>${processInlineNodes(block.children)}</p>`;
        }
        if (block.type === "list") {
          const listTag = block.format === "ordered" ? "ol" : "ul";
          const listItems = block.children
            .map((item) => `<li>${processInlineNodes(item.children)}</li>`)
            .join("");
          return `<${listTag}>${listItems}</${listTag}>`;
        }
        return "";
      })
      .join(""); // Kết hợp tất cả HTML lại
  };
  
  // Xử lý `TextNode` và `LinkNode`
  const processInlineNodes = (nodes: Array<TextNode | LinkNode>): string => {
    return nodes
      .map((node) => {
        if (node.type === "text") {
          let text = node.text;
          if (node.bold) text = `<strong>${text}</strong>`;
          if (node.italic) text = `<em>${text}</em>`;
          return text;
        }
        if (node.type === "link") {
          return `<a href="${node.url}">${processInlineNodes(node.children)}</a>`;
        }
        return "";
      })
      .join("");
  };
  

