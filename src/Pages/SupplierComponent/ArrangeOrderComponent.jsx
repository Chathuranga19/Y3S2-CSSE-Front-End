import React, { useCallback, useState, useEffect, useRef } from 'react'
import { ThemeProvider, Table, Row, Col, Button, Form } from "react-bootstrap";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from './Pagination';
import './style.css';
import ServiceManagement from '../../Axios/supplierManagement';
import { PDFExport } from '@progress/kendo-react-pdf';
import { GENERATE_CHECKBOX_ID, ALERT_MESSAGE, COMPLETE_STATUS, PENDING_STATUS } from '../../Utils/SupplierCommonConstants';

const ArrangeOrder = () => {

    //Initializing variables
    const [DataList, setDataList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [indexOfFirstItem, setindexOfFirstItem] = useState(0);
    const [indexOfLastItem, setindexOfLastItem] = useState(5);
    const [recordsPerPage] = useState(5);
    const [retrievedData, setretrievedData] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [company, setCompany] = useState('');
    const [filteredDepots, setFilteredDepots] = useState([]);
    const [depot, setDepot] = useState('');
    const [generateCheck, setGenerateCheck] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [count, setCount] = useState(1);
    const [companyData, setCompanyData] = useState([]);

    const pdfExportComponent = useRef(null);

    //fetch details of orders and assign them to the relevant varaiables
    const fetchApprovedOrders = useCallback(async () => {

        try {

            //get companies and depots from backend
            ServiceManagement.getCompanies().then(res => {
                setCompanyData(res.data);
            })

            //get accepted order details
            ServiceManagement.getAcceptedOrders().then(res => {

                setDataList(res.data);
                setretrievedData(res.data);
                setCount(1);
                //get first pending record from the list, in order to display that records details in the form window
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].supplier_status == PENDING_STATUS) {
                        setSelectedValue(res.data[i]._id);
                        setName(res.data[i].name);
                        setAddress(res.data[i].address);
                        break;
                    }
                }
            })
        } catch (error) {
            alert(error);
        }

    }, [])

    useEffect(() => {
        fetchApprovedOrders()
    }, [fetchApprovedOrders])


    //slice retrieved data for the pagination
    const SlicedDataList = DataList.slice(indexOfFirstItem, indexOfLastItem);

    //filter data for the search function
    const filterData = (obj, key) => {

        const results = obj.filter(o =>
            Object.keys(o).some(k => o[k].toString().toLowerCase().includes(key.toLowerCase())));

        setDataList(results);

    }

    //search function
    const handleSearch = (e) => {

        const k = e.target.value.toLowerCase()

        filterData(retrievedData, k);


    }

    //update the order with delivery details by calling backend endpoint 
    const deliverGoods = async (e) => {
        try {
            e.preventDefault();

            //data to update
            const data = {
                supplier_status: COMPLETE_STATUS,
                company: company,
                depot: depot
            }

            //call the endpoint to update delivery details
            ServiceManagement.updateDeliveryDetails(selectedValue, data).then(res => {
                setCompanyData(res.data);
            })

            alert(ALERT_MESSAGE);

            setCompany('');
            setDepot('');
            setGenerateCheck('');
            document.getElementById(GENERATE_CHECKBOX_ID).checked = false;
            document.getElementById(selectedValue).checked = false;
            provideInvoice(); // call the function that generate invoice
            fetchApprovedOrders();

        } catch (error) {
            alert(error);
        }

    }

    //filter the data according to the selected order
    const hanldeSelectedOrder = (value) => {
        if (value != '') {
            let sliceList = DataList.slice();
            let selectedRecord = sliceList.filter(item => item._id.toLowerCase() == value.toLowerCase());
            setAddress(selectedRecord[0].address);
            setName(selectedRecord[0].name);
        }
        else {
            setAddress('');
            setName('');
        }
    }

    //Conditional Rendering
    //check the first pending order and check the order to display its form window
    if (count == 1) {
        if (DataList.length > 0) {
            for (let i = 0; i < DataList.length; i++) {
                if (DataList[i].supplier_status == PENDING_STATUS) {
                    if (document.getElementById(DataList[i]._id)) {
                        document.getElementById(DataList[i]._id).checked = true;
                        setCount(2);
                    }
                    break;
                }
            }
        }
    }

    //Conditional Rendering
    //set unique list of companies as options in a select 
    let companyList = companyData.length > 0 && [...new Set(companyData.map(item => item.company))].length > 0 && (
        [...new Set(companyData.map(item => item.company))].map((item) => {
            return (
                <option key={item} value={item}>{item}</option>
            )
        }));

    //set depots as options in a select according to selected company
    let depotsList = filteredDepots.length > 0 && (
        filteredDepots.map((item) => {
            return (
                <option key={item.depot} value={item.depot}>{item.depot}</option>
            )
        }));

    //handle dynamic checkboxes functionality
    const selectDelivery = (value, id) => {
        if (document.getElementById(id).checked == false) {
            value = '';
        }
        setSelectedValue(value);
        hanldeSelectedOrder(value);
    }

    //handle selecting company and filter the depots according to that
    const selectCompany = (value) => {
        setCompany(value);
        let filtered = companyData.slice();
        filtered = filtered.filter(item => item.company.toLowerCase() == value.toLowerCase());
        setFilteredDepots(filtered);
    }

    //handle selecting depot
    const selectDepot = (value) => {
        setDepot(value);
    }

    //this method exports invoice as a pdf
    const provideInvoice = () => {
        pdfExportComponent.current.save();
    }

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <div style={{ marginLeft: '30px', marginRight: '30px', marginTop: '100px' }}>

                <center>
                    <h2 style={{ fontWeight: '700' }}>Create Order Delivery</h2>
                </center><br />


                <Row style={{ marginTop: '50px' }}>
                    <div style={{ backgroundColor: '#F4F7FC', width: '72.2%', marginLeft: '12px' }} className='box-form'>
                        <div className="fontuser" style={{ float: 'left', marginLeft: '40px', marginTop: '15px' }}>

                            <input className='main-search' placeholder="Search..." type="text" name="search" style={{ width: '400px', height: '40px' }} onChange={(e) => {
                                handleSearch(e);
                            }} />
                            <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>

                        </div>
                    </div><br /><br /><br />
                    <Row >
                        <Col xs={9}>

                            {/* Conditional rendering checks whether SlicedData length is more than 0, and if it is not return a saying No records found*/}

                            {SlicedDataList.length > 0 ? (
                                <Table striped borderless hover responsive>

                                    <thead style={{ backgroundColor: '#F4F7FC' }}>

                                        <tr>
                                            <th> </th>
                                            <th>ORDER ID</th>
                                            <th>NAME</th>
                                            <th>SITE ADDRESS</th>
                                            <th>STATUS</th>
                                            <th>COMPANY</th>
                                            <th>DEPOT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            SlicedDataList && SlicedDataList.map((list) => (
                                                <tr key={list._id + 'A'}>
                                                    <td key={list._id + 'B'}>

                                                        {/* Conditional Rendering checks whether that a checkbox already selected and if it is not it only renders the Pending order*/}
                                                        {selectedValue != '' ? (
                                                            list._id === selectedValue && list.supplier_status !== "Complete" ?
                                                                <input key={list._id + 'C'} type="checkbox" className="form-check-input" value={list._id} id={list._id} onChange={(e) => { selectDelivery(e.target.value, list._id) }} />
                                                                :
                                                                <input key={list._id + 'C'} type="checkbox" className="form-check-input" value={list._id} id={list._id} disabled />
                                                        ) :
                                                            list.supplier_status === "Complete" ? (
                                                                <input key={list._id + 'D'} type="checkbox" className="form-check-input" value={list._id} id={list._id} disabled />
                                                            ) : (
                                                                <input key={list._id + 'D'} type="checkbox" className="form-check-input" value={list._id} id={list._id} onChange={(e) => { selectDelivery(e.target.value, list._id) }} />
                                                            )}

                                                    </td>
                                                    <td key={list._id + 'E'}>{list.order_id}</td>
                                                    <td key={list._id + 'F'}>{list.name}</td>
                                                    <td key={list._id + 'G'}>{list.address}</td>
                                                    <td key={list._id + 'H'}>

                                                        {/* Conditional Rendering to render diffrent styled output depending on the status */}

                                                        {list.supplier_status === "Complete" ?
                                                            <Form.Group key={list._id + 'I'} className="completed-status" controlId="formBasicCheckbox">
                                                                <b key={list._id + 'J'} style={{ color: '#14804A', fontWeight: '500' }}>{list.supplier_status}</b>
                                                            </Form.Group>
                                                            : (
                                                                <Form.Group key={list._id + 'K'} className="pending-status" controlId="formBasicCheckbox">
                                                                    <b key={list._id + 'L'} style={{ color: '#4F5AED', fontWeight: '500' }}>{list.supplier_status} </b>
                                                                </Form.Group>
                                                            )}

                                                    </td>
                                                    <td key={list._id + 'M'}>{list.company}</td>
                                                    <td key={list._id + 'N'}>{list.depot}</td>
                                                </tr>
                                            ))
                                        }


                                    </tbody>
                                </Table>
                            ) : (
                                <span style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                                    Accepted Order Details Unavailable !
                                </span>
                            )}

                            <Pagination
                                itemsCount={DataList.length}
                                itemsPerPage={recordsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setindexOfLastItem={setindexOfLastItem}
                                setindexOfFirstItem={setindexOfFirstItem}
                                alwaysShown={false}
                            />
                        </Col>

                        {/* Conditional Rendering: renders only when a checkbox is selected and values assigned to name and address varaiables */}

                        {name !== '' && address !== '' ? (
                            <Col xs={3}>
                                <form onSubmit={(e) => deliverGoods(e)} style={{ marginTop: '-93px' }}>
                                    <Row style={{ marginTop: '20px' }}>
                                        <Col>
                                            <div style={{ backgroundColor: '#FFB400', padding: '28px 60px' }} className='box-form'>
                                                <center style={{ fontWeight: '700', fontSize: '18px' }}>Place Order</center>
                                            </div>
                                            <PDFExport fileName='Delivery_Details' title='Invoice' ref={pdfExportComponent}>
                                                <>
                                                    <div className={'body-content'} >
                                                        <Form.Group >
                                                            <center style={{ fontWeight: '700', fontSize: '22px' }}>ORDER FOR</center>
                                                            <center style={{ fontWeight: '450', fontSize: '15px' }}>{name}</center><br />
                                                            <center>
                                                                <p style={{ color: 'rgb(75, 75, 75)', fontWeight: '450', fontSize: '15px' }}>{address}</p>
                                                            </center>

                                                        </Form.Group><br />

                                                        <Form.Group >
                                                            <label >Company:</label> <br />
                                                            <select style={{ marginTop: '5px' }} value={company} type="text" className="form-select" onChange={(e) => { selectCompany(e.target.value) }} required >
                                                                <option value=""></option>
                                                                {companyList}
                                                            </select>
                                                        </Form.Group><br />

                                                        <Form.Group >
                                                            <label >Depot:</label> <br />
                                                            <select style={{ marginTop: '5px' }} value={depot} type="text" className="form-select" onChange={(e) => { selectDepot(e.target.value) }} required >
                                                                <option value=""></option>
                                                                {depotsList}
                                                            </select>
                                                        </Form.Group><br />
                                                        <input type="checkbox" className="form-check-input" name="generate check" value="true" id="generate" onChange={(e) => {
                                                            if (document.getElementById("generate").checked == false) {
                                                                e.target.value = "false";
                                                            }
                                                            setGenerateCheck(e.target.value);
                                                        }} /> &nbsp;

                                                        <span style={{ color: 'rgb(75, 75, 75,)', fontWeight: '450', fontSize: '15px' }}>
                                                            Generate invoice and deliver note
                                                        </span> <br /><br />

                                                        <center>
                                                            {generateCheck == 'true' ? (
                                                                <Button id='btn-common' style={{ width: 'auto', backgroundColor: '#FFB400', borderColor: '#FFB400', fontWeight: '550', color: 'black', fontSize: '15px' }} variant="primary" type='submit'>Deliver Now</Button>

                                                            ) : (
                                                                <Button id='btn-common' style={{ width: 'auto', backgroundColor: '#FFB400', borderColor: '#FFB400', fontWeight: '550', color: 'black', fontSize: '15px' }} variant="primary" type='submit' disabled>Deliver Now</Button>
                                                            )}

                                                        </center>
                                                    </div>
                                                </>
                                            </PDFExport>

                                        </Col>

                                    </Row>
                                </form ><br />
                            </Col>
                        ) : null}
                    </Row>
                </Row>

            </div>
        </ThemeProvider >
    )
}

export default ArrangeOrder;

