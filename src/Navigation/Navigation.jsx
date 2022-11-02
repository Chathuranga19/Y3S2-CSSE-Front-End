import React from 'react'
import {
    Routes,
    Route,
} from "react-router-dom";
import ArrangeOrder from '../Pages/SupplierComponent/ArrangeOrderComponent';
import Container from '../Components/Container';

function Navigation() {
    return (
        <Routes>
                <Route exact path='/order/deliveryDetails' element={<Container data={<ArrangeOrder />} />} />
        </Routes>
    )
}

export default Navigation