import { testimonialData } from "../../data/testimonialData";
import { Swiper, SwiperSlide } from "swiper/react";
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Keyboard, Pagination, Navigation, Autoplay } from "swiper/modules";

const Testimonials = () => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center mb-12">
        <h2 className="text-blue-900 font-libre font-bold text-4xl md:text-5xl mb-4">
          What Our Clients Say
        </h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          autoplay={prefersReducedMotion ? false : { delay: 5000, disableOnInteraction: false }}
          modules={[Keyboard, Pagination, Navigation, Autoplay]}
          className="w-full h-auto pb-12"
        >
          {testimonialData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-lg min-h-[250px] mx-4">
                <div className="max-w-2xl text-center">
                  <p className="text-2xl italic text-gray-700 mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="text-xl font-semibold text-blue-900">
                    - {testimonial.author}
                  </p>
                  {testimonial.title && (
                    <p className="text-base text-gray-500">{testimonial.title}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
