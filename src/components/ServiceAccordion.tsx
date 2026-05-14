import {
  LuPencilLine,
  LuApple,
  LuBookOpenText,
  LuMedal,
  LuGlobe,
  LuGraduationCap,
  LuChevronDown,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { Transition } from "@headlessui/react";
import type { Service } from "../types";

const iconMap: Record<string, IconType> = {
  LuPencilLine,
  LuApple,
  LuBookOpenText,
  LuMedal,
  LuGlobe,
  LuGraduationCap,
};

interface ServiceAccordionProps {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}

const ServiceAccordion = ({ service, isOpen, onToggle }: ServiceAccordionProps) => {
  const IconComponent = iconMap[service.icon];

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex w-full justify-between rounded-lg bg-blue-100 px-6 py-4 text-left text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors"
      >
        <div className="flex items-center">
          {IconComponent && (
            <IconComponent className="w-8 h-8 mr-4 text-yellow-400" />
          )}
          <div className="flex flex-col text-left">
            <span className="text-xl md:text-2xl font-semibold">
              {service.title}
            </span>
            <span className="text-lg font-normal">{service.subTitle}</span>
          </div>
        </div>
        <LuChevronDown
          className={`${
            isOpen ? "rotate-180" : ""
          } h-6 w-6 text-blue-700 transform transition-transform self-center`}
        />
      </button>

      <Transition
        show={isOpen}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-96"
        leave="transition-all duration-200 ease-in"
        leaveFrom="opacity-100 max-h-96"
        leaveTo="opacity-0 max-h-0"
      >
        <div className="overflow-hidden rounded-b-lg">
          <div className="px-6 pt-4 pb-2 text-base text-gray-700 bg-white">
            <p className="mb-4 text-lg">{service.content}</p>
            <ul className="list-disc space-y-2 pl-5 text-lg">
              {service.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ServiceAccordion;
