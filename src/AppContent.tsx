import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/Blog";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

/**
 * The full route tree — no Router wrapper so it can be used with
 * BrowserRouter (client) or StaticRouter (SSR / pre-render).
 */
export function AppContent() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-blue-900 focus:font-semibold focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
      <Footer />
    </>
  );
}
