import React, { useState, useEffect, useRef } from 'react';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export const Calculator: React.FC<Props> = ({ isVisible, onClose }) => {
  const [display, setDisplay] = useState('0');
  // Add other calculator state variables here later

  const calcRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const calculator = calcRef.current;
    const header = headerRef.current;
    if (!calculator || !header) return;

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      offset = {
        x: e.clientX - calculator.offsetLeft,
        y: e.clientY - calculator.offsetTop,
      };
      calculator.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      calculator.style.left = `${e.clientX - offset.x}px`;
      calculator.style.top = `${e.clientY - offset.y}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      calculator.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    header.addEventListener('mousedown', onMouseDown);

    return () => {
      header.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isVisible]);


  if (!isVisible) return null;

  return (
    <div id="calculator-ui" className="visible" ref={calcRef}>
        <div className="calculator-header" ref={headerRef}>
            <span className="title">Calculator</span>
            <button className="close-calc-btn" onClick={onClose}>×</button>
        </div>
        <div id="calc-display-container">
            <span id="calc-memory-indicator" style={{ display: 'none' }}>M</span>
            <div id="calc-display">{display}</div>
        </div>
        <div className="calc-buttons-grid">
            {/* Row 1 */}
            <button className="calc-button calc-button-red">+/-</button>
            <button className="calc-button calc-button-red">√</button>
            <button className="calc-button calc-button-red">%</button>
            <button className="calc-button calc-button-red">÷</button>
            {/* Row 2 */}
            <button className="calc-button calc-button-red">MRC</button>
            <button className="calc-button calc-button-red">M-</button>
            <button className="calc-button calc-button-red">M+</button>
            <button className="calc-button calc-button-red">×</button>
            {/* Row 3 */}
            <button className="calc-button calc-button-num">7</button>
            <button className="calc-button calc-button-num">8</button>
            <button className="calc-button calc-button-num">9</button>
            <button className="calc-button calc-button-red">-</button>
            {/* Row 4 */}
            <button className="calc-button calc-button-num">4</button>
            <button className="calc-button calc-button-num">5</button>
            <button className="calc-button calc-button-num">6</button>
            <button className="calc-button calc-button-red">+</button>
            {/* Row 5 & 6 */}
            <button className="calc-button calc-button-num" style={{gridRow: '5', gridColumn: '1'}}>1</button>
            <button className="calc-button calc-button-num" style={{gridRow: '5', gridColumn: '2'}}>2</button>
            <button className="calc-button calc-button-num" style={{gridRow: '5', gridColumn: '3'}}>3</button>
            <button className="calc-button calc-button-num" style={{gridRow: '6', gridColumn: '2'}}>0</button>
            <button className="calc-button calc-button-num" style={{gridRow: '6', gridColumn: '3'}}>.</button>
            
            <button className="calc-button calc-button-red" style={{gridRow: '6', gridColumn: '1'}}>ON/C</button>
            <button className="calc-button calc-button-red equals" style={{gridRow: '5 / span 2', gridColumn: '4'}}>=</button>
        </div>
    </div>
  );
}; 