import Cta from "../../components/Cta";
import { useForm, ValidationError } from "@formspree/react";

const ContactUs = () => {
  const [state, handleSubmit] = useForm("meolngyl");

  return (
    <section
      id="contact"
      className="relative bg-blue-800 text-neutral-50 py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 relative z-20">
        <div className="flex flex-col lg:flex-row items-stretch md:justify-between gap-10 lg:gap-0 xl:gap-12">
          <div className="text-center lg:text-left md:w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-libre font-bold leading-tight mb-6">
              Contact Us
            </h1>

            <div className="space-y-2 text-lg lg:text-xl mb-8">
              <p>Interested in working together?</p>
              <p>Fill out some info and we will be in touch shortly.</p>
              <p>We can&apos;t wait to hear from you!</p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Cta calLink="avenir-admissions/consultation">
                Book a Free Consultation
              </Cta>
            </div>

            <div className="pt-8">
              <p className="text-lg">
                Call us:{" "}
                <a
                  href="tel:+17073479477"
                  className="text-yellow-400 hover:text-yellow-500 font-semibold"
                >
                  (707) 347-9477
                </a>
              </p>
            </div>
          </div>

          <div className="lg:hidden w-full h-px bg-blue-700 my-10 mx-auto"></div>
          <div className="hidden lg:block w-px bg-blue-700 mx-8 xl:mx-12"></div>

          <div className="md:w-full lg:w-1/2 xl:w-[45%] flex items-center">
            {state.succeeded ? (
              <div className="text-center w-full">
                <h2 className="text-3xl font-bold mb-4">
                  Thanks for reaching out!
                </h2>
                <p className="text-lg">We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name (required)
                  </label>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      placeholder="First Name"
                      className="block w-full px-4 py-3 rounded-md bg-blue-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-50"
                      required
                    />
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      placeholder="Last Name"
                      className="block w-full px-4 py-3 rounded-md bg-blue-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email (required)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="block w-full px-4 py-3 rounded-md bg-blue-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-50"
                    required
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-yellow-400 mt-2 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message (required)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="How can we help?"
                    className="block w-full px-4 py-3 rounded-md bg-blue-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-50"
                    required
                  ></textarea>
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-yellow-400 mt-2 text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="news-updates"
                    name="news-updates"
                    type="checkbox"
                    className="h-4 w-4 text-orange-400 focus:ring-orange-500 border-blue-600 rounded bg-blue-700"
                  />
                  <label htmlFor="news-updates" className="ml-2 block text-sm">
                    Sign up for news and updates
                  </label>
                </div>

                <div className="flex justify-center lg:justify-start">
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-900 bg-neutral-50 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-neutral-50 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
