export const  convertTinyMCEToStrapiJSON = (htmlContent) =>  {
    // Tạo một div tạm để phân tích cú pháp HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const result = [];
    
    // Duyệt qua các node con của div tạm
    Array.from(tempDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        
        // Xử lý heading (h1, h2, h3, ...)
        if (/^H[1-6]$/.test(element.tagName)) {
          const level = parseInt(element.tagName.substring(1));
          const textNode = {
            type: 'text',
            text: element.textContent,
            bold: element.querySelector('strong, b') !== null,
            italic: element.querySelector('em, i') !== null
          };
          
          result.push({
            type: 'heading',
            level: level,
            children: [textNode]
          });
        }
        // Xử lý đoạn văn (p)
        else if (element.tagName === 'P') {
          const children = processInlineElements(element);
          
          result.push({
            type: 'paragraph',
            children: children.length > 0 ? children : [{ type: 'text', text: '' }]
          });
        }
        // Xử lý danh sách không có thứ tự (ul)
        else if (element.tagName === 'UL') {
          const listItems = Array.from(element.children).map(li => {
            return {
              type: 'list-item',
              children: processInlineElements(li)
            };
          });
          
          result.push({
            type: 'list',
            format: 'unordered',
            children: listItems
          });
        }
        // Xử lý danh sách có thứ tự (ol)
        else if (element.tagName === 'OL') {
          const listItems = Array.from(element.children).map(li => {
            return {
              type: 'list-item',
              children: processInlineElements(li)
            };
          });
          
          result.push({
            type: 'list',
            format: 'ordered',
            children: listItems
          });
        }
        // Xử lý các element khác (có thể thêm tùy nhu cầu)
      }
    });
    
    return result;
  }
  
  // Hàm hỗ trợ xử lý các phần tử inline (text, bold, italic, ...)
  function processInlineElements(element) {
    const children = [];
    
    // Duyệt qua các node con của element
    element.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim() !== '') {
          children.push({
            type: 'text',
            text: child.textContent
          });
        }
      } 
      else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === 'STRONG' || child.tagName === 'B') {
          children.push({
            type: 'text',
            text: child.textContent,
            bold: true
          });
        } 
        else if (child.tagName === 'EM' || child.tagName === 'I') {
          children.push({
            type: 'text',
            text: child.textContent,
            italic: true
          });
        } 
        else if (child.tagName === 'SPAN') {
          // Xử lý các span có style (có thể mở rộng)
          const style = child.getAttribute('style') || '';
          const isBold = style.includes('font-weight:bold') || style.includes('font-weight:700');
          const isItalic = style.includes('font-style:italic');
          
          children.push({
            type: 'text',
            text: child.textContent,
            bold: isBold,
            italic: isItalic
          });
        } 
        else {
          // Đệ quy cho các phần tử lồng nhau
          children.push(...processInlineElements(child));
        }
      }
    });
    
    return children;
  }
  
  // Cách sử dụng:
  // const htmlContent = '<h1>XIN CHAO</h1><p><strong>sanpham1</strong></p>...';
  // const strapiJSON = convertTinyMCEToStrapiJSON(htmlContent);
  // console.log(strapiJSON);