import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = (props) => {
  return (
    <Container>
        <Row style={{ display:'flex', justifyContent:'center' }}>
            <Col xs={12} md={6} >
                {props.children}
            </Col>
        </Row>
    </Container>
  )
}

export default FormContainer