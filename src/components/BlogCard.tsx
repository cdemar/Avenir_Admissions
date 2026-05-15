import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import { readingTime } from "../utils";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/blog/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          width={600}
          height={192}
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">
            {post.title}
          </h3>
          <h3 className="text-xl font-semibold text-amber-500 mb-2">
            {post.subTitle}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {post.author} • {post.date} • {readingTime(post.content)} min read
          </p>
          <p className="text-gray-700">{post.excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
