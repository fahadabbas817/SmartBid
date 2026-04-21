import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress.address) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <div className='animate-fade-in'>
        <CheckoutSteps step1 step2 step3 />
        <div className='glass-details-box p-4 p-md-5 rounded-lg shadow-lg border-0 my-5' style={{ backgroundColor: '#0b1521' }}>
          <h1 className='text-white font-weight-bold mb-4' style={{ letterSpacing: '1px' }}>PAYMENT METHOD</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-4'>
              <Form.Label as='legend' className='text-muted small font-weight-bold mb-3 uppercase'>Select Payment Gateway</Form.Label>
              <Col>
                <div 
                  className='p-3 rounded-lg mb-3 d-flex align-items-center justify-content-between cursor-pointer'
                  style={{ 
                    border: '2px solid var(--primary-color)', 
                    backgroundColor: 'rgba(57, 255, 20, 0.05)',
                    boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)'
                  }}
                >
                  <Form.Check
                    type='radio'
                    label='PayPal or Credit Card'
                    id='PayPal'
                    name='paymentMethod'
                    value='PayPal'
                    checked
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='custom-radio-dark text-white font-weight-bold m-0'
                  ></Form.Check>
                  <img src='/images/smartbid_logo.png' alt='Secure' width='25' height='25' style={{ filter: 'grayscale(1) brightness(2)' }} />
                </div>
              </Col>
            </Form.Group>

            <Button type='submit' variant='primary' className='btn-checkout-animated w-100 rounded-pill py-3 font-weight-bold shadow-lg'>
              CONTINUE TO REVIEW <i className='fas fa-arrow-right ml-2'></i>
            </Button>
          </Form>
        </div>
      </div>
    </FormContainer>
  )
}

export default PaymentScreen
