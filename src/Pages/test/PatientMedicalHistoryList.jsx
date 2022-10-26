import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ThemeProvider, Container, Table, Row, Col, Button } from "react-bootstrap";
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from './Pagination';
import "./admin.css";
import moment from 'moment'
import ServiceManagement from '../../Axios/DoctorsManagement'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ListMedicalHistory = () => {

    const [MedicalHistory, setMedicalHistory] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [indexOfFirstItem, setindexOfFirstItem] = useState(0);
    const [indexOfLastItem, setindexOfLastItem] = useState(3);
    const [recordsPerPage] = useState(3);
    const [retrievedData, setretrievedData] = useState([])
    const [patientName, setPatientName] = useState("");
    const [loggedDocId, setloggedDocId] = useState("");
    const [curedList, setcuredList] = useState([]);

    let today = new Date().toLocaleDateString();
    let navigate = useNavigate();

    //fetch details of allocated panels
    const fetchData = useCallback(async () => {
        try {
            let doctorID = JSON.parse(sessionStorage.getItem("userLoginStorage"))
            setloggedDocId(doctorID.email);
            let patientID = sessionStorage.getItem("patientID");
            let passedData = window.sessionStorage.getItem("AppDetails");
            passedData = JSON.parse(passedData);
            setPatientName(passedData.patientName);
            ServiceManagement.getMedicationById(patientID).then(res => {
                setMedicalHistory(res.data)
                setretrievedData(res.data)
            })
            const result = await axios.get("http://localhost:8090/api/v1/curedPatients");
            setcuredList(result.data);

        } catch (error) {
            alert(error);
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    //date conversion
    function convertDates(date) {
        if (!date) {
            return '';
        }
        else {
            return moment(date).format('DD/MM/YYYY');
        }
    }

    //slice retrieved data for the pagination
    const SlicedMedicalHistory = MedicalHistory.slice(indexOfFirstItem, indexOfLastItem);

    //filter data
    const filterData = (obj, key) => {

        const results = obj.filter(o =>
            Object.keys(o).some(k => o[k].toString().toLowerCase().includes(key.toLowerCase())));

        setMedicalHistory(results);

    }

    const handleSearch = (e) => {

        const k = e.target.value.toLowerCase()

        filterData(retrievedData, k);


    }

    //date conversion
    function convertDates(date) {
        if (!date) {
            return '';
        }
        else {
            return moment(date).format('DD/MM/YYYY');
        }
    }

    function handleHidden(doctorID, AppDate) {
        if (doctorID == loggedDocId && convertDates(AppDate) == convertDates(today)) {
            return false;
        }
        else {
            return true;
        }
    }

    //delete medicalRecord
    const onDeletemedicalRecord = async (id) => {


        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure, you want to remove the selected medical record?',
            buttons: [
                {
                    label: 'No',
                    onClick: () => navigate('/medicalDetails')
                },
                {
                    label: 'Yes',
                    onClick: () => ServiceManagement.getMedicationRecordById(id)
                        .then(res => {
                            let medicationRecord = res.data;
                            ServiceManagement.deleteMedicalRecord(id).then(res => {
                                alert("Selected medical record is removed from the system!!");
                                fetchData();
                            })

                            ServiceManagement.getCuredPatients().then(res => {
                                let curedList = res.data;
                                let filteredData = curedList.slice();
                                filteredData = filteredData.filter(item => item.patient_id.toLowerCase() == medicationRecord.patient_id.toLowerCase());
                                filteredData = filteredData.filter(item => item.doctor_id.toLowerCase() == medicationRecord.doctor_id.toLowerCase());
                                filteredData = filteredData.filter(item => item.illness.toLowerCase() == medicationRecord.illness.toLowerCase());
                                filteredData = filteredData.filter(item => convertDates(item.first_appointment_date) == convertDates(medicationRecord.appointment_date));
                                if (filteredData.length == 1) {
                                    ServiceManagement.deleteCuredDetails(filteredData['0']._id);
                                }
                            })
                        })
                }
            ]
        });


        // if (window.confirm('Are you sure, you want to remove the selected medical record?')) {
        //     try {
        //         ServiceManagement.getMedicationRecordById(id).then(res => {
        //             let medicationRecord = res.data;
        //             ServiceManagement.deleteMedicalRecord(id).then(res => {
        //                 alert("Selected medical record is removed from the system!!");
        //                 fetchData();
        //             })

        //             ServiceManagement.getCuredPatients().then(res => {
        //                 let curedList = res.data;
        //                 let filteredData = curedList.slice();
        //                 filteredData = filteredData.filter(item => item.patient_id.toLowerCase() == medicationRecord.patient_id.toLowerCase());
        //                 filteredData = filteredData.filter(item => item.doctor_id.toLowerCase() == medicationRecord.doctor_id.toLowerCase());
        //                 filteredData = filteredData.filter(item => item.illness.toLowerCase() == medicationRecord.illness.toLowerCase());
        //                 filteredData = filteredData.filter(item => convertDates(item.first_appointment_date) == convertDates(medicationRecord.appointment_date));
        //                 if (filteredData.length == 1) {
        //                     ServiceManagement.deleteCuredDetails(filteredData['0']._id);
        //                 }
        //             })
        //         })

        //     } catch (error) {
        //         alert(error)
        //     }
        // }
    }

    const getLength = async () => {

        try {
            const result = await axios.get("http://localhost:8090/api/v1/curedPatients");
            console.log('jj11', result.data)
            let patientID = sessionStorage.getItem("patientID");
            let filteredData = result.data.slice();
            filteredData = filteredData.filter(item => item.patient_id.toLowerCase() == patientID.toLowerCase());
            filteredData = filteredData.filter(item => item.doctor_id.toLowerCase() == loggedDocId.toLowerCase());
            filteredData = filteredData.filter(item => item.cured.toLowerCase() == 'false');
            console.log('ll', filteredData.length)
            if (filteredData.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            alert(err);
        }
    }

    function checkRecords() {

        console.log('jj11', curedList)
        let patientID = sessionStorage.getItem("patientID");
        let filteredData = curedList.slice();
        filteredData = filteredData.filter(item => item.patient_id.toLowerCase() == patientID.toLowerCase());
        filteredData = filteredData.filter(item => item.doctor_id.toLowerCase() == loggedDocId.toLowerCase());
        filteredData = filteredData.filter(item => item.cured.toLowerCase() == 'false');
        if (filteredData.length > 0) {
            console.log('ll', filteredData.length)
            return false;
        }
        else {
            return true;
        }
    }

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <Container><br /><br />

                <center>
                    <h2 style={{ fontWeight: '700' }}>PATIENT MEDICAL HISTORY</h2>
                </center><br /><br /><br />

                <div class="fontuser" style={{ float: 'right' }}>

                    <input className='main-search' placeholder="Search" type="text" name="search" style={{ width: '400px', height: '40px', marginLeft: '100px' }} onChange={(e) => {
                        handleSearch(e);
                    }} />
                    <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>


                </div><br /><br />


                <Row className="list-title">
                    <Col>
                        <h5 style={{ marginTop: '10px', fontWeight: '500', fontSize: '17px', marginLeft: '18px' }}>Patient Name: {patientName}</h5>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link style={{ marginRight: '10px' }} className='btn btn-outline-primary' to={("/medication/create")}>Add New Record</Link>
                        <Link hidden={checkRecords()} className='btn btn-outline-primary' to={("/healthStatus/edit")} >Edit Health Status</Link>
                    </Col>
                </Row>


                <Row style={{ marginTop: '50px' }} className='body-content'>
                    {SlicedMedicalHistory.length > 0 ?
                        <Table responsive hover>

                            <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>Doctor Name</th>
                                    <th>Illness/Disease</th>
                                    <th>Appointment Date</th>
                                    <th>Appointment Time</th>
                                    <th>Medication</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SlicedMedicalHistory && SlicedMedicalHistory.map((data) => (
                                        <tr>
                                            <td>{data.appointment_id}</td>
                                            <td>{data.doctor_name}</td>
                                            <td>{data.illness}</td>
                                            <td>{convertDates(data.appointment_date)}</td>
                                            <td>{data.appointment_time}</td>
                                            <td>{data.medications}</td>
                                            <td>  <Link hidden={handleHidden(data.doctor_id, data.appointment_date)} to={`/medication/edit/${data._id}`} ><FontAwesomeIcon icon={faPenToSquare} /></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <Link hidden={handleHidden(data.doctor_id, data.appointment_date)} to={""} onClick={() => {
                                                    onDeletemedicalRecord(data._id)
                                                }} ><FontAwesomeIcon icon={faTrashCan} /></Link>
                                            </td>
                                        </tr>
                                    ))
                                }


                            </tbody>
                        </Table>
                        : <span style={{ display: 'flex', justifyContent: 'center' }}>
                            Medical Records Unavailable !
                        </span>
                    }
                    <Pagination
                        itemsCount={MedicalHistory.length}
                        itemsPerPage={recordsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setindexOfLastItem={setindexOfLastItem}
                        setindexOfFirstItem={setindexOfFirstItem}
                        alwaysShown={false}
                    />
                </Row>
            </Container>
        </ThemeProvider >

    )
}

export default ListMedicalHistory;

