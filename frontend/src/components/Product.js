import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 rounded overflow-hidden border-0 shadow-sm product-card-animated'>
      <Link to={`/product/${product._id}`}>
        <div className='product-img-wrapper'>
          <Card.Img src={product.image} variant='top' className='product-img-animated' />
        </div>
      </Link>

      <Card.Body className='p-4'>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='mb-2 text-truncate product-title-animated' style={{ color: 'var(--text-main)' }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='mb-3 text-muted' style={{ fontSize: '0.9rem' }}>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h4' style={{ color: 'var(--primary-color)', fontWeight: 'bold', margin: 0 }}>
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
