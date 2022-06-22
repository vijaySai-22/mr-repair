import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function LoginSuccess() {
  return (
    <>
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Login Successful</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Click Ok to continue</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" as={Link} to={'/profile'}>Ok</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </>
  )
}
