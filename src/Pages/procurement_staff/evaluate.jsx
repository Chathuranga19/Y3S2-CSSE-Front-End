
import React, { useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios"

export default function Evaluate() {

    const { id } = useParams();
    const [orderId, setorderId] = useState("");
    const [orderDate, setorderDate] = useState("");
    const [siteAddress, setsiteAddress] = useState("");
    const [budget, setbudget] = useState("");
    const [ comment, setcomment] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

  
    useEffect(() => {
        axios.get("http://localhost:8090/api/v1/d/" + id).then((res) => {
       
          setorderId(res.data.orderId)
          setorderDate(res.data.orderDate)
          setsiteAddress(res.data.siteAddress)
          setbudget(res.data.budget)
          setcomment(res.data.comment)
          setStatus(res.data.status)
        
        })
      }, [])
    
      function SendData(e) {
        e.preventDefault();
        if (window.confirm('Are you sure you wish to Accepet this Order?')) {
    
          const newAppointment = {
    
         orderId, 
         orderDate, 
         siteAddress, 
         budget,
         status:'Rejected',
         comment
    
          }
          axios.put("http://localhost:8090/api/v1/d/" + id, newAppointment).then((res) => {
            alert(res.data.status);
            navigate("/request_list/");
          }).catch((err) => {
            alert("update succesfull")
          })
        }
      }



      function SendData2(e) {
        e.preventDefault();
        if (window.confirm('Are you sure you wish to Accepet this Order?')) {
    
          const newAppointment = {
    
         orderId, 
         orderDate, 
         siteAddress, 
         budget,
         status:'accepted',
         comment
    
          }
          axios.put("http://localhost:8090/api/v1/d/" + id, newAppointment).then((res) => {
            alert(res.data.status);
            navigate("/request_list/");
          }).catch((err) => {
            alert("update succesfull")
          })
        }
      }





  return (
    <div>
        <form onSubmit={SendData2}> 

      <div className="container" >
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <span></span>
          <h1 class="h3 mb-0 text-gray-800">Evaluate Oders</h1>
          <span></span>
        </div>
        <hr class="sidebar-divider" />
        <div className="row">
          <div className="card shadow col-md-8 mx-auto">
            <br />
            <div className="card-body">
               
              <form>
                <center>
              <table>
                
                <td>
                <div className='row'>
                  <div>
                    <div className="form-group">
                    <label for="email">Order ID</label>
            <input type="text" value={orderId} className="form-control" id="email" readOnly
              onChange={(e) => {
                setorderId(e.target.value);
              }} required={true} /> 


                <br/>
                 <a className="btn btn-warning" href={"/items/" +id}>
                  <i className="fas fa-edit"></i>&nbsp;Number Of Items
                  </a>
                  <br/> <br/>
                
            <label for="email">Order Date</label>
            <input type="text" value={ orderDate} className="form-control" id="email" readOnly
              onChange={(e) => {
                setorderId(e.target.value);
              }} required={true} />
            <br/>
            <label for="email">Site Address</label>
            <input type="text" value={siteAddress} className="form-control" id="email" readOnly
              onChange={(e) => {
                setorderId(e.target.value);
              }} required={true} />

             <br/>
          
                    </div>   
                  </div>
                </div>
                </td>
                &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;


                <td>
                <div className='row'>
                  <div>
                    <div className="form-group">
               
                
            <label for="email">Budget</label>
            <input type="text" value={budget} className="form-control" id="email" readOnly
            />
            <br/>
            <label for="email">Comment</label>
            <input type="text" value={comment} className="form-control" id="email" 
              onChange={(e) => {
                setcomment(e.target.value);
              }} required={true} />

             <br/>
          
                    </div>   
                  </div>
                </div>
                </td>







                </table>
                </center>
                
     
              </form>
             
            </div>
          </div>
        </div>
      </div>
      <br/>
      <center> 
      <a className="btn btn-danger" onClick={SendData} href={"/request_list/"}>
                <i className="fas fa-edit"></i>Decline
              </a>
              &nbsp;<button type="submit" className="btn btn-primary" disabled={budget>100000}  >Approve</button></center>
     
      </form>
    </div>
    
    )
}
