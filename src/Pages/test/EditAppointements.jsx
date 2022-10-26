import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider, Container, Row, Col, Button, Form } from "react-bootstrap";
import "./admin.css";
import ServiceManagement from '../../Axios/DoctorsManagement'
import moment from 'moment'

const EditAppointment = () => {

    let navigate = useNavigate();
    const { id } = useParams();

    const [AppointmentID, setAppointmentID] = useState("")
    const [Date, setDate] = useState("")
    const [Status, setStatus] = useState("")
    const [Time, SetTime] = useState("")

    const editAppointment = async (e) => {
        try {
            e.preventDefault();

            const AppointmentData = {
                status: Status,
            }

            await axios.put(`http://localhost:8090/api/v1/appointment/${id}`, AppointmentData)
            alert("Selected Appointment is Updated!!");
            navigate("/onGoingAppointments");

        } catch (error) {
            alert(error);
        }

    }

    const fetchData = useCallback(async () => {
        try {
            ServiceManagement.getAppointmentById(id).then(res => {
                let IData = res.data;
                setAppointmentID(IData.AID)
                setDate(IData.date)
                setStatus(IData.status)
                SetTime(IData.time)
            })
        } catch (error) {
            alert(error);
        };

    }, []);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    //date conversion
    function convertDates(date) {
        if (!date) {
            return '';
        }
        else {
            return moment(date).format('YYYY-MM-DD');
        }
    }

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <Container>
                <div className='list-title' Style={{ marginTop: '50px' }}>
                    <hr />
                    <center>
                        <h2>EDIT APPOINTMENT</h2>
                    </center>
                    <hr />
                    <br /><br />
                </div>
                <div className="row justify-content-md-center">
                    <div className='col-md-4'>
                        <form onSubmit={(e) => editAppointment(e)} className={'body-content'}>
                            <Row Style={{ marginTop: '20px' }}>
                                <Col>
                                    <div>
                                        <Form.Group >
                                            <label >Appointment ID:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={AppointmentID} onChange={(e) => {
                                                setAppointmentID(e.target.value);
                                            }} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Appointment Date:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={convertDates(Date)} onChange={(e) => {
                                                setDate(e.target.value);
                                            }} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Appointment Time:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={Time} onChange={(e) => {
                                                SetTime(e.target.value);
                                            }} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Appointment Status:</label> <br />
                                            <select style={{ marginTop: '5px' }} type="text" className="form-select" value={Status} onChange={(e) => {
                                                setStatus(e.target.value);
                                            }} required >
                                                <option value=""></option>
                                                <option value="Accepted">Accept</option>
                                                <option value="Canceled">Cancel</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </Form.Group><br />

                                    </div>

                                    <br />
                                    <Button id='btn-common' variant="primary" type='submit'>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button variant="outline-secondary" onClick={() => { navigate("/onGoingAppointments") }}>Cancel</Button>

                                </Col>

                            </Row>
                        </form ><br />
                    </div>
                </div>
            </Container >
        </ThemeProvider >
    )
}

export default EditAppointment;

