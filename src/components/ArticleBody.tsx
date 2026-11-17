import React from "react";
import { Theme } from "../types";

interface ArticleBodyProps {
  content: string;
  theme?: Theme;
}

/** Renders article text: blank-line paragraphs, ## / ### headings, ``` code. */
export const ArticleBody: React.FC<ArticleBodyProps> = ({
  content,
  theme = "light",
}) => {
  const isLight = theme === "light";

  return (
    <div className="prose max-w-none space-y-4 text-sm sm:text-base leading-relaxed">
      {content.split("\n\n").map((paragraph, index) => {
        if (paragraph.startsWith("## ")) {
          return (
            <h2
              key={index}
              className={`text-xl font-serif font-bold text-[#8C5E3C] pt-4 pb-1 border-b ${
                isLight ? "border-[#DCD5C9]" : "border-[#2C3325]"
              }`}
            >
              {paragraph.replace("## ", "")}
            </h2>
          );
        }
        if (paragraph.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-lg font-serif font-semibold text-[#2C2825] dark:text-[#8C5E3C] pt-3"
            >
              {paragraph.replace("### ", "")}
            </h3>
          );
        }
        if (paragraph.startsWith("```")) {
          const codeText = paragraph.replace(/```[a-z]*/g, "").trim();
          return (
            <div
              key={index}
              className={`shadow-soft my-4 p-4 rounded-xl font-mono text-xs overflow-x-auto border ${
                isLight
                  ? "bg-[#212521] text-[#A8C898] border-[#323832]"
                  : "bg-[#0B0C0B] text-[#A8C898] border-[#2C3325]"
              }`}
            >
              <pre>{codeText}</pre>
            </div>
          );
        }
        return (
          <p
            key={index}
            className={`whitespace-pre-wrap leading-relaxed ${isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"}`}
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
};
