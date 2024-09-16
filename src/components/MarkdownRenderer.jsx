import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const MarkdownRenderer = ({ markdownText }) => {
  // Convert Markdown to HTML and sanitize it
  const getSanitizedHtml = () => {
    const rawHtml = marked(markdownText || "");
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={getSanitizedHtml()}
    />
  );
};

export default MarkdownRenderer;
