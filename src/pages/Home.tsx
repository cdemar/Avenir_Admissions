import { useEffect } from "react";
import SEO from "../components/SEO";
import HeroHome from "../sections/home/HeroHome";
import AboutUs from "../sections/home/AboutUs";
import Service from "../sections/home/Service";
import Testimonials from "../sections/home/Testimonials";
import Blog from "../sections/home/Blog";
import ContactUs from "../sections/home/ContactUs";

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Avenir Admissions",
  description: "Expert college admissions consulting",
  url: "https://aveniradmissions.com",
  telephone: "+17073479477",
  founder: {
    "@type": "Person",
    name: "Aiden Kjeldsen",
  },
  serviceType: "College Admissions Consulting",
  areaServed: "United States",
};

const Home = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "schema-local-business";
    script.textContent = JSON.stringify(LOCAL_BUSINESS_SCHEMA);
    document.head.appendChild(script);

    return () => {
      document.getElementById("schema-local-business")?.remove();
    };
  }, []);

  return (
    <>
      <SEO
        title="Avenir Admissions | Expert College Admissions Consulting"
        description="Expert, personalized college admissions consulting led by Aiden Kjeldsen, M.S.Ed., UCLA Certified College Counselor. Helping students get into their dream schools."
        url="/"
        type="website"
      />
      <HeroHome />
      <AboutUs />
      <Service />
      <Testimonials />
      <Blog />
      <ContactUs />
    </>
  );
};

export default Home;
