import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider, Container, Row, Col, Button, Form } from "react-bootstrap";
import "./admin.css";
import ServiceManagement from '../../Axios/DoctorsManagement'
import moment from 'moment'

const EditHealthStatus = () => {

    let navigate = useNavigate();
    const [ id, setID ] = useState("")

    const [PatientID, setPatientID] = useState("")
    const [CuredDate, setCuredDate] = useState("")
    const [Illness, setIllness] = useState("")
    const [DoctorID, SetDoctorID] = useState("")
    const [AppointmentDate, setAppointmentDate] = useState("")
    const [Cured, setCured] = useState("")
    const [illnessList, setIllnessList] = useState([])

    const editHealthStatus = async (e) => {
        try {
            e.preventDefault();

            if (Cured == "") {
                Cured = "false";
            }

            const HealthStatusData = {
                cured: Cured,
                cured_date: CuredDate
            }
            ServiceManagement.updatecuredPatient(id,HealthStatusData).then(res => {
                alert("Health Status is Updated!!");
                navigate("/medicalDetails");
            })

        } catch (error) {
            alert(error);
        }

    }

    const fetchData = useCallback(async () => {
        try {
            ServiceManagement.getCuredPatients().then(res => {
                let passedData = window.sessionStorage.getItem("AppDetails");
                passedData = JSON.parse(passedData);
                let filteredData = res.data.slice();
                filteredData = filteredData.filter(item => item.patient_id.toLowerCase() == passedData.patientId.toLowerCase());
                filteredData = filteredData.filter(item => item.doctor_id.toLowerCase() == passedData.docId.toLowerCase());
                filteredData = filteredData.filter(item => item.cured.toLowerCase() == 'false');
                setPatientID(filteredData[0].patient_id)
                SetDoctorID(filteredData[0].doctor_id)
                setIllness(filteredData[0].illness)
                setCuredDate(filteredData[0].cured_date)
                setAppointmentDate(filteredData[0].first_appointment_date)
                setCured(filteredData[0].cured)
                setID(filteredData[0]._id)
                setIllnessList(filteredData);
            })
        } catch (error) {
            alert(error);
        };

    }, []);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    //date conversion
    function convertCuredDates(date) {
        console.log('date',date)
        if (!date) {
            return '';
        }
        else {
            return moment(date).format('YYYY-MM-DD');
        }
    }

    const check = () => {
        if (Cured == "true") {
            document.getElementById("curedID").checked = true;
        }
    }

    let IllnessList = illnessList.length > 0
        && illnessList.map((item) => {
            return (
                <option value={item.illness}>{item.illness}</option>
            )
        });

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <Container>
                <div className='list-title' Style={{ marginTop: '50px' }}>
                    <hr />
                    <center>
                        <h2>EDIT PATIENT HEALTH STATUS</h2>
                    </center>
                    <hr />
                    <br /><br />
                </div>
                <div className="row justify-content-md-center">
                    <div className='col-md-4'>
                        <form onSubmit={(e) => editHealthStatus(e)} className={'body-content'}>
                            <Row Style={{ marginTop: '20px' }}>
                                <Col>
                                    <div>
                                        <Form.Group >
                                            <label >Patient ID:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={PatientID} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Doctor ID:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={DoctorID} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Illness/Disease:</label> <br />
                                            <select style={{ marginTop: '5px' }} type="text" className="form-select" value={Illness} onChange={(e) => {
                                                setIllness(e.target.value);
                                                let filtered = illnessList.slice();
                                                filtered = filtered.filter(item => item.illness.toLowerCase() == e.target.value.toLowerCase());
                                                setAppointmentDate(filtered[0].first_appointment_date)
                                                setID(filtered[0]._id)
                                            }} required>
                                                <option value=""></option>
                                                {IllnessList}
                                            </select>
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >First Appointment Date:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={convertCuredDates(AppointmentDate)} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Cured Date:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="date" className="form-control" value={convertCuredDates(CuredDate)} onChange={(e) => {
                                                setCuredDate(e.target.value);
                                            }} required/>
                                        </Form.Group><br />

                                        <Form.Group class="form-group form-check">
                                            <label>
                                                <input type="checkbox" class="form-check-input" value="true" id="curedID" {...check()} onChange={(e) => {
                                                    if (document.getElementById("curedID").checked == false) {
                                                        e.target.value = "false";
                                                    }
                                                    setCured(e.target.value);
                                                }} /> &nbsp;
                                                <span>Cured</span>
                                            </label> <br /><br />
                                        </Form.Group>

                                    </div>

                                    <br />
                                    <Button id='btn-common' variant="primary" type='submit'>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button variant="outline-secondary" onClick={() => { navigate("/medicalDetails") }}>Cancel</Button>

                                </Col>

                            </Row>
                        </form ><br />
                    </div>
                </div>
            </Container >
        </ThemeProvider >
    )
}

export default EditHealthStatus;

