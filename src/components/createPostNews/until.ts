interface TextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
}

interface HeadingNode {
  type: 'heading';
  level: number;
  children: TextNode[];
}

interface ParagraphNode {
  type: 'paragraph';
  children: Array<TextNode | LinkNode>;
}

interface ListNode {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: ListItemNode[];
}

interface ListItemNode {
  type: 'list-item';
  children: Array<TextNode | LinkNode>;
}

interface LinkNode {
  type: 'link';
  url: string;
  children: TextNode[];
}

export type StrapiBlock = HeadingNode | ParagraphNode | ListNode;

export const convertTinyMCEToStrapiJSON = (htmlContent: string): StrapiBlock[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const result: StrapiBlock[] = [];
  
  // Process child nodes
  Array.from(tempDiv.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      if (/^H[1-6]$/.test(element.tagName)) {
        const level = parseInt(element.tagName.substring(1));
        const textNode: TextNode = {
          type: 'text',
          text: element.textContent || '',
          bold: element.querySelector('strong, b') !== null,
          italic: element.querySelector('em, i') !== null
        };
        
        result.push({
          type: 'heading',
          level: level,
          children: [textNode]
        });
      }
      else if (element.tagName === 'P') {
        const children = processInlineElements(element);
        
        result.push({
          type: 'paragraph',
          children: children.length > 0 ? children : [{ type: 'text', text: '' }]
        });
      }
      else if (element.tagName === 'UL') {
        const listItems = Array.from(element.children).map((li): ListItemNode => {
          const listItemElement = li as HTMLElement;
          return {
            type: 'list-item',
            children: processInlineElements(listItemElement)
          };
        });
        
        result.push({
          type: 'list',
          format: 'unordered',
          children: listItems
        });
      }
      else if (element.tagName === 'OL') {
        const listItems = Array.from(element.children).map((li): ListItemNode => {
          return {
            type: 'list-item',
            children: processInlineElements(li as HTMLElement)
          };
        });
        
        result.push({
          type: 'list',
          format: 'ordered',
          children: listItems
        });
      }
    }
  });
  
  return result;
}

function processInlineElements(element: HTMLElement): Array<TextNode | LinkNode> {
  const children: Array<TextNode | LinkNode> = [];
  
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const textContent = child.textContent?.trim();
      if (textContent && textContent !== '') {
        children.push({
          type: 'text',
          text: textContent
        });
      }
    } 
    else if (child.nodeType === Node.ELEMENT_NODE) {
      const childElement = child as HTMLElement;
      
      if (childElement.tagName === 'STRONG' || childElement.tagName === 'B') {
        children.push({
          type: 'text',
          text: childElement.textContent || '',
          bold: true
        });
      } 
      else if (childElement.tagName === 'EM' || childElement.tagName === 'I') {
        children.push({
          type: 'text',
          text: childElement.textContent || '',
          italic: true
        });
      }
      else if (childElement.tagName === 'A') {
        children.push({
          type: 'link',
          url: childElement.getAttribute('href') || '#',
          children: processInlineElements(childElement) as TextNode[]
        });
      }
      else if (childElement.tagName === 'SPAN') {
        const style = childElement.getAttribute('style') || '';
        const isBold = style.includes('font-weight:bold') || style.includes('font-weight:700');
        const isItalic = style.includes('font-style:italic');
        
        children.push({
          type: 'text',
          text: childElement.textContent || '',
          bold: isBold,
          italic: isItalic
        });
      } 
      else {
        // Recursive processing for nested elements
        children.push(...processInlineElements(childElement));
      }
    }
  });
  
  return children;
}