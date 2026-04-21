import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Paginate from '../components/Paginate'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

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

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom d-flex align-items-center justify-content-between flex-wrap' style={{ gap: '1rem', borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className="mb-0 font-weight-bold text-white" style={{ letterSpacing: '1px' }}>Products Inventory</h3>
        <LinkContainer to='/seller/create-listing'>
          <Button variant="primary" className="px-4 py-2 font-weight-bold shadow-sm">
            <i className='fas fa-plus me-2'></i> Add Product
          </Button>
        </LinkContainer>
      </div>

      <div className="p-4">
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <tr>
                    <th className="px-3 py-3 text-muted small">ID</th>
                    <th className="px-3 py-3 text-white small">NAME</th>
                    <th className="px-3 py-3 text-white small">PRICE</th>
                    <th className="px-3 py-3 text-white small">CATEGORY</th>
                    <th className="px-3 py-3 text-white small">BRAND</th>
                    <th className="px-3 py-3 text-white small text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                      <td className="px-3 py-3 text-muted small" style={{ fontFamily: 'monospace' }}>{product._id}</td>
                      <td className="px-3 py-3 font-weight-bold text-white">{product.name}</td>
                      <td className="px-3 py-3 text-success font-weight-bold">${product.price}</td>
                      <td className="px-3 py-3">{product.category}</td>
                      <td className="px-3 py-3">{product.brand}</td>
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
                  {(!products || products.length === 0) && (
                    <EmptyState message="No products found." columns="6" icon="fas fa-box-open" />
                  )}
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
