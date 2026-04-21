import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
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
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom' style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className="mb-0 font-weight-bold text-white" style={{ letterSpacing: '1px' }}>USER QUERIES MANAGEMENT</h3>
      </div>
      <div className="p-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <div className="table-responsive">
            <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className="px-3 py-3 text-muted small">ID</th>
                  <th className="px-3 py-3 text-white small">NAME</th>
                  <th className="px-3 py-3 text-white small">EMAIL</th>
                  <th className="px-3 py-3 text-white small">SUBJECT</th>
                  <th className="px-3 py-3 text-white small">MESSAGE</th>
                </tr>
              </thead>
              <tbody>
                {contactus && contactus.map((user) => (
                  <tr key={user._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <td className="px-3 py-3 text-muted small" style={{ fontFamily: 'monospace' }}>{user._id}</td>
                    <td className="px-3 py-3 font-weight-bold text-white">{user.name}</td>
                    <td className="px-3 py-3">
                      <a href={`mailto:${user.email}`} style={{ textDecoration: 'none', color: '#829ab1' }}>{user.email}</a>
                    </td>
                    <td className="px-3 py-3 font-weight-bold text-white">{user.subject}</td>
                    <td className="px-3 py-3 text-muted">{user.text}</td>
                  </tr>
                ))}
                {(!contactus || contactus.length === 0) && (
                  <EmptyState message="No queries found." columns="5" icon="fas fa-envelope-open" />
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

export default QueryListScreen
