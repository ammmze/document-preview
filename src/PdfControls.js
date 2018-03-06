import React from 'react';
import './PdfControls.css';
// fit to page vs fit to width
export default ({ onZoomToFit, onZoomIn, onZoomOut }) => (
    <div className="pdf-controls">
        <div className="pdf-controls-container">
            <button onClick={onZoomToFit}>&#9713;</button>
            <button onClick={onZoomIn}>+</button>
            <button onClick={onZoomOut}>-</button>
        </div>
    </div>
);
