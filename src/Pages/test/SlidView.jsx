import React from 'react';
import { Offcanvas } from "react-bootstrap";

const SlidView = ({show, handleClose, placement, title, body, width}) => {

    return (
        <>
            <Offcanvas style={{width: width}}  show={show} placement={placement} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{title}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <hr/>
                    {body}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default SlidView