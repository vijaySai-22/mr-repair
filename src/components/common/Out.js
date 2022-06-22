import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { EmojiFrown } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

export default function Out() {
  return (
    <Container style={{backgroundColor:'white',padding:'20px'}}>
      <EmojiFrown size='10em' />
      <h1>Error 404</h1>
      <h3>Page not found</h3>
      <h3>Goto <Button as={Link} to='/'>Welcome</Button> Page</h3>
    </Container>
  )
}
