import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import MiniCountdown from './MiniCountdown'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div className="mb-5 animate-slide-up delay-100">
      <Carousel pause='hover' className='rounded-lg overflow-hidden shadow-sm' style={{ border: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
        {products.map((product) => (
          <Carousel.Item key={product._id} className="py-5">
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="product-img-wrapper mb-4" style={{ height: '350px', width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    className="product-img-animated drop-shadow-lg"
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src="/images/sample.jpg" }}
                  />
                </div>
                <Carousel.Caption className='carousel-caption position-static mt-3'>
                  <div className="glass-card p-4 rounded-lg d-inline-block shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
                    <h3 className="mb-2 font-weight-bold" style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>
                      {product.name}
                    </h3>
                    <div className="d-inline-flex flex-column align-items-center justify-content-center">
                      <div className="d-inline-flex align-items-center justify-content-center bg-light px-3 py-1 rounded-pill mb-2">
                        <span className="font-weight-bold" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>${product.price}</span>
                      </div>
                      {product.auctionMode && product.auctionEndTime && (
                         <div className="mt-1">
                           <MiniCountdown endTime={product.auctionEndTime} />
                         </div>
                      )}
                    </div>
                  </div>
                </Carousel.Caption>
              </div>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default ProductCarousel
