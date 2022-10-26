import React from 'react'
import {
    Routes,
    Route,
} from "react-router-dom";
import Evaluate from '../Pages/procurement_staff/evaluate';
import Items from '../Pages/procurement_staff/items';
import RequestList from '../Pages/procurement_staff/request_list';
import Test from '../Pages/test/Test';

function Navigation() {
    return (
        <Routes>
                <Route exact path='/' element={<Test />} />
                <Route path="/request_list/" element={<RequestList/>}/>
                <Route path="/evaluate/:id" element={<Evaluate/>}/>
                <Route path="/items/:id" element={<Items/>}/>
        </Routes>
    )
}

export default Navigation