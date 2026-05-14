import { Link } from "react-router-dom";
import Title from "./Title";

const NotFoundPage = () => {
  return (
    <div className="bg-cyan-800 text-slate-300 h-screen overflow-hidden flex items-center justify-center font-inter">
      <Title title="Page Not Found" />

      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-extrabold text-orange-500 mb-4">
            404
          </h1>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Oops! Page Not Found.
          </h2>

          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-8">
            The page you&apos;re looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <Link
            to="/"
            className="inline-block btn font-semibold text-lg transition-all duration-300 ease-in-out hover:scale-105"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
