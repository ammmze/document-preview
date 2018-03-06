import React from 'react';
import PropTypes from 'prop-types';
import PDF from 'react-pdf-js';
import { Document, Page } from 'react-pdf/dist/entry.noworker';
import { Modal } from 'react-bootstrap';
import PdfControls from './PdfControls';
import './DocumentPreview.css';

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

    onDocumentComplete = pages => {
        this.setState({ page: 1, pages });
    };

    onPageComplete = page => {
        this.setState({ page });
    };

    handlePrevious = () => {
        this.setState({ page: this.state.page - 1 });
    };

    handleNext = () => {
        this.setState({ page: this.state.page + 1 });
    };

    renderPagination = (page, pages) => {
        let previousButton = (
            <li className="previous" onClick={this.handlePrevious}>
                <a href="#">
                    <i className="fa fa-arrow-left" /> Previous
                </a>
            </li>
        );
        if (page === 1) {
            previousButton = (
                <li className="previous disabled">
                    <a href="#">
                        <i className="fa fa-arrow-left" /> Previous
                    </a>
                </li>
            );
        }
        let nextButton = (
            <li className="next" onClick={this.handleNext}>
                <a href="#">
                    Next <i className="fa fa-arrow-right" />
                </a>
            </li>
        );
        if (page === pages) {
            nextButton = (
                <li className="next disabled">
                    <a href="#">
                        Next <i className="fa fa-arrow-right" />
                    </a>
                </li>
            );
        }
        return (
            <nav>
                <ul className="pager">
                    {previousButton}
                    {nextButton}
                </ul>
            </nav>
        );
    };

    render() {
        const { fitTo, scale } = this.state;
        let pagination = null;
        if (this.state.pages) {
            pagination = this.renderPagination(
                this.state.page,
                this.state.pages
            );
        }
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
                        <div className="modal-body-container">
                            <div className="pdf-container">
                                <PDF
                                    className="pdf-document"
                                    scale={scale}
                                    file={this.props.file}
                                    onDocumentComplete={this.onDocumentComplete}
                                    onPageComplete={this.onPageComplete}
                                    page={this.state.page}
                                />
                            </div>
                            {pagination}
                        </div>
                    </Modal.Body>
                    <PdfControls
                        onZoomToFit={() => this.setState({ scale: 1 })}
                        onZoomIn={() => this.setState({ scale: scale + 0.1 })}
                        onZoomOut={() =>
                            this.setState({ scale: Math.max(0.1, scale - 0.1) })
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
