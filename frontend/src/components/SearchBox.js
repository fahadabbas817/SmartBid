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
    <Form onSubmit={submitHandler} className="d-flex align-items-center position-relative w-100 m-0">
      <i
        className="fas fa-search position-absolute text-muted"
        style={{ left: "15px", zIndex: 5 }}
      ></i>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search items..."
        className="form-control search-input-animated border-0 text-white rounded-pill shadow-none focus-ring-primary"
        style={{
          paddingLeft: "40px",
          width: "220px",
          backgroundColor: "#0b1521",
        }}
        autoComplete="off"
      ></Form.Control>
    </Form>
  )
}

export default SearchBox
