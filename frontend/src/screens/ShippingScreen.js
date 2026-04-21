import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push('/payment')
  }

  return (
    <FormContainer>
      <div className='animate-fade-in'>
        <CheckoutSteps step1 step2 />
        
        <h1 className='text-white font-weight-bold mb-4 mt-2' style={{ letterSpacing: '1px' }}>SHIPPING DETAILS</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address' className='mb-3'>
            <Form.Label className='small font-weight-bold' style={{ color: '#829ab1' }}>STREET ADDRESS</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter address'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='city' className='mb-3'>
            <Form.Label className='small font-weight-bold' style={{ color: '#829ab1' }}>CITY</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter city'
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='postalCode' className='mb-3'>
            <Form.Label className='small font-weight-bold' style={{ color: '#829ab1' }}>POSTAL CODE</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter postal code'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
              className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='country' className='mb-4'>
            <Form.Label className='small font-weight-bold' style={{ color: '#829ab1' }}>COUNTRY</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter country'
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
              className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='btn-checkout-animated w-100 rounded-pill py-3 font-weight-bold shadow-lg mt-2'>
            CONTINUE TO PAYMENT <i className='fas fa-credit-card ml-2'></i>
          </Button>
        </Form>
      </div>
    </FormContainer>
  )
}

export default ShippingScreen
