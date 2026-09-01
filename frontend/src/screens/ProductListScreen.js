import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Badge, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Price from '../components/Price'
import {
  listProducts,
  deleteProduct,
  createProduct,
  republishAuctions,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET, PRODUCT_REPUBLISH_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productRepublish = useSelector((state) => state.productRepublish)
  const {
    loading: loadingRepublish,
    error: errorRepublish,
    success: successRepublish,
    message: messageRepublish,
  } = productRepublish

  const [status, setStatus] = useState('live')
  const [selectedProducts, setSelectedProducts] = useState([])

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber, '', status, 10))
      window.scrollTo(0, 0); // Scroll to the top of the page
    }

    if (successRepublish) {
      setTimeout(() => {
        dispatch({ type: PRODUCT_REPUBLISH_RESET })
      }, 3000)
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
    status,
    successRepublish,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  const republishHandler = () => {
    if (window.confirm('Are you sure you want to republish all ended auctions? They will be extended by 24 hours.')) {
      dispatch(republishAuctions())
    }
  }

  const republishSelectedHandler = () => {
    if (selectedProducts.length === 0) return
    if (window.confirm(`Are you sure you want to republish ${selectedProducts.length} selected auctions? They will be extended by 24 hours.`)) {
      dispatch(republishAuctions(selectedProducts))
      setSelectedProducts([])
    }
  }

  const toggleSelection = (id) => {
    setSelectedProducts((prev) => 
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    )
  }

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((p) => p._id))
    } else {
      setSelectedProducts([])
    }
  }

  return (
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom d-flex align-items-center justify-content-between flex-wrap' style={{ gap: '1rem', borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className="mb-0 font-weight-bold text-white" style={{ letterSpacing: '1px' }}>Products Inventory</h3>
        <div className="d-flex" style={{ gap: '1rem' }}>
          {selectedProducts.length > 0 ? (
            <Button variant="outline-success" className="px-3 py-2 font-weight-bold shadow-sm" onClick={republishSelectedHandler} disabled={loadingRepublish}>
              {loadingRepublish ? <Loader /> : <><i className='fas fa-sync-alt me-2'></i> Republish Selected ({selectedProducts.length})</>}
            </Button>
          ) : (
            <Button variant="outline-success" className="px-3 py-2 font-weight-bold shadow-sm" onClick={republishHandler} disabled={loadingRepublish}>
              {loadingRepublish ? <Loader /> : <><i className='fas fa-sync-alt me-2'></i> Republish Ended</>}
            </Button>
          )}
          <LinkContainer to='/seller/create-listing'>
            <Button variant="primary" className="px-4 py-2 font-weight-bold shadow-sm">
              <i className='fas fa-plus me-2'></i> Add Product
            </Button>
          </LinkContainer>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="d-flex align-items-center flex-wrap" style={{ gap: '0.5rem' }}>
          <Button 
            variant={status === 'live' ? 'primary' : 'outline-light'} 
            size="sm" 
            className="rounded-pill px-3" 
            onClick={() => setStatus('live')}
          >
            Live & Active
          </Button>
          <Button 
            variant={status === 'outOfStock' ? 'primary' : 'outline-light'} 
            size="sm" 
            className="rounded-pill px-3" 
            onClick={() => setStatus('outOfStock')}
          >
            Out of Stock
          </Button>
          <Button 
            variant={status === 'ended' ? 'primary' : 'outline-light'} 
            size="sm" 
            className="rounded-pill px-3" 
            onClick={() => setStatus('ended')}
          >
            Ended Auctions
          </Button>
          <Button 
            variant={status === 'all' ? 'primary' : 'outline-light'} 
            size="sm" 
            className="rounded-pill px-3" 
            onClick={() => setStatus('all')}
          >
            All Products
          </Button>
        </div>
      </div>

      <div className="p-4">
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loadingRepublish && <Loader />}
        {errorRepublish && <Message variant='danger'>{errorRepublish}</Message>}
        {successRepublish && <Message variant='success'>{messageRepublish}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : products.length === 0 ? (
          <div className="empty-state-glass">
            <i className="fas fa-boxes"></i>
            <h4 className="text-white">No Inventory Found</h4>
            <p className="text-muted">There are currently no products available in the database.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <tr>
                    <th className="px-3 py-3">
                      <Form.Check 
                        type="checkbox" 
                        onChange={selectAll} 
                        checked={products.length > 0 && selectedProducts.length === products.length} 
                      />
                    </th>
                    <th className="px-3 py-3 text-muted small">ID</th>
                    <th className="px-3 py-3 text-white small">NAME</th>
                    <th className="px-3 py-3 text-white small">PRICE</th>
                    <th className="px-3 py-3 text-white small">CATEGORY</th>
                    <th className="px-3 py-3 text-white small">STATUS</th>
                    <th className="px-3 py-3 text-white small text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                      <td className="px-3 py-3">
                        <Form.Check 
                          type="checkbox" 
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelection(product._id)}
                        />
                      </td>
                      <td className="px-3 py-3 text-muted small" style={{ fontFamily: 'monospace' }}>{product._id}</td>
                      <td className="px-3 py-3 font-weight-bold text-white">{product.name}</td>
                      <td className="px-3 py-3 text-success font-weight-bold"><Price amount={product.price} /></td>
                      <td className="px-3 py-3">{product.category}</td>
                      <td className="px-3 py-3">
                        {product.auctionMode ? (
                          (product.isAuctionClosed || (product.auctionEndTime && new Date(product.auctionEndTime) < new Date())) ? (
                            <Badge pill style={{ backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff4d4d', border: '1px solid rgba(220, 53, 69, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-times-circle mr-1"></i> Ended
                            </Badge>
                          ) : (
                            <Badge pill style={{ backgroundColor: 'rgba(57, 255, 20, 0.15)', color: '#39ff14', border: '1px solid rgba(57, 255, 20, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-gavel mr-1"></i> Live
                            </Badge>
                          )
                        ) : (
                          product.countInStock === 0 ? (
                            <Badge pill style={{ backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-exclamation-triangle mr-1"></i> Sold Out
                            </Badge>
                          ) : (
                            <Badge pill style={{ backgroundColor: 'rgba(100, 180, 255, 0.15)', color: '#64b4ff', border: '1px solid rgba(100, 180, 255, 0.3)', fontSize: '0.72rem', padding: '4px 10px' }}>
                              <i className="fas fa-check-circle mr-1"></i> Active
                            </Badge>
                          )
                        )}
                      </td>
                      <td className="px-3 py-3 text-end d-flex justify-content-end" style={{ gap: '0.8rem' }}>
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                          <Button variant='dark' className='btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center' style={{ backgroundColor: '#1a2838', width: '35px', height: '35px', padding: 0 }}>
                            <i className='fas fa-edit text-info'></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='dark'
                          className='btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center'
                          onClick={() => deleteHandler(product._id)}
                          style={{ backgroundColor: '#1a2838', width: '35px', height: '35px', padding: 0 }}
                        >
                          <i className='fas fa-trash text-danger'></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </div>
    </div>
  )
}

export default ProductListScreen
