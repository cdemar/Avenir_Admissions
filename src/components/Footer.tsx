import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-gray-50 font-inter h-24 sm:h-24 flex items-center">
      <div
        className="container mx-auto flex flex-col sm:flex-row items-center justify-evenly
        sm:justify-between text-center px-6 sm:px-10 md:px-16 lg:px-8 gap-2 sm:gap-0"
      >
        <p className="text-sm sm:text-base">
          &copy; {currentYear} Avenir Admissions. All rights reserved.
        </p>

        <div className="flex space-x-8">
          <a
            href="https://www.linkedin.com/company/108702324/admin/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-300"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="text-xl sm:text-2xl" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61580620137446"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-300"
            aria-label="Facebook Profile"
          >
            <FaFacebook className="text-xl sm:text-2xl" />
          </a>
          <a
            href="https://www.pinterest.com/aidenkjeldsen/_profile/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-300"
            aria-label="Pinterest Profile"
          >
            <FaPinterest className="text-xl sm:text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/aveniradmissions/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors duration-300"
            aria-label="Instagram Profile"
          >
            <FaInstagram className="text-xl sm:text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
