import { Link } from "react-router-dom";
import { blogData } from "../../data/blogData";
import BlogCard from "../../components/BlogCard";

const BlogSection = () => {
  const recentPosts = blogData.slice().reverse().slice(0, 2);

  return (
    <section id="blog" className="py-16 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-44">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-blue-900 font-bold text-4xl md:text-5xl mb-4">
            From Our Blog
          </h2>
          <p className="text-lg text-gray-600">
            Get the latest advice and insights on navigating the college
            admissions process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/blogs"
            className="inline-block bg-amber-400 text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
