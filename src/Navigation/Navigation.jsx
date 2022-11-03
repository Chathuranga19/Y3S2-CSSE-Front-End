import React from 'react'
import {
    Routes,
    Route,
} from "react-router-dom";
import Evaluate from '../Pages/procurement_staff/evaluate';
import Items from '../Pages/procurement_staff/items';
import Login from '../Pages/procurement_staff/login';
import RequestList from '../Pages/procurement_staff/request_list';

import ArrangeOrder from '../Pages/SupplierComponent/ArrangeOrderComponent';

import Container from '../Components/Container';

function Navigation() {
    return (
        <Routes>
                <Route exact path='/' element={<Login />} />
                <Route path="/request_list/" element={<Container data={<RequestList/>}/>}/>
                <Route path="/evaluate/:id" element={<Container data={<Evaluate/>}/>}/>
                <Route path="/items/:id" element={<Container data={<Items/>}/>}/>
                <Route exact path='/order/deliveryDetails' element={<Container data={<ArrangeOrder />} />} />
        </Routes>
    )
}

export default Navigation