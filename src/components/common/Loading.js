import React from 'react'
import { Modal } from 'react-bootstrap'

export default function Loading() {
  return (
    <div>
      <Modal show={true} style={{marginTop:'30vh'}}>
        <Modal.Header>
          <Modal.Title>Mr.Repair</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign:'center',fontSize:'30px',fontWeight:'bold'}}>Loading....</Modal.Body>
      </Modal>
    </div>
  )
}
