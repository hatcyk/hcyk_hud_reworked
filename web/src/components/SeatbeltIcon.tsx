import React from 'react';

interface SeatbeltIconProps {
  className?: string;
}

const SeatbeltIcon: React.FC<SeatbeltIconProps> = ({ className = "w-4 h-4" }) => {
  return (
    <svg 
      version="1.0" 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48.000000 48.000000"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      fill="currentColor"
    >
      <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)">
        <path d="M194 471 c-36 -16 -64 -60 -64 -103 0 -32 7 -47 34 -74 28 -28 42
        -34 76 -34 34 0 48 6 76 34 45 45 47 101 7 146 -30 34 -89 48 -129 31z m104
        -57 c25 -28 27 -42 11 -78 -27 -59 -115 -55 -140 6 -15 37 1 75 41 95 31 16
        59 8 88 -23z"/>
        <path d="M345 270 c-46 -46 -53 -50 -97 -50 -63 0 -106 -19 -145 -63 -32 -37
        -57 -103 -51 -135 2 -11 15 -18 33 -20 27 -2 46 14 180 147 101 102 146 154
        139 161 -7 7 -26 -6 -59 -40z m-95 -88 c0 -5 -35 -42 -77 -83 -70 -67 -78 -72
        -81 -51 -6 38 31 94 78 119 44 23 80 30 80 15z"/>
        <path d="M287 122 c-53 -53 -97 -103 -97 -110 0 -10 28 -12 118 -10 l117 3 -2
        43 c-1 24 -11 60 -23 79 -19 32 -19 37 -5 53 18 20 20 40 2 40 -7 0 -56 -44
        -110 -98z m100 -57 l6 -35 -74 0 -73 0 54 55 c51 52 54 53 67 35 8 -11 17 -36
        20 -55z"/>
      </g>
    </svg>
  );
};

export default SeatbeltIcon;
