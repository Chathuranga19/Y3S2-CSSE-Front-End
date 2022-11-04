import React from "react";

const Navbar = () => {
    return (
        <nav style={{backgroundColor:'#FFB400'}} className="navbar navbar-expand-lg navbar">
            <a style={{marginLeft:'16px', fontWeight:'700'}} className="navbar-brand" href="#">
                PCL Builders
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div style={{marginLeft:'750px'}}>
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a style={{fontWeight:'550'}} className="nav-link" href="/request_list/">
                            Home <span className="sr-only"></span>
                        </a>
                    </li>
                    <li style={{fontWeight:'550'}} className="nav-item">
                        <a className="nav-link" href="#">
                        Service
                        </a>
                    </li>
                    <li style={{fontWeight:'550'}} className="nav-item">
                        <a className="nav-link" href="#">
                        Product
                        </a>
                    </li>
                    <li style={{fontWeight:'550'}} className="nav-item">
                        <a className="nav-link" href="#">
                        About
                        </a>
                    </li>
                    <li style={{fontWeight:'550'}} className="nav-item">
                        <a className="nav-link" href="#">
                        Contact
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;