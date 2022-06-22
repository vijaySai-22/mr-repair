import React,{ useState }  from 'react'
import { Card, Container,Button, Row } from 'react-bootstrap'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { doc, setDoc } from '@firebase/firestore'
import { auth, db } from '../../firebase'
import { Link } from 'react-router-dom'

export default function Signup(props) {
    const[data,setData]=useState({
      email:'',
      password:'',
      name:'',
      phno:'',
      address:'',
    })
    const {email,password,name,phno,address}=data
    const change=(e)=>{
      setData({...data,[e.target.name]:e.target.value})
    }
    const [account,setAccount] = useState('client')
    const services=[]
    const changeService=(e)=>{
      if(services.indexOf(e.target.name)>-1){
        const index = services.indexOf(e.target.name);
        if (index > -1) {
          services.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      else{
        services.push(e.target.name)
      }
    }
    async function signup(){
        try{
          await createUserWithEmailAndPassword(auth,email,password)
          .then(user=>console.log(user))
          if(account==='client'){
            try {
              const docRef = await setDoc(doc(db, "clientusers",`${email}`), {
                email: email,
                name: name,
                phno: phno,
                address: address,
              });
            }catch (e) {
                console.error("Error adding document: ", e);
            }
            try{
              await setDoc(doc(db, "history", `${email}`), {
                history:[]
              });
            }catch(e){}
          }
          else{
            try {
              const docRef = await setDoc(doc(db, "serviceusers",`${email}`), {
                email: email,
                name: name,
                phno: phno,
                address: address,
                services: services,
                rating:0,
                givenRatings:0,
                rating1:0,
                rating2:0,
                rating3:0,
                rating4:0,
                rating5:0,
              });
            }catch (e) {
                console.error("Error adding document: ", e);
            }
            try{
              await setDoc(doc(db, "request", `${email}`), {
                request:[]
              });
            }catch(e){}
          }
          try {
            const docRef = await setDoc(doc(db, "users",`${email}`), {
              type: account,
            });
          }catch (e) {
              console.error("Error adding document: ", e);
          }
        }catch(e){
            alert(e.message)
        }
      setData({ email:'',password:'',name:'',address:'',})
    }
  return (
    <div>
      <Container style={{padding:'10px'}}>
        {
          (!props.userIn)?
          <div>
            
            <Card style={{width:"19rem",margin:"auto",paddingTop:'20px'}}>
              <Card.Title>Signup</Card.Title><hr/>
              <Card.Body>
                <h5>Email</h5>
                <input type='email' onChange={change} value={email} name='email' placeholder='Enter Your Mail' required/>
                <h5>Set Password</h5>
                <input type='password' onChange={change} value={password} name='password' placeholder='Set New Password' required/>
                <h5>Name</h5>
                <input type='text' onChange={change} value={name} name='name' placeholder='Enter Your name' required/>
                <h5>Contact Number</h5>
                <input type='number' onChange={change} value={phno} name='phno' placeholder='Enter Your number' required/>
                <h5>Address</h5>
                <input type='text' onChange={change} value={address} name='address' placeholder='Enter Your Address' required/>
                <h5>Choose account type</h5>
                <input type="radio" value="Male" name="account" onClick={()=>setAccount('client')} /> Client
                <input type="radio" value="Female" name="account" onClick={()=>setAccount('service')} /> Service
                {
                  (account==='service')?
                  <div>
                    <h5>Choose your services</h5>
                    <Row lg={2} sm={2} md={2} style={{textAlign:'left',fontSize:'0.8em'}}>
                      <div><input type='checkbox' name='plumber' onClick={changeService} />Plumber</div>
                      <div><input type='checkbox' name='electrician' onClick={changeService} />Electrician</div>
                      <div><input type='checkbox' name='carpenter' onClick={changeService} />Carpenter</div>
                      <div><input type='checkbox' name='salon' onClick={changeService} />Salon</div>
                      <div><input type='checkbox' name='ac' onClick={changeService} />Ac</div>
                      <div><input type='checkbox' name='refrigerator' onClick={changeService} />Refrigerator</div>
                      <div><input type='checkbox' name='washingMachine' onClick={changeService} />Washingmachine</div>
                      <div><input type='checkbox' name='painter' onClick={changeService} />Painter</div>
                      <div><input type='checkbox' name='tv' onClick={changeService} />Tv</div>
                      <div><input type='checkbox' name='packingTruck' onClick={changeService} />PackingTruck</div>
                      <div><input type='checkbox' name='photgrapher' onClick={changeService} />Photgrapher</div>
                      <div><input type='checkbox' name='handyman' onClick={changeService} />Handyman</div>
                    </Row>
                  </div>:null
                }
                <br/>
                <p>Already an acccount <a href='/login'>Login</a> </p>
                <Button variant="primary" onClick={signup}>Sign Up</Button>
              </Card.Body>
            </Card>
          </div>:<div><h1>Login Successful</h1><Button as={Link} to='/profile' > Go </Button></div>
        }
      </Container>
    </div>
  )
}
