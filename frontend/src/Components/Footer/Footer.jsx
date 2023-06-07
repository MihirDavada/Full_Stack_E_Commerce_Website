import React from 'react'
import {Container, Row , Col} from 'react-bootstrap'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='centre py-3'> CopyRights &copy; ProShop.com </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer