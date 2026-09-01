import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from 'react-bootstrap'
import Rating from './Rating'

import Price from './Price'

const Product = ({ product }) => {
  const isAuction = product.auctionMode

  return (
    <Card className={`my-3 rounded overflow-hidden border-0 shadow-sm product-card-animated ${isAuction ? 'auction-card-premium' : ''}`}>
      <Link to={`/product/${product._id}`}>
        <div className='product-img-wrapper'>
          {isAuction && (
            <div className="auction-badge-overlay">
              <Badge bg="danger" className="auction-badge pulse">
                <i className="fas fa-gavel mr-1"></i> LIVE AUCTION
              </Badge>
            </div>
          )}
          <Card.Img src={product.image} variant='top' className='product-img-animated' />
        </div>
      </Link>

      <Card.Body className='p-4'>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='mb-2 text-truncate product-title-animated' style={{ color: 'var(--text-main)' }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {!isAuction && (
          <Card.Text as='div' className='mb-3 text-muted' style={{ fontSize: '0.9rem' }}>
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </Card.Text>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <Card.Text as='h4' style={{ color: isAuction ? '#39ff14' : 'var(--primary-color)', fontWeight: 'bold', margin: 0 }}>
            <Price amount={isAuction ? (product.currentBid || product.startingPrice || product.price) : product.price} />
          </Card.Text>
          {isAuction && (
            <span className="text-muted small font-weight-bold">Current Bid</span>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default Product
