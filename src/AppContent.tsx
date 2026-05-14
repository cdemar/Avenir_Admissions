import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/Blog";
import Home from "./pages/Home";

/**
 * The full route tree — no Router wrapper so it can be used with
 * BrowserRouter (client) or StaticRouter (SSR / pre-render).
 */
export function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
