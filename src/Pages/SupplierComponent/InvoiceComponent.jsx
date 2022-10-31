import React, { useCallback, useState, useEffect, useRef } from 'react'
import { ThemeProvider, Container, Table, Row, Col, Button, Form } from "react-bootstrap";
import "./style.css";
import { PDFExport } from "@progress/kendo-react-pdf";
import { render } from '@testing-library/react';

const Invoice = ({object, company, depot}) => {


    const pdfExportComponent = useRef(null);
    const [count, setCount] = useState(1);

    //fetch details of orders and assign them to relevant varaiables
    const fetchData = useCallback(async () => {


    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    const provideInvoice = () => {
        setTimeout(() => {
            pdfExportComponent.current.save();
        }, 1000)

    }

    if (count == 1) {
        provideInvoice();
        setCount(2);
    }

    render (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>
            return <> sdsd
        </>
        
            <div style={{ marginLeft: '30px', marginRight: '30px', marginTop: '100px' }}>

                <center>
                    <h2 style={{ fontWeight: '700' }}>Invoice</h2>
                </center><br />


                <PDFExport fileName='Invoice' ref={pdfExportComponent}>
                    <>
                        <Row>
                            <Col>
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Order ID: </label><b>{object.order_id}</b><br />
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Invoice date: </label><b>{new Date().toLocaleDateString()}</b><br />
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Address: </label>{object.address}<br />
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Depot: </label>{depot}<br />
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Company: </label>{company}<br />
                                <hr /><br />
                                <label style={{ fontWeight: '500', fontSize: '19px' }}>Total: </label>{object.budget}<br />
                                <v>Terms & Condition</v>
                            </Col>
                        </Row>
                    </>
                </PDFExport>

            </div>
        </ThemeProvider >

    )
}

export default Invoice;

