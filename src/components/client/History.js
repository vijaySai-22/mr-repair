import React, { useEffect, useState } from 'react'
import { getDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from '../../firebase';
import { Card, Button, Row, Container, Modal } from 'react-bootstrap';
import LoginOrSignup from '../common/LoginOrSignup'
import ScrollButton from '../common/Scroll'
import QRCode from 'qrcode'
import { ClockFill, EmojiAngry, EmojiFrown, EmojiHeartEyes, EmojiLaughing, EmojiNeutral } from 'react-bootstrap-icons';
import Out from '../common/Out';

export default function History(props) {
    const [history,setHistory]= useState(null)
    const [x,setX] = useState(0)//onreload useEffect

    useEffect(()=>{
        const fetchData=async()=>{
            let h=[]
            const docSnap = await getDoc(doc(db, "history",`${props.uid}`));
            if (docSnap.exists()) {
                h=docSnap.data().history
                h=h.sort((a,b)=>(parseInt(a.id) < parseInt(b.id))? 1 : ((parseInt(b.id) < parseInt(a.id))? -1 : 0));
                setHistory(h);
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
                    (props.userType==='client')?
                    <Container style={{padding:'10px',minHeight:'80vh'}}>
                        <h1>Your History <ClockFill style={{paddingBottom:'5px'}} /></h1><hr/>
                        <Row lg={4} sm={2} style={{margin:'auto'}}>
                            {
                                (history!==null && history.length!==0)?
                                history.map((e)=>{return <Cards data={e} key={e.id} uid={props.uid} />})
                                :<h3>No Results Found</h3>
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
function Cards(props) {

    const [bg,setBg] = useState()
    const [text,setText] = useState()
    const [status,setStatus] = useState('Pending')
    const [showBtn,setShowBtn] = useState(true)
    const [showAskCancelBtn,setShowAskCancelBtn] = useState(false)
    const [showQrBtn,setShowQrBtn] = useState(false)
    const [rating,setRating] = useState(0)
    const [showRatingBtn,setShowRatingBtn] = useState(false)

    //qr modals states and handels
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //rating modals states and handels
    const [showRate, setRateShow] = useState(false);
    const handleRateClose = () => setRateShow(false);
    const handleRateShow = () => setRateShow(true);

    const [qr,setQr] = useState()

    const cancel=async()=>{
        await updateDoc(doc(db, 'history', `${props.uid}`), {
            history: arrayRemove(props.data)
        });
        await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
            request: arrayRemove(props.data)
        });

        props.data.isCancelled=true
        await updateDoc(doc(db, 'history', `${props.uid}`), {
            history: arrayUnion(props.data)
        });
        await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
            request: arrayUnion(props.data)
        });
        cancelChange()
    }
    const noNeed=async()=>{
        await updateDoc(doc(db, 'history', `${props.uid}`), {
            history: arrayRemove(props.data)
        });
        await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
            request: arrayRemove(props.data)
        });

        props.data.noMoreNeed=true
        await updateDoc(doc(db, 'history', `${props.uid}`), {
            history: arrayUnion(props.data)
        });
        await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
            request: arrayUnion(props.data)
        });
        noNeedChange()
    }
    
    const cancelChange=()=>{
        setBg('danger')
        setText('white')
        setStatus('Cancelled')
        setShowBtn(false)
    }
    const noNeedChange=()=>{
        setBg('danger')
        setText('white')
        setStatus('Cancelled')
        setShowBtn(false)
        setShowAskCancelBtn(false)
        setShowQrBtn(false)
    }

    useEffect(()=>{
        if(props.data.isCancelled){
            cancelChange()
        }
        if(props.data.isAccepted){
            setBg('warning')
            setStatus('Accepted')
            setShowBtn(false)
            setShowAskCancelBtn(true)
        }
        if(props.data.isRejected){
            cancelChange()
            setStatus('Rejected')
            setShowBtn(false)
        }
        if(props.data.noMoreNeed){
            noNeedChange()
            setShowQrBtn(false)
        }
        if(props.data.isAccepted && !props.data.noMoreNeed){
            setShowQrBtn(true)
        }
        if(props.data.isCompleted){
            setBg('success')
            setText('white')
            setStatus('Completed')
            setShowBtn(false)
            setShowAskCancelBtn(false)
            setShowQrBtn(false)
        }
        if(props.data.isCompleted && !props.data.isRated){
            setShowRatingBtn(true)
        }
    },[])
    // Generate QR fun
    const generateQR = async() => {
        try {
          const qr=await QRCode.toDataURL(String(props.data.id))
          setQr(qr)
          handleShow()
        } catch (err) {
          console.error(err)
        }
    }
    // Rating fun
    const giveRating = async() =>{
        console.log('clicked')
        try{
            // updating rating of worker
            let data;
            const docSnap = await getDoc(doc(db, "serviceusers", `${props.data.workerMail}`));
            if (docSnap.exists()) {
                data = docSnap.data()
            } else {}
            let increGivenRatings=data.givenRatings+1
            // let increRating=(data.rating+rating)/2
            let r=data.rating+rating
            await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating: r,
                givenRatings: increGivenRatings,
            });
            if(rating===1) await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating1:data.rating1+1 
            });
            if(rating===2) await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating2:data.rating2+1 
            });
            if(rating===3) await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating3:data.rating3+1 
            });
            if(rating===4) await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating4:data.rating4+1 
            });
            if(rating===5) await updateDoc(doc(db,'serviceusers',`${props.data.workerMail}`), {
                rating5:data.rating5+1 
            });

            

            // updating isRated to true
            await updateDoc(doc(db, 'history', `${props.uid}`), {
                history: arrayRemove(props.data)
            });
            await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
                request: arrayRemove(props.data)
            });
    
            props.data.isRated=true
            await updateDoc(doc(db, 'history', `${props.uid}`), {
                history: arrayUnion(props.data)
            });
            await updateDoc(doc(db, 'request', `${props.data.workerMail}`), {
                request: arrayUnion(props.data)
            });
            setShowRatingBtn(false)
            handleRateClose()
        }catch(e){
            console.log(e)
        }
    }
    return(
        <>
            <Card bg={bg} text={text} style={{ width: '18rem', margin:'5px auto',textAlign:'left' }}>
                <Card.Body>
                    <Card.Title>Worker Name: {props.data.workerName}</Card.Title>
                    <Card.Text>
                        <h5>Status: <u>{status}</u></h5>
                        <h6>Related to: {props.data.problemType}</h6><hr/>
                        <h6>Date: {props.data.date}</h6>
                        <h6>Problem: {props.data.problem}</h6>
                        <h6>Mail: {props.data.workerMail}</h6>
                        <h6>Phno: {props.data.workerPhno}</h6>
                    </Card.Text>
                    {(showBtn)? <Button variant="danger" onClick={cancel} >Cancel</Button>:null}
                    {(showAskCancelBtn)? <Button variant="danger" onClick={noNeed}>No Need</Button>:null}
                    {(showQrBtn)? <Button variant="primary" onClick={generateQR}>Show QR</Button>:null}
                    {(showRatingBtn)? <Button variant="primary" onClick={handleRateShow}>Give Rating</Button>:null}
                    {/* QR modal */}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Scan QR</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h3>Ask Worker to Scan</h3>
                            <h6>Note: If scanned, the work is done</h6>
                            
                            {(qr)&&<img src={qr} alt='qrcode' />}
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* Rating model */}
                    <Modal show={showRate} onHide={handleRateClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Give Rating for this work</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{fontSize:'2em',textAlign:'center'}}>
                                <EmojiAngry onClick={()=>setRating(1)} /> <EmojiFrown onClick={()=>setRating(2)}/> <EmojiNeutral onClick={()=>setRating(3)}/> <EmojiLaughing onClick={()=>setRating(4)}/> <EmojiHeartEyes onClick={()=>setRating(5)}/>
                            </div>
                            Rating:{rating}/5
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="danger" onClick={handleRateClose}>cancel</Button>
                        <Button onClick={giveRating}>Give</Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </>
    )
}
