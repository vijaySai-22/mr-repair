import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import WorkerCard from './WorkerCard'
import { collection, getDocs } from "firebase/firestore";
import {db} from '../../firebase'
import LoginOrSignup from '../common/LoginOrSignup';
import Out from '../common/Out';
import ScrollButton from '../common/Scroll';


export default function Home(props) {
  const [data,setData] = useState([])
  const [highRatedWorkers,setHighRatedWorkers] = useState([])
  const [query,setQuery] = useState('')
  const [results,setResults] = useState()
  const [noResults,setNoResults] = useState(false)
  useEffect(()=>{
    async function gettingData(){
      await getDocs(collection(db, 'serviceusers'))
      .then((snapshot)=>{
          let data = []
          let ratingData = []
          snapshot.docs.forEach((doc)=>{
            data.push({...doc.data(),id:doc.id})
            if(doc.data().rating/doc.data().givenRatings>=3){
              ratingData.push({...doc.data(),id:doc.id})
            }
            ratingData.sort(function(a, b){return b.rating/b.givenRatings-a.rating/a.givenRatings});//sorting the rating
          })
          setHighRatedWorkers(ratingData)
          setData(data)
      })
    }
    gettingData()
  },[])
  
  useEffect(()=>{
    const settingResults=()=>{
      let res=[]
      let q=query.toLowerCase()
      for(let i=0;i<data.length;i++){
        if (data[i].name.toLowerCase().includes(q) || data[i].address.toLowerCase().includes(q) )
        res.push(data[i])
        else{
          for(let j=0;j<data[i].services.length;j++){
            if(data[i].services[j].includes(q) && !res.includes(data[i]))
              res.push(data[i])
          }
        }
      }
      setResults(res)
      if(res.length===0)
      setNoResults(true)
      if(query.length===0)
      setNoResults(false)
    }
    settingResults()
  },[query])
  
  return (
    <>
      {
        (props.userIn)&&
        <>
        {
          (props.userType==='client')&&
          <Container style={{padding:'10px',minHeight:'80vh',margin:'auto'}} >
            <h3><b>Search here:</b></h3>
              <input type='text' onChange={(e)=>setQuery(e.target.value)} value={query} placeholder='By name /address /service' 
              style={{border:'none',outline:'none',paddingLeft:'10px',fontSize:'1.3em'}} />
            <hr/>
            <Row>
              {
                (query)&&
                <>
                  <h3><u>Search Results</u></h3>
                  {
                    results.map((e)=>{
                        return <WorkerCard data={e} userDetails={props.userDetails} key={Math.random()} />
                    })
                  }
                </>
              }
              {(noResults)&&<h3>No results found</h3>}
              {(query)&&<hr/>}
            </Row>
            <Row >
              {
                (highRatedWorkers)?
                <>
                  <h2 style={{textAlign:'left',marginLeft:'20px',fontWeight:'bolder'}}>Top rated:</h2>
                  {
                    highRatedWorkers.map((e)=>{
                      return <WorkerCard data={e} userDetails={props.userDetails} key={Math.random()} />
                    })
                  }
                </>:null
              }
            </Row>
            <hr/>
            <h2 style={{textAlign:'left',marginLeft:'20px',fontWeight:'bolder'}}>Available workers:</h2>
            <Row md={4} sm={1} >
              {
                (data)?
                data.map((e)=>{
                  return <WorkerCard data={e} userDetails={props.userDetails} key={Math.random()} />
                }):null
              }
            </Row>
            <ScrollButton/>
          </Container>
        }
        {
          (props.userType==="service")&&<Out/>
        }
        </>
      }
      {
        (!props.userIn)&&<LoginOrSignup/>
      }
    </>
  )
}
