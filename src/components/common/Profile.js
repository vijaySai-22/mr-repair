import { doc, getDoc } from '@firebase/firestore'
import React,{useEffect,useState} from 'react'
import { Card, Container, Table } from 'react-bootstrap'
import { PersonFill } from 'react-bootstrap-icons';
import { db } from '../../firebase'
import LoginOrSignup from './LoginOrSignup';

export default function Profile(props) {

  const [userDetails,setUserDetails] = useState(null)
  useEffect(()=>{
    async function fetched(){
      if(props.userType==='service'){
        const docRef = doc(db, "serviceusers", `${props.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data())
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      else if(props.userType==='client'){
        const docRef = doc(db, "clientusers", `${props.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data())
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }else{

      }
    }
    fetched()
  },[userDetails,props.userIn,props.userType,props.uid])
  return (
    <>
      {
        (props.userIn)?
          <Container style={{minHeight:'80vh',paddingTop:'5vh'}}>
            <h1>Your Profile <PersonFill style={{paddingBottom:'5px'}} /></h1><hr/><br/>
            {
              (userDetails)?<ProfileCard data={userDetails} />:null
            }
          </Container>:<LoginOrSignup/>
      }
    </>
  )
}
function ProfileCard(props){
  return(
    <>
      <Card style={{ maxWidth: '500px',margin:'auto',textAlign:'left' }}>
        <Card.Body>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td><h3>Name</h3></td>
              <td><h4>{props.data.name}</h4></td>
            </tr>
            <tr>
              <td><h3>Mail</h3></td>
              <td><h4>{props.data.email}</h4></td>
            </tr>    
            <tr>
              <td><h3>Phone no</h3></td>
              <td><h4>{props.data.phno}</h4></td>
            </tr>
            <tr>
              <td><h3>Address</h3></td>
              <td><h4>{props.data.address}</h4></td>
            </tr>
            {
              (props.data.services)?
              <>
                <tr>
                  <td><h3>Rating</h3></td>
                  <td><h4>{(props.data.rating.toFixed(2)/props.data.givenRatings).toFixed(2)}/5</h4></td>
                </tr>
                <tr>
                  <td><h3>Services</h3></td>
                  <td>{props.data.services.map((e,i=1)=>{return <h4>{i=i+1}. {e}</h4>})}</td>
                </tr>
              </>
             :null
            } 
          </tbody>
        </Table>
        </Card.Body>
      </Card>
    </>
  )
}