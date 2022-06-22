import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function LoginOrSignup () {
  return (
    <>
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Not Loggedin</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>You are not logged in to view content..</p>
                <p>Please login/signup to continue..</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="success" as={Link} to={'/signup'}>Signup</Button>
                <Button variant="primary" as={Link} to={'/login'}>Login</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </>
  )
}
