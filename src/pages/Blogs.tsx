import { blogData } from "../data/blogData";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";

const Blogs = () => {
  const sortedPosts = blogData.slice().reverse();

  return (
    <div className="pt-32 pb-16">
      <SEO
        title="The College Corner Blog | Avenir Admissions"
        description="Your complete guide to college admissions, essays, and everything in between. Expert advice from Aiden Kjeldsen, UCLA Certified College Counselor."
        url="/blogs"
        type="website"
      />

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-blue-900 font-bold text-5xl mb-4">
            The College Corner Blog
          </h1>
          <p className="text-xl text-gray-600">
            Your complete guide to admissions, essays, and everything in
            between.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
