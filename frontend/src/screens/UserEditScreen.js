import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSeller, setIsSeller] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
        setIsSeller(user.isSeller)
      }
    }
  }, [dispatch, history, userId, user, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin, isSeller }))
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-outline-primary rounded-pill mb-4 px-4 py-2 font-weight-bold shadow-sm' style={{ color: 'var(--primary-color)', borderWidth: '2px' }}>
        <i className='fas fa-arrow-left mr-2'></i> GO BACK
      </Link>
      <FormContainer>
        <div className='glass-details-box p-4 p-md-5 rounded-lg shadow-lg border-0' style={{ backgroundColor: '#0b1521' }}>
          <h1 className='text-white font-weight-bold mb-4' style={{ letterSpacing: '1px' }}>EDIT USER</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
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
                  className='rounded-pill px-4 py-2 border-0 shadow-sm'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email' className='mb-3'>
                <Form.Label className='text-muted small font-weight-bold'>EMAIL ADDRESS</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='rounded-pill px-4 py-2 border-0 shadow-sm'
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' }}
                ></Form.Control>
              </Form.Group>

              <div className='d-flex mb-4 mt-2' style={{ gap: '2rem' }}>
                <Form.Group controlId='isadmin' className='mb-0'>
                  <Form.Check
                    type='checkbox'
                    label='Is Admin'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className='custom-checkbox-dark text-white'
                  ></Form.Check>
                </Form.Group>

                <Form.Group controlId='isSeller' className='mb-0'>
                  <Form.Check
                    type='checkbox'
                    label='Is Seller'
                    checked={isSeller}
                    onChange={(e) => setIsSeller(e.target.checked)}
                    className='custom-checkbox-dark text-info font-weight-bold'
                  ></Form.Check>
                </Form.Group>
              </div>

              <Button type='submit' variant='primary' className='btn-checkout-animated w-100 rounded-pill py-3 font-weight-bold mt-2 shadow-lg'>
                UPDATE PERMISSIONS
              </Button>
            </Form>
          )}
        </div>
      </FormContainer>
    </>
  )
}

export default UserEditScreen
