import React,{useEffect,useState} from 'react'
import WorkerCard from './WorkerCard'
import { Button, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { collection, getDocs } from "firebase/firestore";
import {db} from '../../firebase'
import LoginOrSignup from '../common/LoginOrSignup'
import Out from '../common/Out';
import { useNavigate } from 'react-router-dom';
import ScrollButton from '../common/Scroll';

export default function Service(props) {
  const {worker} = useParams()
  const navigate = useNavigate();
  const [data,setData] = useState([])
  useEffect(()=>{
    async function gettingData(){
      await getDocs(collection(db, 'serviceusers'))
      .then((snapshot)=>{
          let data = []
          snapshot.docs.forEach((doc)=>{
              data.push({...doc.data(),id:doc.id})
          })
          setData(data)
      })
    }
    gettingData()
  },[])
  return (
    <>
      {
        (props.userIn)?
        <>
          {
            (props.userType==='client')?
            <Container style={{padding:'10px',minHeight:'80vh'}}>
              <h1>{worker.charAt(0).toUpperCase() + worker.slice(1)}</h1>
              <Button variant="warning" style={{margin:'5px'}} onClick={() => navigate(-1)}>
                Back  
              </Button>
              <Row md={4} sm={1} style={{margin:'auto'}}>
                {
                  (data)?
                  data.map((e)=>{
                    if(e.services.indexOf(worker)>-1){
                      return <WorkerCard data={e} userDetails={props.userDetails} key={Math.random(0,20)} />
                    }
                  }):null
                }
              </Row>
              <ScrollButton/>
            </Container>:<Out/>
          }
        </>
        :<LoginOrSignup/>
      }
      
    </>
  )
}
