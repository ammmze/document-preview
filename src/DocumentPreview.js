import React from 'react';
import PropTypes from 'prop-types';
import PDF from 'react-pdf-js';
import { Document, Page } from 'react-pdf/build/entry.noworker';
import { Modal } from 'react-bootstrap';
import { AutoSizer, List } from 'react-virtualized';
import PdfControls from './PdfControls';
import './DocumentPreview.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// https://github.com/mikecousins/react-pdf-js/blob/master/src/Pdf.jsx#L26
const calculateScale = (scale, fillWidth, fillHeight, view, parentElement) => {
    if (fillWidth) {
        const pageWidth = view[2] - view[0];
        return parentElement.clientWidth / pageWidth;
    }
    if (fillHeight) {
        const pageHeight = view[3] - view[1];
        return parentElement.clientHeight / pageHeight;
    }
    return scale;
};

export default class DocumentPreview extends React.Component {
    static propTypes = {
        fitTo: PropTypes.oneOf(['page', 'width'])
    };
    static defaultProps = {
        fitTo: 'page'
    };
    state = {
        scale: 1
    };

    constructor(props) {
        super(props);
        this.state.fitTo = props.fitTo;
    }

    onDocumentLoad = ({ numPages: pages }) => {
        this.setState({ page: 1, pages });
    };

    onPageComplete = page => {
        this.setState({ page });
    };

    renderPage = ({
        index, // Index of row
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        key, // Unique key within array of rendered rows
        parent, // Reference to the parent List (instance)
        style // Style object to be applied to row (to position it); This must be passed through to the rendered row element.
    }) => {
        const { scale } = this.state;
        return (
            <Page
                key={key}
                style={style}
                scale={scale}
                pageNumber={index + 1}
            />
        );
    };

    render() {
        const { fitTo, scale, pages } = this.state;
        return (
            <div>
                <Modal
                    className={`document-preview-modal fit-to-${fitTo}`}
                    show={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                        <div>
                            Page {this.state.page} of {this.state.pages}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            <Document
                                file={this.props.file}
                                onLoadSuccess={this.onDocumentLoad}
                            >
                                {[...Array(pages).keys()].map(index =>
                                    this.renderPage({
                                        index,
                                        key: `page-${index}`
                                    })
                                )}
                                {/*react-virtualized scrolling...to enhance performance*/
                                /*documentProps => (
                                            <AutoSizer>
                                                {({ height, width }) => (
                                                    <List
                                                        height={height}
                                                        rowCount={pages}
                                                        rowHeight={20}
                                                        rowRenderer={this.renderPage.bind(
                                                            this,
                                                            documentProps
                                                        )}
                                                        width={width}
                                                    />
                                                )}
                                            </AutoSizer>
                                        )*/}
                            </Document>
                        }
                        {
                            /*so...currently have this other pdf library in here because 
                                it the other react-pdf library doesnt seem to render the pages 
                                without it...i suspect something with the worker thread and im 
                                guessing the react-pdf-js library does something else to get 
                                the worker running*/
                            <div style={{ display: 'none' }}>
                                <PDF
                                    className="pdf-document"
                                    scale={scale}
                                    file={this.props.file}
                                    onDocumentComplete={this.onDocumentComplete}
                                    onPageComplete={this.onPageComplete}
                                    page={this.state.page}
                                />
                            </div>
                        }
                    </Modal.Body>
                    <PdfControls
                        fitTo={fitTo}
                        onZoomToFit={fitTo =>
                            this.setState({ scale: 1, fitTo })
                        }
                        onZoomIn={() => this.setState({ scale: scale * 1.1 })}
                        onZoomOut={() =>
                            this.setState({ scale: Math.max(0.1, scale * 0.9) })
                        }
                    />
                    {this.props.footer && (
                        <Modal.Footer>{this.props.footer}</Modal.Footer>
                    )}
                </Modal>
            </div>
        );
    }
}
