import React, { useState } from 'react'
import { Card, Col, Container, Row, Button } from 'react-bootstrap'
import { ArrowRightCircleFill, HouseDoorFill, UiChecksGrid } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import Login from './Login'
import ScrollButton from './Scroll'

export default function Welcome(props) {
  const [more,setMore] = useState(5)
  const services=[
    {
      src:'ele-icon.png',
      serviceName:'Electrician'
    },
    {
      src:'plumbing.png',
      serviceName:'Plumber'
    },
    {
      src:'carpentry.png',
      serviceName:'Carpenter'
    },
    {
      src:'salon.png',
      serviceName:'HomeSalon'
    },
    {
      src:'amc-plan.png',
      serviceName:'Mechanic'
    },
    {
      src:'ac-services.png',
      serviceName:'AC'
    },
    {
      src:'refrigerator.png',
      serviceName:'Refrigerator'
    },
    {
      src:'washing-machine.png',
      serviceName:'WashingMachine'
    },
    {
      src:'painting.png',
      serviceName:'Painter'
    },
    {
      src:'tv.png',
      serviceName:'Tv'
    },
    {
      src:'photography.png',
      serviceName:'Photographer'
    },
    {
      src:'mason.png',
      serviceName:'Handyman'
    },
    {
      src:'cleaning.png',
      serviceName:'Cleaning'
    },
    
  ]
  return (
    <>
      <Container style={{padding:'10px',minHeight:'80vh'}}>
        {
          (!props.userIn)?
          <Row>
            <Col md={6} sm={12} style={{margin:"auto"}}>
              <h1>Welcome!!</h1>
              <h3>Largest Service Marketplace</h3>
            </Col>
            <Col md={6} sm={12}>
              <Login/>
            </Col>
          </Row>:
          <Row>
            <Col md={6} sm={12} style={{margin:"5vh auto"}}>
              <h1>Welcome!!</h1>
              <h3>Largest Service Marketplace</h3>
            </Col>
            <Col md={6} sm={12} style={{margin:"5vh auto"}}>
              {
                (props.userIn)?
                <>
                  {
                    (props.userType==='service')&&
                    <> 
                      <h3>You are logged in <br/>Click here to goto your</h3>
                      <Button variant="outline-light" as={Link} to='/dashboard' ><UiChecksGrid style={{paddingBottom:'3px'}} /> Dashboard</Button>
                    </>
                  }
                  {
                    (props.userType==='client')&&
                    <>
                      <h3>You are logged in <br/>Click here to goto home page</h3>
                      <Button variant="outline-light" as={Link} to='/home' ><HouseDoorFill style={{paddingBottom:'3px'}}/> Home</Button>
                    </>
                  }
                </>:null
              }
            </Col>
          </Row>
        }
        <hr/>
        <h2><u>Our Services</u></h2>
        <Row sm={2} xs={2} md={4} lg={5} >
          {
            services.slice(0,more).map((e)=>{
              return <ServiceCard src={e.src} serviceName={e.serviceName} />
            })
          }
        </Row>
        {
          (more<13)&&
          <Button style={{backgroundColor:'white',color:'black'}} onClick={()=>setMore(more+5)} >More.. <ArrowRightCircleFill /></Button>
        }
        <hr/>
        {
          (!props.userIn)?
          <Row style={{padding:'10px'}}>
          <Col md={6} sm={12}>
            <h2><u>Request a service</u></h2>
            <p>We had a Professional experts who can successfully complete the service.</p>
            <Button variant='outline-light' as={Link} to='/signup'>Click Here</Button>
          </Col>
          <Col md={6} sm={12}>
            <h2><u>Become service professionals</u></h2>
            <p>We need a Professional expert who can successfully complete the service.</p>
            <Button variant='outline-light' as={Link} to='/signup'>Click Here</Button>
          </Col>
        </Row>:null
        }
        <ScrollButton/>
      </Container>
    </>
  )
}
function ServiceCard(props){
  return(
    <div>
      <Card style={{ minWidth: '10.2rem', maxWidth:'14rem', margin:'5px auto' }}>
        <Card.Img variant="top" src={require(`../../imgs/${props.src}`)} style={{margin:'auto',marginTop:'50px',border:'black solid 2px',borderRadius:'50%',width:'100px'}} />
        <Card.Body>
          <Card.Text>
            <p style={{fontSize:'0.8em'}}>{props.serviceName}</p>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}