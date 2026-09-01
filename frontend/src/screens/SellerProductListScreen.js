import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listMyProducts, deleteProduct } from '../actions/productActions'

const SellerProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const sellerProductList = useSelector((state) => state.sellerProductList)
  const { loading, error, products = [], page, pages } = sellerProductList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || (!userInfo.isSeller && !userInfo.isAdmin)) {
      history.push('/login')
    } else {
      dispatch(listMyProducts(pageNumber))
      window.scrollTo(0, 0)
    }
  }, [dispatch, history, userInfo, successDelete, pageNumber])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <div
      className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4'
      style={{ backgroundColor: '#0b1521 !important' }}
    >
      {/* Header */}
      <div
        className='p-4 border-bottom d-flex align-items-center justify-content-between flex-wrap'
        style={{ gap: '1rem', borderColor: 'rgba(255,255,255,0.05) !important' }}
      >
        <div>
          <h3
            className='mb-0 font-weight-bold text-white'
            style={{ letterSpacing: '1px' }}
          >
            My Listings
          </h3>
          <p className='text-muted mb-0 small mt-1'>
            Products you have listed on SmartBid
          </p>
        </div>

        <LinkContainer to='/seller/create-listing'>
          <Button
            variant='primary'
            className='px-4 py-2 font-weight-bold shadow-sm'
          >
            <i className='fas fa-plus me-2'></i> New Listing
          </Button>
        </LinkContainer>
      </div>

      {/* Body */}
      <div className='p-4'>
        {loadingDelete && <Loader />}
        {errorDelete && (
          <Message variant='danger'>{errorDelete}</Message>
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : products.length === 0 ? (
          <div className='empty-state-glass text-center py-5'>
            <i
              className='fas fa-box-open mb-3'
              style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.15)' }}
            ></i>
            <h4 className='text-white'>No Listings Yet</h4>
            <p className='text-muted'>
              You haven't listed any products yet. Click "New Listing" to get
              started.
            </p>
            <LinkContainer to='/seller/create-listing'>
              <Button variant='primary' className='mt-2 px-4 py-2 font-weight-bold rounded-pill shadow-sm'>
                <i className='fas fa-magic mr-2'></i> Create Smart Listing
              </Button>
            </LinkContainer>
          </div>
        ) : (
          <>
            <div className='table-responsive mb-4'>
              <Table
                hover
                variant='dark'
                className='table-custom-dark align-middle mb-0'
                style={{ backgroundColor: '#0b1521' }}
              >
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <tr>
                    <th className='px-3 py-3 text-muted small'>ID</th>
                    <th className='px-3 py-3 text-white small'>NAME</th>
                    <th className='px-3 py-3 text-white small'>PRICE</th>
                    <th className='px-3 py-3 text-white small'>CATEGORY</th>
                    <th className='px-3 py-3 text-white small'>STATUS</th>
                    <th className='px-3 py-3 text-white small text-end'>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className='border-bottom'
                      style={{
                        borderColor: 'rgba(255,255,255,0.05) !important',
                      }}
                    >
                      <td
                        className='px-3 py-3 text-muted small'
                        style={{ fontFamily: 'monospace' }}
                      >
                        {product._id}
                      </td>
                      <td className='px-3 py-3 font-weight-bold text-white'>
                        {product.name}
                      </td>
                      <td className='px-3 py-3 text-success font-weight-bold'>
                        ${product.price}
                      </td>
                      <td className='px-3 py-3'>{product.category}</td>
                      <td className='px-3 py-3'>
                        {product.auctionMode ? (
                          (product.isAuctionClosed || (product.auctionEndTime && new Date(product.auctionEndTime) < new Date())) ? (
                            <Badge pill style={{ backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff4d4d', border: '1px solid rgba(220, 53, 69, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-times-circle mr-1"></i> Ended
                            </Badge>
                          ) : (
                            <Badge pill style={{ backgroundColor: 'rgba(57,255,20,0.15)', color: '#39ff14', border: '1px solid rgba(57,255,20,0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className='fas fa-gavel mr-1'></i> Live
                            </Badge>
                          )
                        ) : (
                          product.countInStock === 0 ? (
                            <Badge pill style={{ backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-exclamation-triangle mr-1"></i> Sold Out
                            </Badge>
                          ) : (
                            <Badge pill style={{ backgroundColor: 'rgba(100,180,255,0.15)', color: '#64b4ff', border: '1px solid rgba(100,180,255,0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className='fas fa-tag mr-1'></i> Active
                            </Badge>
                          )
                        )}
                      </td>
                      <td className='px-3 py-3 text-end d-flex justify-content-end' style={{ gap: '0.8rem' }}>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}
                        >
                          <Button
                            variant='dark'
                            className='btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center'
                            style={{
                              backgroundColor: '#1a2838',
                              width: '35px',
                              height: '35px',
                              padding: 0,
                            }}
                            title='Edit'
                          >
                            <i className='fas fa-edit text-info'></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='dark'
                          className='btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center'
                          onClick={() => deleteHandler(product._id)}
                          style={{
                            backgroundColor: '#1a2838',
                            width: '35px',
                            height: '35px',
                            padding: 0,
                          }}
                          title='Delete'
                        >
                          <i className='fas fa-trash text-danger'></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {pages > 1 && (
              <Paginate
                pages={pages}
                page={page}
                isAdmin={false}
                sellerBase='/seller/products'
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SellerProductListScreen
