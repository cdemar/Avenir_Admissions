import Cta from "../../components/Cta";
import { CAL_LINK } from "../../config";

const AboutUs = () => {
  return (
    <section id="about" className="pt-16 md:pt-32 pb-12 md:pb-4 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-3/5 text-center lg:text-left">
            <h1 className="text-blue-900 font-libre font-bold text-4xl md:text-5xl mb-8">
              Why Avenir Admissions
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              Led by head College Consultant <b>Aiden Kjeldsen</b>, M.S.Ed.
              Avenir Admissions offers expert, personalized guidance to help
              students navigate the college admissions process with clarity and
              confidence. With a Master&apos;s of Education and a UCLA Certified
              College Counseling, Aiden combines <b>professional expertise</b>{" "}
              with a <b>student-centered</b> philosophy in every interaction.
            </p>
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              We are <b>grounded in a strategic, data-driven approach</b> that
              empowers students to make informed choices, showcase their
              strengths authentically, and maximize their opportunities in the
              admissions process. We also believe that{" "}
              <b>college is not the endpoint</b>, but a <b>stepping stone</b>.
              That&apos;s why our guidance goes beyond applications: helping students{" "}
              <b>strengthen</b> their <b>academic foundation</b>, pursue{" "}
              <b>meaningful experiences</b>, build <b>leadership</b>,{" "}
              <b>communication skills</b>, and <b>explore new academic</b> and{" "}
              <b>extracurricular opportunities</b>.
            </p>
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              This holistic approach ensures students aren&apos;t just prepared to
              get into college, but prepared to{" "}
              <b>thrive once they&apos;re there and beyond</b>. Our goal is simple:
              to make college planning <b>manageable</b>, <b>meaningful</b>, and{" "}
              <b>exciting</b>.
            </p>

            <div className="flex justify-center">
              <Cta calLink={CAL_LINK}>
                Book a Free Consultation
              </Cta>
            </div>
          </div>

          <div className="lg:w-2/5">
            <img
              src="/aiden_photo.png"
              alt="Aiden Kjeldsen, founder of Avenir Admissions"
              className="rounded-lg shadow-xl w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
