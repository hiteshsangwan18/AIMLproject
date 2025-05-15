import type { SVGProps } from 'react';

export function FaceFeelLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
          .facefeel-text {
            font-family: 'Poppins', var(--font-geist-sans), sans-serif;
            font-weight: 600;
          }
        `}
      </style>
      <text
        x="0"
        y="35"
        className="facefeel-text"
        fontSize="32"
        fill="hsl(var(--primary))"
      >
        FaceFeel
      </text>
      <path d="M145 15 C 140 10, 130 10, 125 15 S 115 25, 120 30 C 125 35, 135 35, 140 30 S 150 20, 145 15 Z" fill="hsl(var(--accent))" opacity="0.7" />
      <circle cx="130" cy="22" r="3" fill="hsl(var(--primary-foreground))" />
      <circle cx="140" cy="22" r="3" fill="hsl(var(--primary-foreground))" />
      <path d="M128 28 Q 135 32 142 28" stroke="hsl(var(--primary-foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
