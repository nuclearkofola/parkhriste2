import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export function Header() {
  return (
    <header className="shadow-md sticky top-0 z-50 bg-base-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
      
<svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            width="80" 
            height="80" 
            className="fill-primary"
          >
            <path d="M50,5.2c-21.2,0-38.3,17.2-38.3,38.3c0,16.8,10.8,31.1,25.9,36.2L50,94.8l12.4-15.1c15.1-5.2,25.9-19.4,25.9-36.2   C88.3,22.3,71.2,5.2,50,5.2z M69.4,60.2c-0.1,0-0.2,0-0.4,0c-0.6,0-1.1-0.4-1.3-1l-1.5-5.5h-6.9l1.3,4.7c0.2,0.7-0.2,1.5-0.9,1.7   c-0.1,0-0.2,0-0.4,0c-0.6,0-1.1-0.4-1.3-1l-3.6-12.8l-1.8,7.1c-0.1,1.1-1.4,6.7-13,6.7H30c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3   c5.3,0,7.9-1.2,9.1-2.3c1.1-1,1.3-1.9,1.3-2c0-0.1,0-0.2,0-0.3l7.5-29.2c0.2-0.7,0.9-1.2,1.6-1c0.7,0.2,1.2,0.9,1,1.6l-1,3.9h6.8   l1.2-4.5c0.2-0.7,0.9-1.1,1.5-1c0.7-0.1,1.4,0.3,1.5,1l9.7,34.8C70.5,59.2,70.1,60,69.4,60.2z" />
          </svg>

          <h1 className="text-2xl font-bold text-primary">Park Hřiště</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="btn btn-ghost btn-sm text-base-content">Domů</Link>
          <Link to="/mapa" className="btn btn-ghost btn-sm text-base-content">Mapa</Link>
          <Link to="/seznam" className="btn btn-ghost btn-sm text-base-content">Hřiště</Link>
          <Link to="/o-nas" className="btn btn-ghost btn-sm text-base-content">O nás</Link>
         
        </nav>
      </div>
    </header>
  );
}

