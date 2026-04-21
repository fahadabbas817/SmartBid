import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  return (
    <Row>
      <Col md={4} lg={3}>
        <div className="card shadow-sm border-0 rounded-lg p-4 mb-4" style={{ backgroundColor: '#0b1521' }}>
          <h3 className="mb-4 font-weight-bold text-white" style={{ letterSpacing: '-0.5px' }}>User Profile</h3>
          {message && <Message variant='danger'>{message}</Message>}
          {success && <Message variant='success'>Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='mb-3'>
                <Form.Label className='text-muted small font-weight-bold'>NAME</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email' className='mb-3'>
                <Form.Label className='text-muted small font-weight-bold'>EMAIL ADDRESS</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='password' className='mb-3'>
                <Form.Label className='text-muted small font-weight-bold'>NEW PASSWORD</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='confirmPassword' className='mb-4'>
                <Form.Label className='text-muted small font-weight-bold'>CONFIRM PASSWORD</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='rounded-pill px-4 py-2 border-0 shadow-sm text-white'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary' className="w-100 rounded-pill py-2 font-weight-bold shadow-lg">
                UPDATE PROFILE
              </Button>
            </Form>
          )}
        </div>
      </Col>
      <Col md={8} lg={9}>
        <div className="card shadow-sm border-0 rounded-lg p-4" style={{ backgroundColor: '#0b1521' }}>
          <h3 className="mb-4 font-weight-bold text-white" style={{ letterSpacing: '-0.5px' }}>My Orders</h3>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant='danger'>{errorOrders}</Message>
          ) : (
            <Table hover responsive className='table-custom-dark mb-0'>
              <thead>
                <tr className="text-muted small font-weight-bold">
                  <th className="border-0">ID</th>
                  <th className="border-0">DATE</th>
                  <th className="border-0">TOTAL</th>
                  <th className="border-0">PAID</th>
                  <th className="border-0">DELIVERED</th>
                  <th className="border-0"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="text-white align-middle border-bottom border-secondary" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <td className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>{order._id}</td>
                    <td className="py-3 font-weight-bold">{order.createdAt.substring(0, 10)}</td>
                    <td className="py-3 font-weight-bold text-success">${order.totalPrice}</td>
                    <td className="py-3">
                      {order.isPaid ? (
                        <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill font-weight-bold">
                          <i className="fas fa-check mr-1"></i> {order.paidAt.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="badge bg-danger-soft text-danger px-3 py-2 rounded-pill font-weight-bold">
                          <i className='fas fa-times mr-1'></i> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {order.isDelivered ? (
                        <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill font-weight-bold">
                          <i className="fas fa-truck mr-1"></i> {order.deliveredAt.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="badge bg-warning-soft text-warning px-3 py-2 rounded-pill font-weight-bold">
                          <i className='fas fa-clock mr-1'></i> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm rounded-pill px-4 font-weight-bold border-0' style={{ backgroundColor: '#1a2838', color: '#fff' }}>
                          DETAILS
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
                {(!orders || orders.length === 0) && (
                  <EmptyState message="No orders found." columns="6" icon="fas fa-shopping-cart" />
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default ProfileScreen
