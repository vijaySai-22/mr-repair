import React, { useEffect, useState } from 'react'
import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap'
import { ArrowDownCircleFill, CheckCircleFill, ExclamationCircleFill, SquareFill, Tools, UiChecksGrid, XCircleFill } from 'react-bootstrap-icons'
import { getDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import LoginOrSignup from '../common/LoginOrSignup'
import Out from '../common/Out';
import { PieChart } from 'react-minimal-pie-chart';
import ScrollButton from '../common/Scroll';

export default function Dashboard(props) {
    const [reqTypeData,setReqTypeData] = useState()
    const [works,setWorks] = useState(0)
    const [completed,setCompleted] = useState(0)
    const [req,setReq] = useState(0)
    const [pending,setPending] = useState(0)
    const [canNoMoreRej,setCanNoMoreRej] = useState(0)
    const [rating,setRating] = useState(0)
    const [ratedby,setRatedby] = useState(0)
    const [workerData,setworkerData] = useState()
    const [x,setX] = useState(0)//onreload useEffect
    useEffect(()=>{
        async function fetchData(){
            let r=[];
            const docSnap = await getDoc(doc(db, "request",`${props.uid}`));
            if (docSnap.exists()) {
                r=docSnap.data().request
            } else {}
            let comp=0
            let pend=0
            let cancNoMore=0
            let requ=0
            for(let i=0;i<r.length;i++){
                if(r[i].isCompleted){
                    comp+=1
                }
                if(r[i].isAccepted && !r[i].isCompleted && !r[i].noMoreNeed){
                    pend+=1
                }
                if(r[i].isCancelled || r[i].noMoreNeed || r[i].isRejected){
                    cancNoMore+=1
                }
                if(!r[i].isAccepted && !r[i].isRejected && !r[i].isCancelled ){
                    requ+=1
                }
            }
            setWorks(r.length)
            setPending(pend)
            setCompleted(comp)
            setCanNoMoreRej(cancNoMore)
            setReq(requ)
            setX(1)
            console.log(r)
            if(r && r.length>0){
                let data={salon:0,plumber:0,carpenter:0,mechanic:0,electrician:0,ac:0,refrigerator:0,washingMachine:0,painter:0,tv:0,packingTruck:0,photgrapher:0,handyman:0}
                for(let i=0;i<r.length;i++){
                    if(r[i].problemType==='salon'){data.salon=data.salon+1}
                    if(r[i].problemType==='plumber'){data.plumber=data.plumber+1}
                    if(r[i].problemType==='carpenter'){data.carpenter=data.carpenter+1}
                    if(r[i].problemType==='mechanic'){data.mechanic=data.mechanic+1}
                    if(r[i].problemType==='electrician'){data.electrician=data.electrician+1}
                    if(r[i].problemType==='ac'){data.ac=data.ac+1}
                    if(r[i].problemType==='refrigerator'){data.refrigerator=data.refrigerator+1}
                    if(r[i].problemType==='washingMachine'){data.washingMachine=data.washingMachine+1}
                    if(r[i].problemType==='painter'){data.painter=data.painter+1}
                    if(r[i].problemType==='tv'){data.tv=data.tv+1}
                    if(r[i].problemType==='packingTruck'){data.packingTruck=data.packingTruck+1}
                    if(r[i].problemType==='photgrapher'){data.photgrapher=data.photgrapher+1}
                    if(r[i].problemType==='handyman'){data.handyman=data.handyman+1}
                }
                setReqTypeData(data)
                console.log(reqTypeData)
            }
        }
        fetchData()
    },[x])
    useEffect(()=>{
        async function fetchData(){
            const docSnap = await getDoc(doc(db, "serviceusers",`${props.uid}`));
            if (docSnap.exists()) {
                let data=docSnap.data()
                setRating(data.rating)
                setRatedby(data.givenRatings)
                setworkerData(data)
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
                    <Container style={{padding:'30px',minHeight:'80vh'}}>
                        <h2>Your Dashboard <UiChecksGrid style={{paddingBottom:'5px'}} /></h2><hr/>
                        {
                            (rating!==0)?
                            <Row>
                                <Col>
                                    <h3 style={{float:'right'}}>Your Rating: <span style={{color:'white',backgroundColor:'black',padding:'3px',borderRadius:'5px'}}>{(rating.toFixed(2)/ratedby).toFixed(2)}/5</span></h3>
                                </Col>
                            </Row>:null
                        }
                        <Row lg={4} sm={2}>
                            <Dashboardcard tag={<Tools size="5em" style={{margin:'auto', padding:'10px'}} />} title='Works' text={works} bg={'secondary'} />
                            <Dashboardcard tag={<CheckCircleFill size="5em" style={{margin:'auto', padding:'10px'}} />} title='Completed' text={completed} bg={'success'} />
                            <Dashboardcard tag={<ArrowDownCircleFill size="5em" style={{margin:'auto', padding:'10px'}} />} title='Requests' text={req} bg={'info'} />
                            <Dashboardcard tag={<ExclamationCircleFill size="5em" style={{margin:'auto', padding:'10px'}} />} title='Pending Works' text={pending} bg={'warning'} />
                            <Dashboardcard tag={<XCircleFill size="5em" style={{margin:'auto', padding:'10px'}} />} title='Cancelled/Rejected' text={canNoMoreRej} bg={'danger'} />
                        </Row><hr/>
                        {
                            (works>0)?
                            <Row style={{height:'auto'}} >
                                <Col style={{marginBottom:'40px'}} lg={4} sm={12}>
                                    <h2 style={{backgroundColor:'black',color:'white'}}>Work Progress</h2><hr/>
                                    <PieChart
                                        style={{margin:'-15px'}}
                                        label={(props) => { if (props.dataEntry.value>0) return `${props.dataEntry.title}(${props.dataEntry.value})`;}}
                                        data={[
                                            { title: 'Completed', value: completed , color: '#0bd900' },
                                            { title: 'Requests', value: req, color: '#11b8f5' },
                                            { title: 'Pending', value: pending, color: '#f1ff2b' },
                                            { title: 'Cancelled/Rejected', value: canNoMoreRej, color: '#ff0f0f' },
                                        ]}  
                                        labelStyle={{fontSize:'2px'}}
                                        center={[25,25]}
                                        viewBoxSize={[50,50]}
                                        radius={25}
                                    />
                                    {/* <div>
                                        <p><SquareFill color= '#0bd900' /> Completed <SquareFill color= '#11b8f5' /> Requests</p>
                                        <p>&nbsp;<SquareFill color= '#f1ff2b' /> Pending &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <SquareFill color= '#ff0f0f' /> Cancelled</p>
                                    </div> */}
                                </Col>
                            
                            
                                <Col style={{marginBottom:'40px'}} lg={4} sm={12}>
                                    <h2 style={{backgroundColor:'black',color:'white'}}>Traffic Type</h2><hr/>
                                    <PieChart
                                        style={{margin:'-13px'}}
                                        label={(props) => { if (props.dataEntry.value>0) return `${props.dataEntry.title} (${props.dataEntry.value})`;}}
                                        data={[
                                            { title: 'Salon', value: reqTypeData.salon , color: 'gray' },
                                            { title: 'Plumbing', value: reqTypeData.plumber, color: 'silver' },
                                            { title: 'Carpenter', value: reqTypeData.carpenter, color: 'maroon' },
                                            { title: 'Electrician', value: reqTypeData.electrician, color: 'red' },
                                            { title: 'Mechanic', value: reqTypeData.mechanic, color: 'purple' },
                                            { title: 'Ac', value: reqTypeData.ac, color: 'violet' },
                                            { title: 'Refrigerator', value: reqTypeData.refrigerator, color: 'green' },
                                            { title: 'WashingMachine', value: reqTypeData.washingMachine, color: 'lime' },
                                            { title: 'Painter', value: reqTypeData.painter, color: 'olive' },
                                            { title: 'Tv', value: reqTypeData.tv, color: 'yellow' },
                                            { title: 'PackingTruck', value: reqTypeData.packingTruck, color: 'navy' },
                                            { title: 'Photgrapher', value: reqTypeData.photgrapher, color: 'blue' },
                                            { title: 'Handyman', value: reqTypeData.handyman, color: 'teal' },
                                        ]}  
                                        labelStyle={{fontSize:'2px'}}
                                        center={[25,25]}
                                        viewBoxSize={[50,50]}
                                        radius={25}
                                    />
                                    
                                </Col>
                                
                                <Col lg={4} sm={12}>
                                        <Row lg={3} sm={2} md={3} xs={2} style={{textAlign:'left'}}>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'gray' /> Salon </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'silver' /> Plumbing</p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'red' /> Electrician </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'purple' /> Mechanic </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'maroon' /> Carpenter </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'green' /> Refrigerator</p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'lime' /> WashingMachine </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'olive' /> Painter </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'yellow' /> Tv </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'violet' /> Ac </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'teal' /> Handyman </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'blue' /> Photgrapher </p>
                                            <p style={{fontSize:'0.8em'}}><SquareFill style={{border:'solid black 1px'}} color= 'navy' /> PackingTruck</p>
                                        </Row>
                                    <hr/>
                                    <div lg={4} sm={12}>
                                        <h3 style={{backgroundColor:'black',color:'white'}}>Your Rating Progress {(rating.toFixed(2)/ratedby).toFixed(2)}/5</h3>
                                        {(workerData) &&
                                            <>
                                                {
                                                    ( workerData.givenRatings>0)?
                                                    <div>
                                                        <ProgressBar variant="success" now={(workerData.rating5/workerData.givenRatings)*100} 
                                                            label={`5 Star `} style={{margin:'3%',height:'5%',border:'solid black 1px'}} />
                                                        <ProgressBar variant="primary" now={(workerData.rating4/workerData.givenRatings)*100} 
                                                            label={`4 Star `} style={{margin:'3%',height:'5%',border:'solid black 1px'}} />
                                                        <ProgressBar variant="info" now={(workerData.rating3/workerData.givenRatings)*100} 
                                                            label={`3 Star`} style={{margin:'3%',height:'5%',border:'solid black 1px'}} /> 
                                                        <ProgressBar variant="warning" now={(workerData.rating2/workerData.givenRatings)*100} 
                                                            label={`2 Star`} style={{margin:'3%',height:'5%',border:'solid black 1px'}} />
                                                        <ProgressBar variant="danger" now={(workerData.rating1/workerData.givenRatings)*100} 
                                                            label={`1 Star `} style={{margin:'3%',height:'5%',border:'solid black 1px'}} />
                                                        <h6>Rated for {workerData.givenRatings} work(s)</h6>
                                                    </div>:<h6>No ratings yet</h6>
                                                }
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row>:null
                        }
                        <hr/>
                        <ScrollButton/>
                    </Container>:<Out/>
                }
            </>
            :<LoginOrSignup/>
        }
        
    </>
  )
}
function Dashboardcard(props){
    return(
        <Card bg={props.bg} text='white' style={{ width: '15rem',margin:'10px auto'}}>
            {props.tag}
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                    <h4>{props.text}</h4>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}