import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom' style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className='mb-0 font-weight-bold text-white' style={{ letterSpacing: '1px' }}>USERS MANAGEMENT</h3>
      </div>
      <div className='p-4' style={{ backgroundColor: '#0b1521' }}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : users.length === 0 ? (
          <div className="empty-state-glass">
            <i className="fas fa-users-slash"></i>
            <h4 className="text-white">No Users Found</h4>
            <p className="text-muted">There are no users registered in the platform yet.</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className='px-3 py-3 text-muted small'>ID</th>
                  <th className='px-3 py-3 text-white small'>NAME</th>
                  <th className='px-3 py-3 text-white small'>EMAIL</th>
                  <th className='px-3 py-3 text-center text-white small'>ADMIN</th>
                  <th className='px-3 py-3 text-center text-white small'>SELLER</th>
                  <th className='px-3 py-3 text-end text-white small'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className='border-bottom' style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <td className='px-3 py-3 text-muted small' style={{ fontFamily: 'monospace' }}>{user._id}</td>
                    <td className='px-3 py-3 font-weight-bold text-white'>{user.name}</td>
                    <td className='px-3 py-3'>
                      <a href={`mailto:${user.email}`} style={{ textDecoration: 'none', color: '#829ab1' }}>{user.email}</a>
                    </td>
                    <td className='px-3 py-3 text-center' style={{ minWidth: '100px' }}>
                      {user.isAdmin ? (
                        <div className="d-flex align-items-center justify-content-center">
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#39ff14', boxShadow: '0 0 10px #39ff14', marginRight: '8px' }}></div>
                           <span className='text-success small font-weight-bold'>YES</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', marginRight: '8px' }}></div>
                           <span className='text-muted small'>NO</span>
                        </div>
                      )}
                    </td>
                    <td className='px-3 py-3 text-center' style={{ minWidth: '100px' }}>
                      {user.isSeller ? (
                        <div className="d-flex align-items-center justify-content-center">
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0ea5e9', boxShadow: '0 0 10px #0ea5e9', marginRight: '8px' }}></div>
                           <span className='text-info small font-weight-bold'>YES</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', marginRight: '8px' }}></div>
                           <span className='text-muted small'>NO</span>
                        </div>
                      )}
                    </td>
                    <td className='px-3 py-3 text-end'>
                      <div className='d-flex justify-content-end' style={{ gap: '0.8rem' }}>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant='dark' className='btn-sm rounded-circle shadow-sm border-0' style={{ backgroundColor: '#1a2838', width: '35px', height: '35px' }}>
                            <i className='fas fa-edit text-info'></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='dark'
                          className='btn-sm rounded-circle shadow-sm border-0'
                          onClick={() => deleteHandler(user._id)}
                          style={{ backgroundColor: '#1a2838', width: '35px', height: '35px' }}
                        >
                          <i className='fas fa-trash text-danger'></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserListScreen
