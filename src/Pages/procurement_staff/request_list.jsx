import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from './Pagination';

export default function RequestList(p) {
  const [appointment, setAppointment] = useState([]);
  const [recordsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexOfFirstItem, setindexOfFirstItem] = useState(0);
  const [indexOfLastItem, setindexOfLastItem] = useState(3);
  function getAppointment() {
    let data = sessionStorage.getItem('userLoginStorage');
    data = JSON.parse(data);
    axios.get("http://localhost:8090/api/v1/d/").then((res) => {
      console.log(res.data);
      setAppointment(res.data)
    })

  }



  useEffect(() => {
    getAppointment();
  }, [])

  const SlicedAllocatedPanels = appointment.slice(indexOfFirstItem, indexOfLastItem);

  return (

    <div>
     
      <br />   <br />
    

      <div className="container">
        <center><h1>Request List</h1></center>
        <br />
        <table className="table ">
          <thead className="table-dark">
            <tr>

              {/* <th >ID</th> */}
           
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Site Address</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Action</th>

            </tr>


          </thead>

          <tbody>
            {SlicedAllocatedPanels.map(val =>
              <tr key={val._id}>
                <td>{val.orderId}</td>
                <td>{val.orderDate}</td>
                <td>{val.siteAddress}</td>
                <td>{val.budget}</td>
                <td>{val.status}</td>

                <td><a className="btn btn-warning" href={"/evaluate/" + val._id}>
                  <i className="fas fa-edit"></i>&nbsp;Action

                  </a>
                </td>
              </tr>
            )}

          </tbody>
        </table>
        <Pagination
          itemsCount={appointment.length}
          itemsPerPage={recordsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setindexOfLastItem={setindexOfLastItem}
          setindexOfFirstItem={setindexOfFirstItem}
          alwaysShown={false}
        />
      </div>

    </div>


  )

}