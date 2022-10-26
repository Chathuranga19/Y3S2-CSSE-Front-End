import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeProvider, Container, Table, Row, Col, Button } from "react-bootstrap";
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from './Pagination';
import "./admin.css";
import ServiceManagement from '../../Axios/DoctorsManagement'
// import NavigationBar from './NavigationBar';
// import TopNavigation from './TopNavigation';

const CuredList = () => {

    const [CuredList, setCuredList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [indexOfFirstItem, setindexOfFirstItem] = useState(0);
    const [indexOfLastItem, setindexOfLastItem] = useState(3);
    const [recordsPerPage] = useState(3);
    const [retrievedData, setretrievedData] = useState([])

    let today = new Date().toLocaleDateString();
    let navigate = useNavigate();

    //fetch details of allocated panels
    const fetchData = useCallback(async () => {
        //let data = sessionStorage.getItem('key');
        try {
            ServiceManagement.getCuredPatients().then(res => {
                console.log(res.data)
                //filterByDoc
                let filterByDoctor = res.data.slice();
                let data = JSON.parse(sessionStorage.getItem("userLoginStorage"))
                filterByDoctor = filterByDoctor.filter(item => item.doctor_id == data.email);

                let filterByCured = filterByDoctor.slice();
                filterByCured = filterByCured.filter(item => item.cured == 'true');
                setCuredList(filterByCured)
                setretrievedData(filterByCured)
            })
        } catch (error) {
            alert(error);
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    //slice retrieved data for the pagination
    const SlicedCuredList = CuredList.slice(indexOfFirstItem, indexOfLastItem);

    //filter data
    const filterData = (obj, key) => {

        const results = obj.filter(o =>
            Object.keys(o).some(k => o[k].toString().toLowerCase().includes(key.toLowerCase())));

        setCuredList(results);

    }

    const handleSearch = (e) => {

        const k = e.target.value.toLowerCase()

        filterData(retrievedData, k);


    }

    return (
        <ThemeProvider breakpoints={['xxxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>

            <Container><br /><br />

                <center>
                    <h2 style={{ fontWeight: '700' }}>CURED PATIENTS LIST</h2>
                </center><br /><br />

                <div class="fontuser" style={{ float: 'right' }}>

                    <input className='main-search' placeholder="Search" type="text" name="search" style={{ width: '400px', height: '40px', marginLeft: '100px' }} onChange={(e) => {
                        handleSearch(e);
                    }} />
                    <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>


                </div><br /><br />


                <Row style={{ marginTop: '50px' }} className='body-content'>
                    {SlicedCuredList.length > 0 ?
                        <Table responsive hover>

                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>First Appointment Date</th>
                                    <th>Cured Date</th>
                                    <th>Illness/Disease</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SlicedCuredList && SlicedCuredList.map((list) => (
                                        <tr>
                                            <td>{list.patient_name}</td>
                                            <td>{list.first_appointment_date}</td>
                                            <td>{list.cured_date}</td>
                                            <td>{list.illness}</td>
                                        </tr>
                                    ))
                                }


                            </tbody>
                        </Table>
                        : <span style={{ display: 'flex', justifyContent: 'center' }}>
                            Cured Patients Unavailable !
                        </span>
                    }
                    <Pagination
                        itemsCount={CuredList.length}
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
        //     </Col>
        // </Row>
    )
}

export default CuredList;

