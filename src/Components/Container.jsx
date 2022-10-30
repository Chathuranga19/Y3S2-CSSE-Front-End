import React from 'react'
import TopNavigation from './Header'

function Container({ data }) {
    return (
        <body id="page-top">
            <div id="wrapper">
                <div id="content-wrapper" class="d-flex flex-column">
                    <div id="content">
                        <TopNavigation />
                        {/* Content Route */}
                        {data}
                    </div>
                </div>
            </div>
        </body>
    )
}

export default Container