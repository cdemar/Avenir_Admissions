import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { blogData } from "../data/blogData";
import SEO from "../components/SEO";
import type { BlogPost } from "../types";
import { BASE_URL } from "../config";
import { readingTime } from "../utils";
import BlogCard from "../components/BlogCard";

const sanitize = (html: string) =>
  typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;

/**
 * Attempts to convert a human-readable date like "June 18th, 2025"
 * to ISO 8601 format ("2025-06-18") for Schema.org compatibility.
 * Falls back to the original string if parsing fails.
 */
function toIsoDate(dateStr: string): string {
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return dateStr;
}

function buildArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image}`,
    datePublished: toIsoDate(post.date),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Avenir Admissions",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.jpg`,
      },
    },
    url: `${BASE_URL}/blog/${post.slug}`,
  };
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogData.find((p) => p.slug === slug);
  const related = blogData.filter((p) => p.slug !== slug).slice(-3).reverse();

  useEffect(() => {
    if (!post) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "schema-article";
    script.textContent = JSON.stringify(buildArticleSchema(post));
    document.head.appendChild(script);

    return () => {
      document.getElementById("schema-article")?.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="text-center pt-48 pb-20">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-500 mb-6">
          This post doesn&apos;t exist or may have been moved.
        </p>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          &larr; Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-16">
      <SEO
        title={`${post.title} | Avenir Admissions`}
        description={post.excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
          loading="eager"
          width={896}
          height={384}
        />
        <h1 className="text-blue-900 font-bold text-4xl md:text-5xl mb-4">
          {post.title}
        </h1>
        <h2 className="text-amber-500 font-semibold text-xl md:text-2xl mb-4">
          {post.subTitle}
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          {post.author} • {post.date} • {readingTime(post.content)} min read
        </p>

        <div className="prose lg:prose-xl max-w-none">
          <div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
        </div>

        <div className="mt-12">
          <Link to="/blogs" className="text-blue-600 hover:underline">
            &larr; Back to all posts
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl mt-16">
        <h2 className="text-blue-900 font-bold text-3xl mb-8">More Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
