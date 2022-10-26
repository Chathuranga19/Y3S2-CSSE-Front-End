import React, { useCallback, useState, useEffect, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { PieChart, Pie, Cell } from "recharts";
import { Bar, Doughnut } from 'react-chartjs-2';
import PrescriptionsTable from '../../Components/PharmacyManagementComponents/PrescriptionsTable';
import { ThemeProvider, Container, Table, Row, Col, Button } from "react-bootstrap";
import { Cpu } from 'react-bootstrap-icons';
import ServiceManagement from '../../Axios/DoctorsManagement'
import moment from 'moment'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import DoctorPieChart from './DoctorPieChart';

export default function DoctorReports() {

    const [piechartData, setpiechartData] = useState([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [acceptedAppointments, setAcceptedAppointments] = useState('');
    const [rejectedAppointments, setRejectedAppointments] = useState('');
    const [curedPatients, setCuredPatients] = useState('');
    const [notCured, setNotCured] = useState('');

    const [januaryTotal, setjanuaryTotal] = useState(0);
    const [febTotal, setfebTotal] = useState(0);
    const [marchTotal, setmarchTotal] = useState(0);
    const [aprilTotal, setaprilTotal] = useState(0);
    const [mayTotal, setmayTotal] = useState(0);
    const [juneTotal, setjuneTotal] = useState(0);
    const [julyTotal, setjulyTotal] = useState(0);
    const [augestTotal, setaugestTotal] = useState(0);
    const [septTotal, setseptTotal] = useState(0);
    const [octTotal, setoctTotal] = useState(0);
    const [novemTotal, setnovemTotal] = useState(0);
    const [decemberTotal, setdecemberTotal] = useState(0);

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

                let curedPercentage = parseFloat((filterByCured.length / filterByDoctor.length) * 100).toFixed(2) + ' %'
                let underMedicationPercentage = parseFloat(((filterByDoctor.length - filterByCured.length) / filterByDoctor.length) * 100).toFixed(2) + ' %'

                setCuredPatients(curedPercentage);
                setNotCured(underMedicationPercentage);

                let overMonth = 0;
                let withinMonth = 0;
                for (let i = 0; i < res.data.length; i++) {
                    let startDate = new Date(convertDates(res.data[i].first_appointment_date));
                    let endDate = new Date(convertDates(res.data[i].cured_date));
                    let calRange = (endDate.getTime() - startDate.getTime()) / 86400000
                    if (calRange > 30) {
                        overMonth = overMonth + 1;
                    }
                    else if (calRange < 30) {
                        withinMonth = withinMonth + 1;
                    }
                }

                function returnData(type) {
                    if (type == 'within') {
                        return withinMonth;
                    }
                    else return overMonth;
                }

                const retrievedData = [
                    { name: "With in a Month", value: returnData('within') },
                    { name: "More than Month", value: returnData() },
                ];

                setpiechartData(retrievedData);
            })

            let data = JSON.parse(sessionStorage.getItem("userLoginStorage"))

            ServiceManagement.getAppointmentsByDocId(data.email).then(res => {
                setTotalAppointments(res.data.length)

                let filterByAccepted = res.data.slice();
                filterByAccepted = filterByAccepted.filter(item => item.status == 'Accepted');

                let filterByRejected = res.data.slice();
                filterByRejected = filterByRejected.filter(item => item.status == 'Canceled');

                let acceptedPercentage = parseFloat((filterByAccepted.length / res.data.length) * 100).toFixed(2) + ' %'
                let rejectedPercentage = parseFloat((filterByRejected.length / res.data.length) * 100).toFixed(2) + ' %'

                setAcceptedAppointments(acceptedPercentage);
                setRejectedAppointments(rejectedPercentage);
                //bar chart dynamic data

                let January = 0; let February = 0; let March = 0; let April = 0; let May = 0; let June = 0; let July = 0; let August = 0; let September = 0; let October = 0; let November = 0; let December = 0;
                for (let i = 0; i < filterByAccepted.length; i++) {
                    let appointmentDate = new Date(convertDates(filterByAccepted[i].date));
                    let monthofAppointement = (appointmentDate.getMonth()) + 1;
                    if (monthofAppointement == 1) {
                        January = January + 1;
                        setjanuaryTotal(January);
                    }
                    else if (monthofAppointement == 2) {
                        February = February + 1;
                        setfebTotal(February);
                    }
                    else if (monthofAppointement == 3) {
                        March = March + 1;
                        setmarchTotal(March);
                    }
                    else if (monthofAppointement == 4) {
                        April = April + 1;
                        setaprilTotal(April);
                    }
                    else if (monthofAppointement == 5) {
                        May = May + 1;
                        setmayTotal(May);
                    }
                    else if (monthofAppointement == 6) {
                        June = June + 1;
                        setjuneTotal(June);
                    }
                    else if (monthofAppointement == 7) {
                        July = July + 1;
                        setjulyTotal(July);
                    }
                    else if (monthofAppointement == 8) {
                        August = August + 1;
                        setaugestTotal(August);
                    }
                    else if (monthofAppointement == 9) {
                        console.log('loopjj', septTotal)
                        September = September + 1;
                        setseptTotal(September);
                    }
                    else if (monthofAppointement == 10) {
                        October = October + 1;
                        setoctTotal(October);
                    }
                    else if (monthofAppointement == 11) {
                        November = November + 1;
                        setnovemTotal(November);
                    }
                    else if (monthofAppointement == 12) {
                        December = December + 1;
                        setdecemberTotal(December);
                    }
                }

            })

        } catch (error) {
            alert(error);
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend
    );

    /**
     * Bar chart
     */

    //date conversion
    function convertDates(date) {
        if (!date) {
            return '';
        }
        else {
            return moment(date).format('YYYY/MM/DD');
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: '',
            },
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: [januaryTotal, febTotal, marchTotal, aprilTotal, mayTotal, juneTotal, julyTotal, augestTotal, septTotal, octTotal, novemTotal, decemberTotal],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            },
        ],
    };

    /**
     * Doughnut chart
     */

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const RADIAN = Math.PI / 180;


    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="black"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    const data1 = {
        labels: ['March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [
            {
                label: '# of Votes',
                data: [14515, 13780, 18820, 9870, 20250, 17550],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const pdfExportComponent = useRef(null);

    const generateReport = () => {

        pdfExportComponent.current.save();

    }

    return (
        <div>

            <div className="container">
                <PDFExport fileName='Doctor_Activity_Management_Report' ref={pdfExportComponent}>
                    <>
                        <div class="d-sm-flex align-items-center justify-content-between mb-4">
                            <span></span>
                            <h1 class="h3 mb-0 text-gray-800">REPORTS</h1>
                            <span></span>
                        </div>
                        <hr class="sidebar-divider" />

                        {/* three cards */}

                        <Row>

                            <Col>
                                <div className="card shadow">
                                    <div className='card-header bg-success'></div>
                                    <div className="card-body">
                                        <div className='card-title text-success text-center font-weight-bold'>TOTAL APPOINTMENTS</div>
                                        <h5 className='h5 mb-0 font-weight-bold text-gray-800 text-center'>{totalAppointments}</h5>
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className="card shadow">
                                    <div className='card-header bg-warning'></div>
                                    <div className="card-body">
                                        <div className='card-title text-warning text-center font-weight-bold'>ACCEPTED APPOINTMENTS</div>
                                        <h5 className='h5 mb-0 font-weight-bold text-gray-800 text-center'>{acceptedAppointments}</h5>
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className="card shadow">
                                    <div className='card-header bg-info'></div>
                                    <div className="card-body">
                                        <div className='card-title text-info text-center font-weight-bold'>REJECTED APPOINTMENTS</div>
                                        <h5 className='h5 mb-0 font-weight-bold text-gray-800 text-center'>{rejectedAppointments}</h5>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                        <br />

                        <Row>

                            <Col>
                                <div className="card shadow">
                                    <div className='card-header bg-secondary'></div>
                                    <div className="card-body">
                                        <div className='card-title text-secondary text-center font-weight-bold'>CURED PATIENTS </div>
                                        <h5 className='h5 mb-0 font-weight-bold text-gray-800 text-center'>{curedPatients}</h5>
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className="card shadow">
                                    <div className='card-header bg-primary'></div>
                                    <div className="card-body">
                                        <div className='card-title text-primary text-center font-weight-bold'>PATIENTS UNDER MEDICATION</div>
                                        <h5 className='h5 mb-0 font-weight-bold text-gray-800 text-center'>{notCured}</h5>
                                    </div>
                                </div>
                            </Col>
                            <Col />

                        </Row>
                        <br /><br /><br /><br />

                        {/* charts */}

                        <Row>
                            <Col xs={'auto'} />
                            <center>
                                <Col xs={7}>
                                    <div className='card shadow'>
                                        <div className='card-header bg-light font-weight-bold text-gray-800 text-center'>MONTHLY TOTAL PATIENTS </div>
                                        <div className='card-body'>

                                            <Bar options={options} data={data} />

                                        </div>

                                    </div>
                                </Col>
                            </center>
                            <Col xs={'auto'} />
                        </Row>

                        <br /><br /><br /><br />

                        {/* piechart */}
                        <Row>
                            <Col xs={'auto'} />
                            <center>
                                <Col xs={6}>

                                    <div class="card shadow mb-4">
                                        <div
                                            class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 style={{ textAlign: 'center' }} class="m-0 font-weight-bold text-primary"> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;TIME FOR PATIENTS TO RECOVER FROM ILLNESSES</h6>
                                            <div class="dropdown no-arrow">
                                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                    aria-labelledby="dropdownMenuLink">
                                                    <div class="dropdown-header">Dropdown Header:</div>
                                                    <a class="dropdown-item" href="#">Action</a>
                                                    <a class="dropdown-item" href="#">Another action</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <DoctorPieChart />
                                        </div>
                                    </div>

                                </Col>
                            </center>
                            <Col xs={'auto'} />
                        </Row>
                    </>
                </PDFExport>
                <button className="btn btn-success" style={{ marginLeft: 600, width: "8%", textAlign: 'center', color: 'white' }} onClick={() => { generateReport() }}>Print</button>

                <br /><br /><br /><br />


                <br />

                {/* <div className='row'>

                    <div className='col'>
                        <div className='card shadow'>
                            <div className='card-header bg-secondary text-white font-weight-bold text-gray-800'>RECENT PRESCRIPTIONS</div>
                            <div className='card-body'>

                                <PrescriptionsTable />

                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <br />

        </div >

    )
}
