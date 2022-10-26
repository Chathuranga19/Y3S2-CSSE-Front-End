import React from 'react'
import {
    Routes,
    Route,
} from "react-router-dom";
import Test from '../Pages/test/Test';

function Navigation() {
    return (
        <Routes>
                <Route exact path='/' element={<Test />} />
        </Routes>
    )
}

export default Navigation