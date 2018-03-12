import React from 'react';
import { render } from 'react-dom';
import { Button } from 'react-bootstrap';
import DocumentPreview from './DocumentPreview';
import FillerContent from './FillerContent';
import multiPagePdf from './multiPagePdf';
import mixedOrientationPdf from './mixedOrientationPdf';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const multiPagePdfFile = `data:application/pdf;base64,${multiPagePdf}`;
const mixedOrientationPdfFile = `data:application/pdf;base64,${mixedOrientationPdf}`;

class App extends React.Component {
    state = {
        show: true,
        file: multiPagePdfFile
    };
    preview = file => {
        return this.setState({ show: true, file: file });
    };
    render = () => (
        <div style={styles}>
            <Button
                bsStyle="primary"
                onClick={this.preview.bind(this, multiPagePdfFile)}
            >
                Show Multi Page Pdf
            </Button>
            <Button
                bsStyle="primary"
                onClick={this.preview.bind(this, mixedOrientationPdfFile)}
            >
                Show Mixed Orientation Pdf
            </Button>
            <FillerContent />
            {this.state.show && (
                <DocumentPreview
                    show={this.state.show}
                    file={this.state.file}
                    onClose={() => this.setState({ show: false })}
                    toolbar={
                        <div>
                            <button className="btn btn-primary">
                                Download
                            </button>
                        </div>
                    }
                    footer={<div>my footer</div>}
                />
            )}
        </div>
    );
}

render(<App />, document.getElementById('root'));
