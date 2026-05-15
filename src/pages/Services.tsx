import { useState } from "react";
import { serviceData } from "../data/serviceData";
import ServiceAccordion from "../components/ServiceAccordion";
import Cta from "../components/Cta";
import SEO from "../components/SEO";
import { CAL_LINK } from "../config";

const Services = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <div className="pt-32 pb-16">
      <SEO
        title="Our Services | Avenir Admissions"
        description="Expert college admissions consulting for 9th–12th grade students, transfer applicants, and international students. Personalized guidance at every stage."
        url="/services"
      />

      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-blue-900 font-libre font-bold text-5xl mb-4">
            How We Help
          </h1>
          <p className="text-xl text-gray-600">
            Personalized guidance at every stage of the journey — from freshman
            year through application season.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          {serviceData.map((service) => (
            <ServiceAccordion
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              onToggle={() =>
                setOpenId(openId === service.id ? null : service.id)
              }
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center bg-blue-50 rounded-2xl p-10">
          <h2 className="text-blue-900 font-libre font-bold text-3xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Book a free 20-minute consultation to find the right plan for your student.
          </p>
          <Cta calLink={CAL_LINK}>Book a Free Consultation</Cta>
        </div>
      </div>
    </div>
  );
};

export default Services;
