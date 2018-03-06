import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import DocumentPreview from './DocumentPreview';
import samplePdf from './samplePdf';
import FillerContent from './FillerContent';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const App = () => (
    <div style={styles}>
        <FillerContent />
        <DocumentPreview
            file={`data:application/pdf;base64,${samplePdf}`}
            footer={<div>my footer</div>}
        />
    </div>
);

render(<App />, document.getElementById('root'));
