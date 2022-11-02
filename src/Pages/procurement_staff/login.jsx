import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserManagement from '../../Axios/UserManagement'

function Login() {
    const [inputs, setInputs] = useState({});

    const navigation = useNavigate();

    const inputHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setInputs(values => ({ ...values, [name]: value }))
    }

    const logUser = (e) => {
        e.preventDefault()

        console.log(inputs, "asdasd")

        UserManagement.loginUser(inputs).then(res => {
            if (res.data == []) {
                window.alert(`User account does not exist. Please try again!`)
            } else {
                console.log(res.data)
                sessionStorage.setItem("userLoginStorage", JSON.stringify(res.data));
                if (res.data.userType == 'admin')
                    navigation('/request_list/')
                if (res.data.userType == 'supplier')
                    navigation('/order/deliveryDetails')
                if (res.data.userType == 'patient')
                    navigation('/patient-home')
                if (res.data.userType == 'doctor')
                    navigation('/onGoingAppointments')
            }
        })
    }



    return (
        <div>
            <body>

                <div class="container">


                    <div class="row justify-content-center">

                        <div class="col-xl-10 col-lg-12 col-md-9">
                            <br />
                            <br />

                            <br />
                            <div class="card o-hidden border-0 shadow-lg my-5">
                                <div class="card-body p-0">

                                    <div class="row">
                                        <div class="col-lg-6 d-none d-lg-block">
                                            <img width={"110%"} height={"100%"} src="https://cdns.sipmm.edu.sg/publication/wp-content/uploads/2021/10/15180817/Smart-Procurement-Construction-SIPMM.jpg" />
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="p-5">
                                                <div class="text-center">
                                                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                </div>
                                                <br />


                                                <form class="user" onSubmit={logUser}>
                                                    <div class="form-group">
                                                        <input type="email" class="form-control form-control-user" name='email' onChange={inputHandler}
                                                            placeholder="Enter Email Address" required />
                                                    </div>

                                                    <div class="form-group">
                                                        <input type="password" class="form-control form-control-user" name='password' onChange={inputHandler}
                                                            placeholder="Enter Password" required />
                                                    </div>
                                                    {/* <div class="form-group">
                                                        <div class="custom-control custom-checkbox small">
                                                            <input type="checkbox" class="custom-control-input" id="customCheck" />
                                                            <label class="custom-control-label" for="customCheck">Remember
                                                                Me</label>
                                                        </div>
                                                    </div> */}
                                                    <br />
                                                    <br />
                                                    <input type="submit" class="btn btn-primary btn-user btn-block" value="Login" />


                                                </form>
                                                <hr />

                                                <div class="text-center">
                                                    <a class="small" href="/register">Create an Account!</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


            </body>



        </div>



    )
}

export default Login