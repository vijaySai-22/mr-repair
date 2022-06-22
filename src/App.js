import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import React from 'react'
import Welcome from './components/common/Welcome'
import Loading from './components/common/Loading'
import Login from './components/common/Login'
import Signup from './components/common/Signup'

import Home from './components/client/Home';
import Services from './components/client/Services'
import Service from './components/client/Service';
import History from './components/client/History';
import Worker from './components/client/Worker'

import Profile from './components/common/Profile'

import Dashboard from './components/worker/Dashboard';
import Requests from './components/worker/Requests'
// import Scan from './components/worker/Scan'

import Out from './components/common/Out';

import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from './firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { ArrowDownRightCircleFill, ClockFill, HouseDoorFill, PersonFill, Tools, UiChecksGrid } from 'react-bootstrap-icons';

function App() {
  const [load,setLoad] = useState(true)
  useEffect(() => {
    if (load) {
      setTimeout(() => {
        setLoad(false);
      }, 2500);
    }
  }, [load]);
  //checking user logged in or not
  const [userIn,setUserIn] = useState(false)
  const [userType,setUserType] = useState(null)
  const [uid,setUid] = useState()
  useEffect(()=>{
    function fetched(){
        const check=onAuthStateChanged(auth,(user)=>{
            if (user!=null){
              setUid(user.email)
              setUserIn(true)
            }
            else{
              setUserIn(false)
            }
        })
        return check
    }
    fetched()
  },[])
  const signout=async()=>{
    await signOut(auth)
    setUserType(null)
    setUserIn(false)
  }
  //checking user is client or worker
  useEffect(()=>{
    async function fetched(){
      const docRef = doc(db, "users", `${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if(docSnap.data().type==='service'){
          setUserType('service')
        }
        else if(docSnap.data().type==='client'){
          setUserType('client')
        }
      } else {
        // doc.data() will be undefined in this case
        setUserType(null)
      }
    }
    fetched()
  },[userIn,signout,uid])

  const [userDetails,setUserDetails] = useState(null)
  useEffect(()=>{
    async function fetched(){
      if(userType==='service'){
        const docRef = doc(db, "serviceusers", `${uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data())
        } else {
          // doc.data() will be undefined in this case
        }
      }
      else if(userType==='client'){
        const docRef = doc(db, "clientusers", `${uid}`);
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
  },[userType,userIn])
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar style={{background: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)',borderBottom:'black solid 1px',position: 'sticky',top: '0',zIndex:'2'}} expand="lg">
          <Container>
            <Navbar.Brand as={Link} to='/' style={{fontSize:'2em',fontWeight:'bolder', color:'white', backgroundColor:'black', padding:'5px', borderRadius:'5px' }}>
              <Tools style={{marginTop:'-5px'}} /> Mr. Repair</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {
                  (userIn)?
                  <>
                    {
                      (userType==='client')&&
                        <>
                          <Nav.Link as={Link} to='/home' style={{fontSize:'1.3em'}}><HouseDoorFill style={{paddingBottom:'3px'}}/> Home</Nav.Link>
                          <Nav.Link as={Link} to='/services' style={{fontSize:'1.3em'}}><Tools style={{paddingBottom:'3px'}}/> Services</Nav.Link>
                          <Nav.Link as={Link} to='/history' style={{fontSize:'1.3em'}}><ClockFill style={{paddingBottom:'3px'}}/> History</Nav.Link>
                          <Nav.Link as={Link} to='/profile' style={{fontSize:'1.3em'}}><PersonFill style={{paddingBottom:'3px'}}/> Profile</Nav.Link>
                          <Button onClick={signout} variant="danger" >Logout</Button>
                        </>
                    }
                    {
                      (userType==='service')&&
                        <>
                          <Nav.Link as={Link} to='/dashboard' style={{fontSize:'1.3em'}}><UiChecksGrid style={{paddingBottom:'3px'}}/> Dashboard</Nav.Link>
                          <Nav.Link as={Link} to='/requests' style={{fontSize:'1.3em'}}><ArrowDownRightCircleFill style={{paddingBottom:'3px'}}/> Requests</Nav.Link>
                          <Nav.Link as={Link} to='/profile' style={{fontSize:'1.3em'}}><PersonFill style={{paddingBottom:'3px'}}/> Profile</Nav.Link>
                          <Button onClick={signout} variant="danger" >Logout</Button>
                        </>
                    }
                  </>:null
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          {
            (load)?<Loading/> :null
          }
        </div>
        <Routes>
          <Route path="/" element={<Welcome userIn={userIn} userType={userType} />}/>
          {/* <Route path='/' element={<Temp/>} /> */}
          <Route path="/login" element={<Login userIn={userIn} userType={userType} />}/> 
          <Route path="/signup" element={<Signup userIn={userIn} userType={userType} />}/>

          <Route path="/home" element={<Home uid={uid} userIn={userIn} userType={userType} userDetails={userDetails} />}/>
          <Route path="/services" element={<Services userIn={userIn} userType={userType} userDetails={userDetails} />}/>
          <Route path="/service/:worker" element={<Service userIn={userIn} userType={userType} userDetails={userDetails} />}/>
          <Route path="/history" element={<History userIn={userIn} uid={uid} userType={userType} userDetails={userDetails}  />}/>
          <Route path="/profile" element={<Profile userIn={userIn} uid={uid} userType={userType} />}/> 
          <Route path="/worker/:mail" element={<Worker userIn={userIn} uid={uid} userType={userType} />}/> 

          <Route path="/dashboard" element={<Dashboard userIn={userIn} uid={uid} userType={userType} />}/>
          <Route path="/requests" element={<Requests userIn={userIn} uid={uid} userType={userType} />}/>
          {/* <Route path="/scan/:workerMail/:id" element={<Scan userIn={userIn} uid={uid} userType={userType} />}/> */}
          <Route path='*' element={<Out/>}/>
        </Routes>
      </BrowserRouter>
      <Container style={{background:'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)'}}>
        <p>Copyright © 2022 Mr. Repair. All Rights Reserved.</p>
      </Container>
    </div>
  );
}

export default App;
