export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subTitle: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  content: string;
}

export interface Service {
  id: number;
  title: string;
  subTitle: string;
  icon: string;
  content: string;
  points: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
}
