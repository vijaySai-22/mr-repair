import React, { useEffect, useState } from 'react'
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from '../../firebase';
import { Card, Button, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginOrSignup from '../common/LoginOrSignup';
import { ArrowDownLeftCircleFill } from 'react-bootstrap-icons';
import Out from '../common/Out';
import ScrollButton from '../common/Scroll';

export default function Requests(props) {
  const [requests,setRequests]= useState(null)
    const [x,setX] = useState(0)//onreload useEffect
    useEffect(()=>{
      const fetchData=async()=>{
        let r=[];
        const docSnap = await getDoc(doc(db, "request",`${props.uid}`));
        if (docSnap.exists()) {
          r=docSnap.data().request
          r=r.sort((a,b)=>(a.id < b.id)? 1 : ((b.id < a.id)? -1 : 0));
          setRequests(r);
        } else {}
        setX(1)
      }
      fetchData()
  },[x])
  return (
    <>
      {
        (props.userIn)?
        <>
          {
            (props.userType==='service')?
            <Container style={{padding:'10px',minHeight:'80vh'}}>
              <h1>Requests <ArrowDownLeftCircleFill style={{paddingBottom:'5px'}}/> </h1><hr/>
              <Row lg={4} sm={2} style={{margin:'auto'}}>
                  {
                      (requests!==null)?
                      requests.map((e)=>{return <Cards data={e} key={e.id} uid={props.uid} />})
                      :null
                  }
              </Row>
              <ScrollButton/>
            </Container>:<Out/>
          }
        </>:<LoginOrSignup/>
      }
    </>
  )
}
function Cards(props) {
  const [bg,setBg] = useState()
  const [text,setText] = useState()
  const [status,setStatus] = useState('Pending')
  const [showAcceptBtn,setShowAcceptBtn] = useState(true)
  const [showRejectBtn,setShowRejectBtn] = useState(true)
  const [showScanBtn,setShowScanBtn] = useState(false)

  const reject=async()=>{
    await updateDoc(doc(db, 'history', `${props.data.clientMail}`), {
      history: arrayRemove(props.data)
    });
    await updateDoc(doc(db, 'request', `${props.uid}`), {
        request: arrayRemove(props.data)
    });

    props.data.isRejected=true
    await updateDoc(doc(db, 'history', `${props.data.clientMail}`), {
        history: arrayUnion(props.data)
    });
    await updateDoc(doc(db, 'request', `${props.uid}`), {
        request: arrayUnion(props.data)
    });
    setShowAcceptBtn(false)
    setShowRejectBtn(false)
  }
  const accept=async()=>{
    await updateDoc(doc(db, 'history', `${props.data.clientMail}`), {
      history: arrayRemove(props.data)
    });
    await updateDoc(doc(db, 'request', `${props.uid}`), {
        request: arrayRemove(props.data)
    });

    props.data.isAccepted=true
    await updateDoc(doc(db, 'history', `${props.data.clientMail}`), {
        history: arrayUnion(props.data)
    });
    await updateDoc(doc(db, 'request', `${props.uid}`), {
        request: arrayUnion(props.data)
    });
    setShowAcceptBtn(false)
    setShowRejectBtn(false)
    setShowScanBtn(true)
    setBg('warning')
    setStatus('Work Pending')
  }
  const cancelRejChange=()=>{
    setBg('danger')
    setText('white')
  }
  useEffect((e)=>{
    const hide=()=>{
      setShowRejectBtn(false)
      setShowAcceptBtn(false)
    }
    if(props.data.isAccepted){
      hide()
      setBg('warning')
      setStatus('Work Pending')
    }
    
    if(props.data.isRejected){
      hide()
      cancelRejChange()
      setStatus('Rejected')
    }
    if(props.data.isCancelled){
      hide()
      cancelRejChange()
      setStatus('Cancelled')
    }
    if(props.data.noMoreNeed){
      hide()
      cancelRejChange()
      setStatus('No more need')
    }
    if(props.data.isAccepted && !props.data.noMoreNeed){
      setShowScanBtn(true)
    }
    if(props.data.isCompleted){
      hide()
      setBg('success')
      setText('white')
      setStatus('Completed')
      setShowScanBtn(false)
    }
  },[reject,accept])
  return(
      <Card bg={bg} text={text} style={{ width: '18rem', margin:'10px auto',textAlign:'left' }}>
          <Card.Body>
              <Card.Text>
                  <h5>Status: <u>{status}</u></h5>
                  <h6>Related to: {props.data.problemType}</h6><hr/>
                  <h6>Date: {props.data.date}</h6>
                  <h6>Description: {props.data.problem}</h6>
                  <h6>Mail: {props.data.clientMail}</h6>
                  <h6>Phone: {props.data.clientPhno}</h6>
                  <h6>Address: {props.data.clientAddress}</h6>
              </Card.Text>
                {(showRejectBtn)?<Button variant="danger" onClick={reject}>Reject</Button>:null}
                {(showAcceptBtn)?<Button variant="success" onClick={accept}>Accept</Button>:null}
                {(showScanBtn)?<Button variant="success" as={Link} target='_blank' to={`/scan/${props.data.workerMail}/${props.data.id}`} >Scan</Button>:null}
          </Card.Body>
      </Card>
  )
}