import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ children }) => {
  return (
    <Container className="py-5">
      <Row className='justify-content-md-center'>
        <Col xs={12} md={8} lg={6}>
          <div className="glass-details-box p-4 p-md-5 w-100" style={{ backgroundColor: '#0b1521', color: '#fff' }}>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
