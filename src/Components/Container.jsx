import React from 'react'
import TopNavigation from './Header'

//container to act as a compount component which dispalys top navigation with each content
function Container({ data }) {
    return (
        <div id="page-top">
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopNavigation />
                        {/* Content Route */}
                        {data}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Container