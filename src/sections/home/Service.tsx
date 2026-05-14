import { useState } from "react";
import { serviceData } from "../../data/serviceData";
import ServiceAccordion from "../../components/ServiceAccordion";

const Service = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="service" className="py-16 md:py-34 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-blue-900 font-libre font-bold text-4xl md:text-5xl mb-4">
            How We Help
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
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
      </div>
    </section>
  );
};

export default Service;
