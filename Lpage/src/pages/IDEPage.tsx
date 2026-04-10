import React from 'react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const IDEPage: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-devmind-dark text-white">
      <div className="text-center">
        <img
          src={breakingCodeLogo}
          alt="Breaking Code logo"
          className="mx-auto mb-6 h-24 w-auto rounded-2xl border border-white/10 object-contain shadow-[0_0_32px_rgba(90,255,188,0.14)]"
        />
        <h1 className="text-4xl font-bold mb-4 text-devmind-cyan">Breaking Code IDE</h1>
        <p className="text-gray-400 mb-8">This is where the magic happens.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-devmind-purple rounded-full hover:bg-opacity-80 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default IDEPage;
