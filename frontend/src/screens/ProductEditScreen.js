import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Spinner, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState(0)
  const [reservePrice, setReservePrice] = useState(0)
  const [uploading, setUploading] = useState(false)

  // AI Tool States
  const [aiTitle, setAiTitle] = useState('')
  const [aiCategory, setAiCategory] = useState('')
  const [aiDescription, setAiDescription] = useState('')
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceResult, setPriceResult] = useState(null)

  const [aiNotes, setAiNotes] = useState('')
  const [descLoading, setDescLoading] = useState(false)
  const [descResult, setDescResult] = useState(null)


  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        setStartingPrice(product.startingPrice || 0)
        setReservePrice(product.reservePrice || 0)
        
        // Prep AI initial values
        setAiTitle(product.name || '')
        setAiCategory(product.category || '')
        setAiDescription(product.description || '')
      }
    }
  }, [dispatch, history, productId, product, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    // Append new fields
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        startingPrice,
        reservePrice,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const handlePredictPrice = async () => {
    setPriceLoading(true)
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.post('/api/ai/suggest-price', { title: aiTitle, category: aiCategory, description: aiDescription }, config)
      setPriceResult(data)
    } catch (err) {
      console.error(err)
    }
    setPriceLoading(false)
  }

  const handleGenerateDescription = async () => {
    setDescLoading(true)
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await axios.post('/api/ai/generate-description', { keywords: aiNotes, imageKeywords: image }, config)
      setDescResult(data)
    } catch (err) {
      console.error(err)
    }
    setDescLoading(false)
  }




  return (
    <>
      <Link to='/admin/productlist' className='btn btn-outline-primary rounded-pill mb-4 px-4 py-2 font-weight-bold shadow-sm' style={{ color: 'var(--primary-color)', borderWidth: '2px' }}>
        <i className='fas fa-arrow-left mr-2'></i> GO BACK
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId='startingPrice'>
                  <Form.Label>Starting Price (Auction)</Form.Label>
                  <Form.Control type='number' value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)}></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId='reservePrice'>
                  <Form.Label>Reserve Price (Auction)</Form.Label>
                  <Form.Control type='number' value={reservePrice} onChange={(e) => setReservePrice(e.target.value)}></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4"/>

            <h3 className="mb-3"><i className="fas fa-robot text-primary"></i> Smart AI Tools</h3>
            
            <Row className="mb-4">
              <Col md={12}>
                <Card className="shadow-sm mb-4 border-primary">
                  <Card.Header className="bg-primary text-white font-weight-bold">
                    1. AI Price Predictor
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="aiTitle">
                          <Form.Label className="small font-weight-bold">Product Title</Form.Label>
                          <Form.Control type="text" size="sm" value={aiTitle} onChange={(e) => setAiTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="aiCategory">
                          <Form.Label className="small font-weight-bold">Category</Form.Label>
                          <Form.Control type="text" size="sm" value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="aiDescription">
                          <Form.Label className="small font-weight-bold">Short Description</Form.Label>
                          <Form.Control as="textarea" rows={2} size="sm" value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} />
                        </Form.Group>
                        <Button variant="outline-primary" size="sm" onClick={handlePredictPrice} disabled={priceLoading}>
                          {priceLoading ? <><Spinner animation="border" size="sm"/> Analyzing product...</> : 'Predict Price'}
                        </Button>
                      </Col>
                      <Col md={6}>
                        {priceResult ? (
                          <div className="p-3 bg-light rounded h-100 d-flex flex-column justify-content-center">
                            <h6 className="text-secondary mb-3"><i className="fas fa-chart-line"></i> Prediction Results</h6>
                            <div className="d-flex justify-content-between mb-2"><strong>Suggested Start:</strong> <span className="text-success">${priceResult.suggestedStartingPrice}</span></div>
                            <div className="d-flex justify-content-between mb-2"><strong>Estimated Final:</strong> <span className="text-primary">${priceResult.estimatedFinalPrice}</span></div>
                            <div className="d-flex justify-content-between mb-3"><strong>Suggested Reserve:</strong> <span className="text-muted">${priceResult.suggestedReservePrice}</span></div>
                            <Badge variant="info" className="mb-3 p-2 text-wrap text-left">Highly confident based on {aiCategory || 'given'} category and market trends.</Badge>
                            
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => {
                                setStartingPrice(priceResult.suggestedStartingPrice);
                                setReservePrice(priceResult.suggestedReservePrice);
                                setPrice(priceResult.estimatedFinalPrice);
                              }}>
                              Apply Suggestion to Form
                            </Button>
                          </div>
                        ) : (
                          <div className="p-3 bg-light rounded h-100 d-flex align-items-center justify-content-center text-muted text-center">
                            <small>Enter details and click Predict to see market estimates.</small>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="shadow-sm border-info">
                  <Card.Header className="bg-info text-white font-weight-bold">
                    2. AI Product Description Generator
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="aiNotes">
                          <Form.Label className="small font-weight-bold">Short Notes / Key Selling Points</Form.Label>
                          <Form.Control as="textarea" rows={3} size="sm" placeholder="E.g., mint condition, fast shipping, rare color..." value={aiNotes} onChange={(e) => setAiNotes(e.target.value)} />
                        </Form.Group>
                        <Button variant="outline-info" size="sm" onClick={handleGenerateDescription} disabled={descLoading}>
                          {descLoading ? <><Spinner animation="border" size="sm"/> Generating description...</> : 'Generate Product Description'}
                        </Button>
                      </Col>
                      <Col md={6}>
                        {descResult ? (
                          <div className="p-3 bg-light rounded h-100">
                            <h6 className="font-weight-bold text-dark">{descResult.generatedTitle}</h6>
                            <p className="small text-muted mb-2">{descResult.generatedDescription}</p>
                            <p className="small font-italic text-info mb-3">"{descResult.marketingCopy}"</p>
                            
                            <div className="d-flex flex-wrap gap-2 mt-auto">
                              <Button variant="outline-secondary" size="sm" className="mr-2 mb-2" onClick={() => navigator.clipboard.writeText(descResult.generatedDescription)}>
                                <i className="fas fa-copy"></i> Copy Text
                              </Button>
                              <Button variant="outline-primary" size="sm" className="mr-2 mb-2" onClick={handleGenerateDescription}>
                                <i className="fas fa-sync"></i> Regenerate
                              </Button>
                              <Button variant="info" size="sm" className="mb-2" onClick={() => {
                                setName(descResult.generatedTitle);
                                setDescription(descResult.generatedDescription);
                              }}>
                                Use in Form
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-light rounded h-100 d-flex align-items-center justify-content-center text-muted text-center">
                            <small>Provide short notes to generate a full SEO-friendly description.</small>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>



            <Button type='submit' variant='primary' className="btn-block btn-lg btn-checkout-animated">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
