import React,{useState} from 'react';
import { Card, Container,Button, Row } from 'react-bootstrap';
import { Tools, ArrowRightCircleFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import LoginOrSignup from '../common/LoginOrSignup';
import Out from '../common/Out';
import ScrollButton from '../common/Scroll';


export default function Services(props) {
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
      {
        (props.userIn)?
        <>
          {
            (props.userType==='client')?
            <Container style={{padding:'10px',minHeight:'80vh'}} >
              <h1 >Services <Tools style={{paddingBottom:'5px'}} /></h1><hr/>
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
              <ScrollButton/>
            </Container>:<Out/>
          }
        </>:<LoginOrSignup/>
      }
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
          <Button variant='outline-primary' as={Link} to={`/service/${props.serviceName.toLowerCase()}`}>View</Button>
        </Card.Body>
      </Card>
    </div>
  )
}