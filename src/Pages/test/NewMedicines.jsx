import React, { useState, useEffect } from 'react'
import { Row, Col, Button } from "react-bootstrap";
import PharmacyManagement from '../../Axios/PharmacyManagement';
import Select from 'react-select';

const NewMedicines = ({ setOpen, Medications, setMedications }) => {

    const [Medicines, setMedicines] = useState("");
    const [Quantity, setQunatity] = useState("");
    const [MedicinesList, setMedicinesList] = useState([]);

    useEffect(() => {
        //Access medicines dynamically from the database and assigned to varaible
        PharmacyManagement.getStocks()
            .then(res => {
                let medicines = res.data.map((data) => { return (data.medicine) })
                let dataSet = [];
                for (let i = 0; i < res.data.length; i++) {
                    dataSet.push({
                        value: medicines[i],
                        label: medicines[i]
                    });

                }

                setMedicinesList(dataSet)
            })

    }, [])

    console.log('select', MedicinesList)

    const AddNewMedication = () => {

        if (Medications != '') {
            setMedications(Medications + ', ' + Medicines.value + '(' + Quantity + ')');
        }
        else {
            setMedications(Medicines.value + '(' + Quantity + ')');
        }
        handleClose();
    }

    const handleClose = () => setOpen(false);


    const IllnessHandler = (selectedOption) => {
        setMedicines(selectedOption);
    }

    return (
        <div>
            <br />

            <Row>
                <Col>
                    <label style={{ marginBottom: '10px' }}>Medicines:</label><br />
                    <Select
                        value={Medicines}
                        onChange={IllnessHandler}
                        options={MedicinesList}
                    />
                </Col>

            </Row>< br />< br />

            <Row>
                <Col>
                    <label style={{ marginBottom: '10px' }}>Quantity: </label><br />
                    <input className="form-control" style={{ width: '270px' }} type="text" value={Quantity} onChange={(e) => {
                        setQunatity(e.target.value);
                    }} required />
                </Col>

            </Row>< br />< br />

            <Button type='submit' style={{ float: "left", marginLeft: "1px", width: '90px' }} variant="info" onClick={() => {
                AddNewMedication()
            }} >
                Save
            </Button> &nbsp;

            <Button style={{ float: "left", marginLeft: "10px" }} variant="outline-secondary" onClick={() => {
                handleClose();
            }}>Cancel</Button>

        </div>
    )
}

export default NewMedicines;
