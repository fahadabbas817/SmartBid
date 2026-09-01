import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Price from '../components/Price'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom' style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className="mb-0 font-weight-bold text-white" style={{ letterSpacing: '1px' }}>ORDERS MANAGEMENT</h3>
      </div>
      <div className="p-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : orders.length === 0 ? (
          <div className="empty-state-glass">
            <i className="fas fa-box-open"></i>
            <h4 className="text-white">No Orders Found</h4>
            <p className="text-muted">There are currently no orders in the system.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className="px-3 py-3 text-muted small">ID</th>
                  <th className="px-3 py-3 text-white small">USER</th>
                  <th className="px-3 py-3 text-white small">DATE</th>
                  <th className="px-3 py-3 text-white small">TOTAL</th>
                  <th className="px-3 py-3 text-white small text-center">PAID</th>
                  <th className="px-3 py-3 text-white small text-center">DELIVERED</th>
                  <th className="px-3 py-3 text-white small text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <td className="px-3 py-3 text-muted small" style={{ fontFamily: 'monospace' }}>{order._id}</td>
                    <td className="px-3 py-3 font-weight-bold text-white">{order.user && order.user.name}</td>
                    <td className="px-3 py-3">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-3 py-3 text-success font-weight-bold"><Price amount={order.totalPrice} /></td>
                    <td className="px-3 py-3 text-center">
                      {order.isPaid ? (
                        <div className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">{order.paidAt.substring(0, 10)}</div>
                      ) : (
                        <div className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm">Not Paid</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {order.isDelivered ? (
                        <div className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">{order.deliveredAt.substring(0, 10)}</div>
                      ) : (
                        <div className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm">Not Delivered</div>
                      )}
                    </td>
                    <td className="px-3 py-3 align-middle text-end d-flex justify-content-end">
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant='info' className='btn-sm font-weight-bold px-4 py-2 text-white' style={{ borderRadius: '8px', borderWidth: '2px' }}>
                          DETAILS
                        </Button>
                      </LinkContainer>
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

export default OrderListScreen
