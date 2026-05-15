import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenuLine, RiCloseFill } from "react-icons/ri";

const navLinks = [
  { to: "/#hero", id: "hero", label: "Home" },
  { to: "/#about", id: "about", label: "About" },
  { to: "/#service", id: "service", label: "Services" },
  { to: "/#blog", id: "blog", label: "Blog" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("hero");
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const navbarHeight = 100;

      if (currentScrollY < navbarHeight) {
        setShowNavbar(true);
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  useEffect(() => {
    const { hash } = location;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const { pathname } = location;

    if (pathname.startsWith("/blogs") || pathname.startsWith("/blog/")) {
      setActiveLink("blog");
    } else {
      const observerOptions = {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      }, observerOptions);

      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => observer.observe(section));

      return () => sections.forEach((section) => observer.unobserve(section));
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-blue-900 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-28 px-6">
        <Link to="/#hero" className="md:text-2xl font-bold tracking-wide">
          <img
            src="/logo.jpg"
            className="h-24 w-auto rounded-xl"
            alt="Avenir Admissions Logo"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              onClick={handleLinkClick}
              className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
                activeLink === link.id
                  ? "bg-blue-800 text-white"
                  : "text-gray-50 hover:text-gray-300 hover:bg-blue-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/#contact" className="btn hidden lg:block">
          Contact Us
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-gray-50 text-3xl focus:outline-none"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <RiCloseFill /> : <RiMenuLine />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-blue-800 py-4 mt-2 rounded-lg shadow-xl">
          <div className="container mx-auto px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                onClick={handleLinkClick}
                className={`block py-2 text-center font-semibold rounded-lg ${
                  activeLink === link.id
                    ? "bg-blue-700 text-gray-50"
                    : "text-gray-50 hover:text-gray-300 hover:bg-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={handleLinkClick}
              className="btn w-full text-center block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
