import SEO from "../components/SEO";
import ContactUs from "../sections/home/ContactUs";

const Contact = () => {
  return (
    <div className="pt-28">
      <SEO
        title="Contact Us | Avenir Admissions"
        description="Get in touch with Avenir Admissions. Book a free consultation or send us a message — we'd love to hear from you."
        url="/contact"
      />
      <ContactUs />
    </div>
  );
};

export default Contact;
