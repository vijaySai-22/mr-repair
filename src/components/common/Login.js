import React, { useRef } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth} from '../../firebase'
import { Card, Container, Button } from 'react-bootstrap';
import LoginSuccess from './LoginSuccess';
function Login(props) {
    const emailref = useRef()
    const passwordref = useRef()
    async function signin(){
        try{
            await signInWithEmailAndPassword(auth,emailref.current.value,passwordref.current.value)
        }catch{
            alert("Invalid Details")
        }
        emailref.current.value=''
        passwordref.current.value=''
    }
    
  return (
    <div>
      {
        (!props.userIn)?
        <Container>
          <Card style={{width:"20rem",margin:"5vh auto"}}>
            <Card.Body>
                <Card.Title>Sign In</Card.Title>
                <hr/>
                <h5>Email</h5>
                <input placeholder="Enter MailId" type='email' ref={emailref} required/>
                <h5>Password</h5>
                <input placeholder="Enter Password" type='password' ref={passwordref} required/>
                <br/>
                <br/>
                <p>Create an acccount <a href='/signup'>Signup</a> </p>
                <Button variant="primary" onClick={signin}>Sign In</Button>
            </Card.Body>
          </Card>
        </Container>:<LoginSuccess/>
      }
    </div>
  )
}
export default Login;