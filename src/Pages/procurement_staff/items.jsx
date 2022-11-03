import React, { useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios"

export default function Items() {

    const { id } = useParams();

    const [items, setitems] = useState("");
    const navigate = useNavigate();

  
    useEffect(() => {
        axios.get("http://localhost:8090/api/v1/d/" + id).then((res) => {
       
          setitems(res.data.items)
        })
      }, [])
    
    
  return (
    <div>
    <div>
      
    </div>
    <br />   <br />
    
    <br />
    <center>
      
        <div className="container">
          <div className='col mx-auto'>
            <div className="card shadow">
              <div className='card-header bg-success'></div>
              <div className="card-body">
                <div className=''>Number Of Items</div>
                <br/> 
                <center>  {items} </center>
              </div>
            </div>
          </div>
        </div>

     
    </center>

    <br/> 

   <center>
    <a className="btn btn-danger" href={"/evaluate/"+id}>
  <i className="fas fa-edit"></i>&nbsp;Back
  </a>
  </center>
  </div>


    )
}
