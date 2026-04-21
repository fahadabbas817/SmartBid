import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <Row className="py-4 animate-fade-in">
      <Col md={8}>
        <h1 className="mb-4 font-weight-bold" style={{ color: 'var(--text-main)' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/' className='text-info font-weight-bold ml-2' style={{ textDecoration: 'none' }}>GO BACK <i className='fas fa-undo ml-1'></i></Link>
          </Message>
        ) : (
          <ListGroup variant='flush' className="animate-slide-up delay-100">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className="bg-transparent border-0 mb-3 px-0">
                <div className="glass-card p-4 rounded-lg shadow-sm glow-card border-0">
                  <Row>
                    <Col md={2} className="mb-3 mb-md-0">
                      <div className="product-img-wrapper rounded overflow-hidden shadow-sm" style={{ maxHeight: '100px' }}>
                        <Image src={item.image} alt={item.name} fluid className="product-img-animated w-100 h-100" style={{ objectFit: 'cover' }} />
                      </div>
                    </Col>
                    <Col md={3} className="d-flex align-items-center mb-2 mb-md-0">
                      <Link to={`/product/${item.product}`} className="font-weight-bold text-dark text-decoration-none" style={{ fontSize: '1.1rem' }}>{item.name}</Link>
                    </Col>
                    <Col md={2} className="d-flex align-items-center mb-2 mb-md-0 font-weight-bold" style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>${item.price}</Col>
                    <Col md={3} className="d-flex align-items-center mb-2 mb-md-0">
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                        className="rounded border-0 bg-light shadow-sm"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2} className="d-flex align-items-center justify-content-md-end">
                      <Button
                        type='button'
                        variant='light'
                        className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', transition: 'all 0.2s', backgroundColor: '#fee2e2', color: '#ef4444' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fecaca'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.transform = 'scale(1)'; }}
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className="animate-slide-up delay-200 mt-4 mt-md-0">
        <Card className="checkout-card-premium border-0 shadow-lg">
          <ListGroup variant='flush'>
            <ListGroup.Item className="bg-transparent border-bottom border-secondary pb-4">
              <h3 className="text-white font-weight-bold mb-3">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h3>
              <div className="d-flex justify-content-between align-items-end">
                <span className="text-slate-muted font-weight-bold">Total Price:</span>
                <span className="text-white font-weight-bold" style={{ fontSize: '1.8rem' }}>
                  ${cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent pt-4 border-0">
              <Button
                type='button'
                className='btn-block btn-checkout-animated py-3 font-weight-bold'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{ fontSize: '1.1rem', letterSpacing: '1px' }}
              >
                Proceed To Checkout <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
