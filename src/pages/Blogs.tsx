import { useState } from "react";
import { blogData } from "../data/blogData";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";

const POSTS_PER_PAGE = 6;

const Blogs = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const sortedPosts = blogData.slice().reverse();

  const filtered = query.trim()
    ? sortedPosts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
        );
      })
    : sortedPosts;

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="pt-32 pb-16">
      <SEO
        title="The College Corner Blog | Avenir Admissions"
        description="Your complete guide to college admissions, essays, and everything in between. Expert advice from Aiden Kjeldsen, UCLA Certified College Counselor."
        url="/blogs"
        type="website"
      />

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-blue-900 font-bold text-5xl mb-4">
            The College Corner Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your complete guide to admissions, essays, and everything in between.
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="search"
              value={query}
              onChange={handleSearch}
              placeholder="Search posts..."
              aria-label="Search blog posts"
              className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-800"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
        </div>

        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg py-16">
            No posts match &ldquo;{query}&rdquo;.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-md font-semibold ${
                  n === page
                    ? "bg-blue-900 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
