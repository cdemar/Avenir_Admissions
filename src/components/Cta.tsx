import { useEffect } from "react";
import type { ReactNode } from "react";
import { getCalApi } from "@calcom/embed-react";

interface CtaProps {
  calLink: string;
  className?: string;
  children?: ReactNode;
}

const Cta = ({ calLink, className, children }: CtaProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: { brandColor: "#000000" },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return (
    <button
      data-cal-link={calLink}
      className={`bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-md transition duration-300 disabled:bg-orange-400 disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {children || "Book a Consultation"}
    </button>
  );
};

export default Cta;
