import React from 'react'
import {
    Routes,
    Route,
} from "react-router-dom";
import ArrangeOrder from '../Pages/test/SupplierComponent/ArrangeOrderComponent';
import Test from '../Pages/test/Test';
import Container from '../Components/Container';

function Navigation() {
    return (
        <Routes>
                <Route exact path='/' element={<Test />} />
                <Route exact path='/order/deliveryDetails' element={<Container data={<ArrangeOrder />} />} />
        </Routes>
    )
}

export default Navigation