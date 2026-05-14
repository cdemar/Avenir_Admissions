import { useEffect } from "react";

interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default Title;
