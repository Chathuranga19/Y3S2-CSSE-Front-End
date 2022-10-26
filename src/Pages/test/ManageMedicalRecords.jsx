import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeProvider, Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SlidView from './SlidView';
import NewMedicines from './NewMedicines';
import ServiceManagement from '../../Axios/DoctorsManagement'
import moment from 'moment'
import { diseases } from './DiseasesList';
import Select from 'react-select';

const ManageMedications = () => {

    let navigate = useNavigate();
    const { id } = useParams();
    const isAdd = !id;

    const [PatientID, setPatientID] = useState("")
    const [DoctorID, setDoctorID] = useState("")
    const [PatientName, setPatientName] = useState("")
    const [DoctorName, setDoctorName] = useState("");
    const [AppointmentID, setAppointmentID] = useState("")
    const [AppointmentDate, setAppointmentDate] = useState("")
    const [AppointmentTime, setAppointmentTime] = useState("")
    const [Illness, setIllness] = useState("");
    const [Medications, setMedications] = useState("");
    const [CuredList, setCuredList] = useState([]);
    const [show, setShow] = useState(false);

    function submitedDetails(e) {
        return isAdd
            ? createMedicalRecord(e)
            : updateMedicalRecord(id, e)
    }

    function handleCuredPatients() {
        for (let i = 0; i < CuredList.length; i++) {
            if (CuredList[i].doctor_id == DoctorID && CuredList[i].patient_id == PatientID &&
                CuredList[i].illness == Illness && CuredList[i].cured == 'false') {
                console.log('vv1')
                return true;
            }
        }
        return false;
    }

    const createMedicalRecord = async (e) => {
        e.preventDefault();
        try {
            const data = {
                patient_id: PatientID,
                doctor_id: DoctorID,
                patient_name: PatientName,
                doctor_name: DoctorName,
                appointment_id: AppointmentID,
                appointment_date: AppointmentDate,
                appointment_time: AppointmentTime,
                illness: Illness.value,
                medications: Medications
            }

            console.log('data', data)

            const response = await axios.post("http://localhost:8090/api/v1/patientMedication/", data)

            if (response.status === 201) {
                alert('Medical Record Successfully created!');
                const result = handleCuredPatients();
                if (result == true) {
                    navigate("/medicalDetails");
                }
                if (result == false) {
                    const data = {
                        patient_id: PatientID,
                        doctor_id: DoctorID,
                        patient_name: PatientName,
                        doctor_name: DoctorName,
                        first_appointment_date: AppointmentDate,
                        cured: 'false',
                        cured_date: '11/11/9999',
                        illness: Illness.value
                    }

                    ServiceManagement.insertCuredPatient(data).then(res => {
                        if (res.data) {
                            navigate("/medicalDetails");
                        }
                    })
                    navigate("/medicalDetails");
                }

            }

        } catch (error) {
            if (error.response.status === 409) {
                alert(error.response.data.message);
            } else {
                alert(error);
            }
        }

    }

    const updateMedicalRecord = async (id, e) => {
        try {
            e.preventDefault();

            const updatMedicalRecords = {
                medications: Medications
            }

            ServiceManagement.updateMedicationRecordById(id, updatMedicalRecords).then(res => {
                if (res.data) {
                    alert('Medical Record Successfully updated!');
                    navigate("/medicalDetails");
                }
            })

        } catch (error) {
            alert(error);
        }

    }

    const fetchData = useCallback(async () => {
        if (!isAdd) {
            try {
                ServiceManagement.getMedicationRecordById(id).then(res => {
                    let record = res.data;
                    setPatientID(record.patient_id)
                    setPatientName(record.patient_name)
                    setDoctorID(record.doctor_id)
                    setDoctorName(record.doctor_name)
                    setAppointmentTime(record.appointment_time)
                    setAppointmentDate(record.appointment_date)
                    setIllness(record.illness)
                    setMedications(record.medications)
                    setAppointmentID(record.appointment_id)
                })
            } catch (error) {
                alert(error);
            };
        }
        if (isAdd) {
            let passedData = window.sessionStorage.getItem("AppDetails");
            passedData = JSON.parse(passedData);
            setAppointmentID(passedData.appID);
            setAppointmentDate(passedData.appDate);
            setAppointmentTime(passedData.appTime);
            setDoctorID(passedData.docId);
            setDoctorName(passedData.docName);
            setPatientID(passedData.patientId);
            setPatientName(passedData.patientName);

            ServiceManagement.getCuredPatients().then(res => {
                setCuredList(res.data);
            })
        }

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

    const handleViewClose = () => {
        setShow(false);
    }

    const setErase = () => {
        setMedications('');
    }

    const IllnessHandler = (selectedOption) => {
        setIllness(selectedOption);
    }

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <Container>
                <div className='list-title' Style={{ marginTop: '50px' }}>
                    <hr />
                    <center>
                        <h2 style={{ fontWeight: '600' }}>{isAdd ? 'INSERT PATIENT MEDICAL DETAILS' : 'EDIT PATIENT MEDICAL DETAILSs'}</h2>
                    </center>
                    <hr />
                    <br /><br />
                </div>
                <div className="row justify-content-md-center">
                    <div className='col-md-4'>
                        <form onSubmit={(e) => submitedDetails(e)} className={'body-content'}>
                            <Row Style={{ marginTop: '20px' }}>
                                <Col>
                                    <div>
                                        <Form.Group >
                                            <label >Appointment ID:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={AppointmentID} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Appointment Date:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={convertDates(AppointmentDate)} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Appointment Time:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={AppointmentTime} disabled />
                                        </Form.Group><br />

                                        <Form.Group >
                                            <label >Patient Name:</label> <br />
                                            <input style={{ marginTop: '5px' }} type="text" className="form-control" value={PatientName} disabled />
                                        </Form.Group><br />

                                        {isAdd &&
                                            <>
                                                <Form.Group >
                                                    {/* <label >Illness/Disease:</label> <br /> */}
                                                    {/* <select style={{ marginTop: '5px' }} type="text" className="form-select" value={Illness} onChange={(e) => {
                                                        setIllness(e.target.value);
                                                    }} required >
                                                        <option value=""></option>
                                                        {diseases.map((item) => {
                                                            return <option value={item.DISEASE}>{item.DISEASE}</option>
                                                        })}
                                                    </select>
                                                </Form.Group><br />

                                                <Form.Group > */}
                                                    <label >Illness/Disease:</label> <br />
                                                    <Select
                                                        value={Illness}
                                                        onChange={IllnessHandler}
                                                        maxMenuHeight={150}
                                                        minMenuHeight={50}
                                                        options={diseases}
                                                    />
                                                </Form.Group><br />
                                            </>
                                        }

                                        {!isAdd &&
                                            <>
                                                <Form.Group >
                                                    <label >Illness/Disease:</label> <br />
                                                    <input style={{ marginTop: '5px' }} type="text" className="form-control" value={Illness} disabled />
                                                </Form.Group><br />
                                            </>
                                        }

                                        <Form.Group >
                                            <label >Medications:</label> <br />
                                            <Row>
                                                <Col xs={'auto'}>
                                                    <textarea style={{ width: '325px', marginTop: '5px', backgroundColor: 'white' }} className="form-control" type="number" value={Medications} required />
                                                </Col>
                                                <Col xs={'auto'}>
                                                    <Link style={{ marginTop: '2px' }} to={""} onClick={() => {
                                                        setShow(true);
                                                    }} ><FontAwesomeIcon icon={faPlus} /></Link><br />
                                                    <Link style={{ marginTop: '20px' }} to={""} onClick={() => {
                                                        setErase();
                                                    }}> <FontAwesomeIcon icon={faTrashCan} /></Link>
                                                </Col>
                                            </Row>
                                        </Form.Group><br />

                                    </div>

                                    <br />
                                    <Button id='btn-common' variant="primary" type='submit'>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button variant="outline-secondary" onClick={() => { navigate("/medicalDetails") }}>Cancel</Button>

                                </Col>

                            </Row>
                        </form ><br />
                    </div>
                    <SlidView
                        show={show}
                        width={`20%`}
                        handleClose={handleViewClose}
                        placement={'end'}
                        title={"Add New Medication"}
                        body={<NewMedicines
                            setOpen={handleViewClose}
                            Medications={Medications}
                            setMedications={setMedications}
                        />}>
                    </SlidView>
                </div>
            </Container >
        </ThemeProvider >
    )
}

export default ManageMedications;

