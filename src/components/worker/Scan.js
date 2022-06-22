import React,{useEffect, useState} from 'react'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from '../../firebase'
import { Modal, Button } from 'react-bootstrap';
import { QrReader } from 'react-qr-reader';
import { useParams } from 'react-router'
import LoginOrSignup from '../common/LoginOrSignup';
import Out from '../common/Out';

export default function Scan(props) {
    const {workerMail,id} = useParams()
    const [res, setRes] = useState('');
    const [x,setX] = useState(0)//onreload useEffect
    const [data,setData]=useState()
    useEffect(()=>{
        const fetchData=async()=>{
            let r=[];
            const docSnap = await getDoc(doc(db, "request",`${workerMail}`));
            if (docSnap.exists()) {
                r=docSnap.data().request
                console.log(r)
            } else {}
            for(let i=0;i<r.length;i++){
                if(String(r[i].id)===id){
                    setData(r[i])
                }
            }
            setX(1)
            }
        fetchData()
    },[x])
    const validate=async ()=>{
        console.log(data)
        if(res===String(data.id)){
            await updateDoc(doc(db, 'history', `${data.clientMail}`), {
                history: arrayRemove(data)
            });
            await updateDoc(doc(db, 'request', `${workerMail}`), {
                request: arrayRemove(data)
            });
        
            data.isCompleted=true
            await updateDoc(doc(db, 'history', `${data.clientMail}`), {
                history: arrayUnion(data)
            });
            await updateDoc(doc(db, 'request', `${workerMail}`), {
                request: arrayUnion(data)
            });
            alert('Success')
            window.close()
        }
        else{
            alert('Invalid QR, Scan vaild QR')
            setRes('')
        }
    }
  return (
    <>  
        {
            (props.userIn)?
            <>
                {
                    (props.userType==='service')?
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Scan Qr</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <QrReader
                                constraints={{ facingMode: 'environment' }}
                                scanDelay={500}
                                onResult={(result, error) => {
                                    if (!!result) {
                                        setRes(result?.text);
                                    }
                                    if (!!error) {
                                        console.info(error);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>window.close()} >Close</Button>
                            { (res!=='') &&  <Button variant="primary" onClick={validate}>Validate</Button>}
                        </Modal.Footer>
                    </Modal.Dialog>:<Out/>
                }
            </>:<LoginOrSignup/>
        }
    </>
  );
}