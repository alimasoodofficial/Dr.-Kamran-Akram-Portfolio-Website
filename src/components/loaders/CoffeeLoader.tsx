'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface CoffeeLoaderProps {
  cupColor?: string;
  liquidColor?: string;
  size?: number; // Multiplier for scale
  speed?: string;
}

const CoffeeLoader: React.FC<CoffeeLoaderProps> = ({
  cupColor = '#ffffff',
  liquidColor = '#fed59fca',
  size = 1,
  speed = '6s',
}) => {
  return (
    <StyledWrapper 
      $cupColor={cupColor} 
      $liquidColor={liquidColor} 
      $size={size} 
      $speed={speed}
    >
      <div className="loader">
        <div className="cup">
          <div className="cup-handle" />
          {/* Mapping smoke for cleaner JSX */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={`smoke smoke-${i}`} />
          ))}
        </div>
        <div className="loading-text" aria-label="Loading">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </StyledWrapper>
  );
};

// --- Animations ---

const expansion = keyframes`
  0%, 100% { width: 25px; transform: translateX(0); }
  40% { width: 100%; transform: translateX(0); }
  80% { width: 25px; transform: translateX(64px); }
  90% { width: 100%; transform: translateX(0); }
`;

const rise = keyframes`
  0% { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
  30% { opacity: 0.7; }
  60% { opacity: 0.4; }
  100% { transform: translate(-50%, -120px) scale(1.5); opacity: 0; }
`;

const pulseText = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

// --- Styled Components ---

const StyledWrapper = styled.div<{ 
  $cupColor: string; 
  $liquidColor: string; 
  $size: number;
  $speed: string;
}>`
  /* Using variables for dynamic scaling and coloring */
  --cup-bg: ${props => props.$cupColor};
  --liquid-bg: ${props => props.$liquidColor};
  --scale: ${props => props.$size};
  --anim-speed: ${props => props.$speed};
  --border-color: #2e2e2e;

  .loader {
    width: calc(100px * var(--scale));
    height: calc(80px * var(--scale));
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cup {
    position: absolute;
    width: 25px;
    height: 20px;
    background-color: var(--cup-bg);
    border: 1px solid var(--border-color);
    z-index: 1;
    border-radius: 2px 2px 10px 10px;
    animation: ${expansion} var(--anim-speed) infinite ease-in-out;
    transform-origin: center;

    /* Top liquid surface */
    &::after {
      content: "";
      position: absolute;
      top: -2px;
      left: 0;
      width: calc(100% - 2px);
      height: 2px;
      background: var(--liquid-bg);
      border: 1px solid var(--border-color);
      border-radius: 50%;
    }

    /* Bottom shadow/rim */
    &::before {
      content: "";
      position: absolute;
      top: 15px;
      left: 0;
      width: calc(100% - 2px);
      height: 4px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-top: none;
      border-radius: 50%;
      z-index: -1;
    }
  }

  .cup-handle {
    position: absolute;
    width: 5px;
    height: 10px;
    background-color: var(--cup-bg);
    border: 1px solid var(--border-color);
    right: -5px;
    top: 2px;
    border-radius: 2px 10px 20px 2px;
  }

  .smoke {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 15px;
    height: 25px;
    background: rgba(107, 102, 102, 0.4);
    border-radius: 50%;
    transform: translateX(-50%);
    animation: ${rise} var(--anim-speed) infinite ease-in-out;
    filter: blur(8px);
  }

  .smoke-1 { animation-delay: 0s; }
  .smoke-2 { animation-delay: 1s; }
  .smoke-3 { animation-delay: 2s; }

  .loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    font-weight: bold;
    letter-spacing: 2px;
    
    span {
      display: inline-block;
      animation: ${pulseText} 1.5s infinite;
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
`;

export default CoffeeLoader;