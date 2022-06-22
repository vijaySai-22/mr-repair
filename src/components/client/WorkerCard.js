import React,{ useState} from 'react'
import { Card, Button, Modal } from 'react-bootstrap'
import { arrayUnion, doc, updateDoc } from '@firebase/firestore'
import { db } from '../../firebase'
import { Link } from 'react-router-dom';

export default function WorkerCard(props) {
  const [show, setShow] = useState(false);
  const [problem,setProblem] = useState('')
  const handleShow = () => setShow(true);

  const handleClose = () =>{
    setShow(false);
    setProblem('')
  }
  const [problemType,setProblemType] = useState('')
  const changeProblem=(e)=>{
    setProblem(e.target.value)
  }

  const sendRequest=()=>{
    async function sendReq(){
      try {
        const d = new Date()
        let month=d.getMonth()+1;
        let day;
        let hr;
        let min;
        let sec;
        if (month < 10){ month = '0' + month;} else { month = month;}
        if (d.getDate() < 10){ day = '0' + d.getDate();} else { day = d.getDate();}
        if (d.getHours() < 10) { hr = '0' + d.getHours();} else { hr = d.getHours();}
        if (d.getMinutes() < 10) { min = '0' + d.getMinutes();} else { min = d.getMinutes();}
        if (d.getSeconds() < 10) { sec = '0' + d.getSeconds();} else { sec = d.getSeconds();}
        const setDateAsId = `${d.getFullYear()}${month}${day}${hr}${min}${sec}`
        const date= `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        await updateDoc(doc(db,'history',`${props.userDetails.email}`),{
          history: arrayUnion({
            id:parseInt(setDateAsId),
            problem:problem,
            problemType:problemType,
            clientMail:props.userDetails.email,
            clientName:props.userDetails.name,
            clientAddress:props.userDetails.address,
            clientPhno:props.userDetails.phno,
            workerMail:props.data.email,
            workerName:props.data.name,
            workerPhno:props.data.phno,
            date: date,
            isAccepted:false,
            isRejected:false,
            isCompleted:false,
            isCancelled:false,
            noMoreNeed:false,
            isRated:false,
          })
        })
        await updateDoc(doc(db,'request',`${props.data.email}`),{
          request: arrayUnion({
            id:parseInt(setDateAsId),
            problem:problem,
            problemType:problemType,
            clientMail:props.userDetails.email,
            clientName:props.userDetails.name,
            clientAddress:props.userDetails.address,
            clientPhno:props.userDetails.phno,
            workerMail:props.data.email,
            workerName:props.data.name,
            workerPhno:props.data.phno,
            date: date,
            isAccepted:false,
            isRejected:false,
            isCompleted:false,
            isCancelled:false,
            noMoreNeed:false,
            isRated:false,
          })
        })
        await updateDoc(doc,(db,'serviceusers'))
      }catch (e) {
          console.error("Error adding document: ", e);
      }
    }
    sendReq()
    handleClose()
  }
  return (
    <>
      <Card style={{background: '#002bad', width: '18rem',color:'White',margin:'5px auto'}} key={props.data.id} border='light'>
        <Card.Body>
          <Card.Title><h2>Name: {props.data.name}</h2></Card.Title>
          <hr/>
          <Card.Text style={{textAlign:'left' }}>
          {
            (props.data.rating>0)?
            <h4><u>Rating</u>: <span style={{color:'black',backgroundColor:'white',padding:'3px',borderRadius:'5px'}}>{(props.data.rating.toFixed(2)/props.data.givenRatings).toFixed(2)}/5</span> (by {props.data.givenRatings})</h4>
            :<h4><u>Rating</u>: Not yet</h4>
          }
          {/* <h4><u>Services: </u></h4>
          {
              (props.data.services)?
              props.data.services.map((e)=>{return <h5><li>{e.charAt(0).toUpperCase() + e.slice(1)}</li></h5>}):null
          } */}
          <h4><u>Phno: </u></h4>
          <h5>{props.data.phno}</h5>
          <h4><u>Address: </u></h4>
          <h5>{props.data.address}</h5>
          </Card.Text>
          <Button variant="outline-light" onClick={handleShow} style={{width:'100%',margin:'5px'}} as={Link} to={`/worker/${props.data.email}`}>
            View Profile
          </Button>
          <Button onClick={handleShow} style={{width:'100%',margin:'5px',color:'black',backgroundImage:'linear-gradient(50deg, #00d2ff 20%, #3a47d5 80%)',border:'1px solid white'}}>
            Send Request
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Send Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>Hello send me your problem</Modal.Body>
            {
              (props.data.services)?
              props.data.services.map((e)=>{
                return <div><input type='radio' name='problemType' style={{marginLeft:'15px'}} onClick={()=>setProblemType(`${e}`)} />{e.charAt(0).toUpperCase() + e.slice(1)}</div> 
              }):null
            }
            <input type='text' name='problem' value={problem} style={{width:'95%', margin:'auto'}} onChange={changeProblem}/>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={sendRequest}>
                Send
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </>
  )
}
