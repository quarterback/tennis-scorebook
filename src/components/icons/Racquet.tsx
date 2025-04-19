
import { LucideProps } from 'lucide-react';

export const Racquet = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 6a5 5 0 1 1 7 7 5 5 0 0 1-7-7z" />
      <path d="M4.3 10.7a5 5 0 0 0 7 7l7-7a5 5 0 0 0-7-7l-7 7z" />
      <path d="M18 20V4" />
    </svg>
  );
};

export default Racquet;
