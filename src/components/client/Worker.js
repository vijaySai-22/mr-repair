import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { Card, Table, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function Worker() {
  const {mail} = useParams();
  const [data,setData] = useState()
  const navigate = useNavigate();
  useEffect(()=>{
    async function fetchData(){
      const docRef = doc(db, "serviceusers", `${mail}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data())
      } else {}
    }
    fetchData()
    console.log(data)
  },[])
  
  return (
    <div>
      {
        (data)&&
        <Card style={{ maxWidth: '500px',margin:'auto',textAlign:'left' }}>
          <Card.Header>Worker Details</Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td><h3>Name</h3></td>
                  <td><h4>{data.name}</h4></td>
                </tr>
                <tr>
                  <td><h3>Mail</h3></td>
                  <td><h4>{data.email}</h4></td>
                </tr>    
                <tr>
                  <td><h3>Phone no</h3></td>
                  <td><h4>{data.phno}</h4></td>
                </tr>
                <tr>
                  <td><h3>Address</h3></td>
                  <td><h4>{data.address}</h4></td>
                </tr>
                <tr>
                  <td><h3>Rating</h3></td>
                  <td><h4>{(data.rating.toFixed(2)/data.givenRatings).toFixed(2)}/5</h4></td>
                </tr>
                <tr>
                  <td><h3>Services</h3></td>
                  <td>{data.services.map((e,i=1)=>{return <h4>{i=i+1}. {e}</h4>})}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer>
          <Button variant="warning" style={{width:'100%',margin:'5px'}} onClick={() => navigate(-1)}>
            Back  
          </Button>
          </Card.Footer>
        </Card>
      }
    </div>
  )
}