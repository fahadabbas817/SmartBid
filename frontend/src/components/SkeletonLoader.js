import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../index.css';

const SkeletonLoader = ({ type = 'product' }) => {
  if (type === 'product-details') {
    return (
      <div className="w-100 p-4">
        <Row>
          <Col md={6}>
             <div className="skeleton-box rounded mb-4" style={{ height: '400px', width: '100%' }}></div>
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center pl-lg-5">
             <div className="skeleton-box rounded mb-4" style={{ height: '40px', width: '80%' }}></div>
             <div className="skeleton-box rounded mb-3" style={{ height: '20px', width: '40%' }}></div>
             <div className="skeleton-box rounded mb-4" style={{ height: '80px', width: '60%' }}></div>
             <div className="skeleton-box rounded-pill mb-4" style={{ height: '50px', width: '100%' }}></div>
             <div className="skeleton-box rounded" style={{ height: '150px', width: '100%' }}></div>
          </Col>
        </Row>
      </div>
    );
  }

  // Default 'product' card skeleton for grids
  return (
    <div className="skeleton-wrapper p-3 rounded" style={{ backgroundColor: '#0b1521', border: '1px solid #1a2838' }}>
      <div className="skeleton-box rounded mb-3" style={{ height: '200px', width: '100%' }}></div>
      <div className="skeleton-box rounded mb-2" style={{ height: '20px', width: '80%' }}></div>
      <div className="skeleton-box rounded mb-3" style={{ height: '20px', width: '50%' }}></div>
      <Row>
        <Col><div className="skeleton-box rounded" style={{ height: '40px', width: '100%' }}></div></Col>
        <Col><div className="skeleton-box rounded" style={{ height: '40px', width: '100%' }}></div></Col>
      </Row>
    </div>
  );
};

export default SkeletonLoader;
