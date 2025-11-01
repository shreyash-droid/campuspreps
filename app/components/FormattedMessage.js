"use client";

export default function FormattedMessage({ content, isUser = false }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap break-words">{content}</span>;
  }

  // Format AI response for better readability
  const formatAIResponse = (text) => {
    // Split into sections by double newlines
    const sections = text.split('\n\n').filter(s => s.trim());
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      
      // Check if it's a bullet list
      if (trimmedSection.includes('•') || /^[\-\*]\s/.test(trimmedSection)) {
        const listItems = trimmedSection.split('\n').filter(item => item.trim());
        return (
          <div key={index} className="my-3">
            <ul className="space-y-2">
              {listItems.map((item, itemIndex) => {
                const cleanItem = item.replace(/^[•\-*]\s*/, '').trim();
                if (cleanItem) {
                  return (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1 text-sm">•</span>
                      <span className="flex-1 leading-relaxed">{formatInlineText(cleanItem)}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        );
      }
      
      // Check if it's a numbered list
      if (/^\d+\./.test(trimmedSection)) {
        const listItems = trimmedSection.split('\n').filter(item => item.trim());
        return (
          <div key={index} className="my-3">
            <ol className="space-y-2">
              {listItems.map((item, itemIndex) => {
                const match = item.match(/^(\d+)\.\s*(.*)/);
                if (match) {
                  const [, number, cleanItem] = match;
                  return (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-600 font-semibold mr-3 mt-0.5 text-sm min-w-[1.5rem]">
                        {number}.
                      </span>
                      <span className="flex-1 leading-relaxed">{formatInlineText(cleanItem)}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ol>
          </div>
        );
      }
      
      // Check if it's a heading (starts with ** or is short and emphatic)
      if (trimmedSection.includes('**') && trimmedSection.length < 80) {
        const cleanTitle = trimmedSection.replace(/\*\*/g, '').trim();
        return (
          <h4 key={index} className="font-semibold text-gray-800 my-3 text-base border-l-4 border-blue-500 pl-3">
            {cleanTitle}
          </h4>
        );
      }
      
      // Check if it contains code (multiple backticks or programming terms)
      if (trimmedSection.includes('```') || (trimmedSection.includes('`') && trimmedSection.length > 20)) {
        return (
          <div key={index} className="my-3">
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm border border-gray-200">
              <code>{trimmedSection.replace(/```/g, '')}</code>
            </pre>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="my-3 leading-relaxed text-gray-800">
          {formatInlineText(trimmedSection)}
        </p>
      );
    });
  };

  // Format inline text (bold, code, etc.)
  const formatInlineText = (text) => {
    const parts = [];
    let currentIndex = 0;
    
    // Handle bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldMatch;
    
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (boldMatch.index > currentIndex) {
        parts.push(text.slice(currentIndex, boldMatch.index));
      }
      
      // Add the bold text
      parts.push(
        <strong key={`bold-${boldMatch.index}`} className="font-semibold text-gray-900">
          {boldMatch[1]}
        </strong>
      );
      
      currentIndex = boldMatch.index + boldMatch[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      let remainingText = text.slice(currentIndex);
      
      // Handle inline code `code`
      const codeRegex = /`(.*?)`/g;
      const codeParts = [];
      let codeIndex = 0;
      let codeMatch;
      
      while ((codeMatch = codeRegex.exec(remainingText)) !== null) {
        if (codeMatch.index > codeIndex) {
          codeParts.push(remainingText.slice(codeIndex, codeMatch.index));
        }
        
        codeParts.push(
          <code key={`code-${codeMatch.index}`} className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-800">
            {codeMatch[1]}
          </code>
        );
        
        codeIndex = codeMatch.index + codeMatch[0].length;
      }
      
      if (codeIndex < remainingText.length) {
        codeParts.push(remainingText.slice(codeIndex));
      }
      
      parts.push(...codeParts);
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="text-sm leading-relaxed">
      {formatAIResponse(content)}
    </div>
  );
}