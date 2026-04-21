import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex align-items-center search-form-animated flex-nowrap'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-2 search-input-animated'
      ></Form.Control>
      <Button type='submit' variant='outline-warning' className='search-btn-animated flex-shrink-0 ml-2'>
        <i className="fas fa-search mr-1"></i> Search
      </Button>
    </Form>
  )
}

export default SearchBox
