
import React, { useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios"

export default function Evaluate() {

    const { id } = useParams();
    const [order_id, setorderId] = useState("");
    const [order_date, setorderDate] = useState("");
    const [address, setsiteAddress] = useState("");
    const [budget, setbudget] = useState("");
    const [ comment, setcomment] = useState("");
    const [status, setStatus] = useState("");
    const [supplier_status, setDStatus] = useState("");
    const [company, setcompany] = useState("");
    const [depot, setdepot] = useState("");
    const navigate = useNavigate();

    var bgColors = { "Default": "#81b71a",
    
    
    "Gray": "#F4F7FC",
    "cream": "#FFF4DB",
  
};
  
    useEffect(() => {
        axios.get("http://localhost:8090/api/v1/d/" + id).then((res) => {
       
          setorderId(res.data.order_id)
          setorderDate(res.data.order_date)
          setsiteAddress(res.data.address)
          setbudget(res.data.budget)
          setcomment(res.data.comment)
          setStatus(res.data.status)
          setDStatus(res.data.supplier_status)
          setcompany(res.data.company)
          setdepot(res.data.depot)
        })
      }, [])
    
      function SendData(e) {
        e.preventDefault();
        if (window.confirm('Are you sure you wish to Accepet this Order?')) {
    
          const newAppointment = {
    
         order_id, 
         order_date, 
         address, 
         budget,
         status:'Rejected',
         comment,
         supplier_status,
         company,
         depot
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
    
         order_id, 
         order_date, 
         address, 
         budget,
         status:'Accepted',
         supplier_status,
         company,
         comment,
         depot,
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
    <div style={{backgroundColor: bgColors.Gray } }>
        <br />  <br />   <br /> 
    <div >
        <form onSubmit={SendData2}> 

      <div className="container" >
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <span></span>
          <h1 class="h3 mb-0 text-gray-800">Evaluate Oders</h1>
          <span></span>
        </div>

        <div className="row">
          <div className="">
            <br />
            <div className="card-body">
            <center>
              <form style={{backgroundColor: bgColors.cream , width: '700px', height: '350px'} }>
                <center>
              <table>
                
                <td>
                <div className='row'>
                  <div>
                    <div className="form-group">
                    <label  style={{ width: '260px'} }for="email">Order ID</label>
            <input type="text" value={order_id} className="form-control" id="email" readOnly
              onChange={(e) => {
                setorderId(e.target.value);
              }} required={true} /> 


                <br/>
                 <a className="btn btn-warning"style={{ width: '260px' } } href={"/items/" +id}>
                  <i className="fas fa-edit" ></i>&nbsp;Number Of Items
                  </a>
                  <br/> <br/>
                
            <label  for="email">Order Date</label>
            <input type="text" value={ order_date} className="form-control" id="email" readOnly
              onChange={(e) => {
                setorderId(e.target.value);
              }} required={true} />
            <br/>
            <label for="email">Site Address</label>
            <input type="text" value={address} className="form-control" id="email" readOnly
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
             <h6 className='text-danger' hidden ={budget<=100000}> Allocated Budget RS:100000 is exeeded   </h6>
            
            <label style={{ width:'260px',height:'40px'} } for="email"   >Comment</label>
            <textarea type="text" placeholder="Add Comment" value={comment} className="form-control" id="email" 
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
              </center>
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
    </div>
    )
}
