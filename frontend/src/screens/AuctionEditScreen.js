import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createAuction } from '../actions/auctionpriceAction'

const AuctionEditScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [basePrice, setbasePrice] = useState('')
  const [message] = useState(null)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productAuction = useSelector((state) => state.productAuction)
  const { loading, error } = productAuction

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createAuction(name, basePrice))
    setName('');
    setbasePrice('');
    // Set the message after successful form submission
  }

  return (
    <FormContainer>
      <h1>Create Auction</h1>
      {message && <Message variant='success'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Auction Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter auction name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='number'>
          <Form.Label>Base Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter Basic Price'
            value={basePrice}
            onChange={(e) => setbasePrice(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default AuctionEditScreen