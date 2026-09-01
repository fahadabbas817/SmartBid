import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listContactus  } from '../actions/contactusAction'

const QueryListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userFormList = useSelector((state) => state.userFormList)
  const { loading, error, contactus } = userFormList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listContactus())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  

  return (
    <>
      <h1>QUERIES</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : !contactus || contactus.length === 0 ? (
        <div className="empty-state-glass">
            <i className="fas fa-envelope-open-text"></i>
            <h4 className="text-white">No Queries Found</h4>
            <p className="text-muted">You have no customer support queries at this time.</p>
        </div>
      ) : (
        <div className="table-responsive bg-transparent rounded mt-3">
        <Table hover variant='dark' className='table-custom-dark table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>SUBJECT</th>
              <th>MESSAGE</th>
            </tr>
          </thead>
          <tbody>
            {contactus.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.subject}</td>
                <td>{user.text}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      )}
    </>
  )
}

export default QueryListScreen
