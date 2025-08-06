import React from "react";

const RelatedArticles = ({ news }) => {
  if (!news || news.length === 0) return null;

  return (
    <div className="border">
      <h2 className="font-bold text-xl mb-2">What We Know So Far</h2>
      <h4 className="text-lg font-semibold mb-2">Related Articles</h4>

      {news.map((related, index) => (
        <div key={related.newsId || related.url || index} className="mb-2">
          <a
            href={related.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {related.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default RelatedArticles;
