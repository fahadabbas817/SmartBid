import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../index.css'


function AboutScreen() {
  return (
    <div className='aboutus py-5 animate-fade-in'>
      <Container>
        <div className="text-center mb-5 animate-slide-up">
          <h1 className='display-4 font-weight-bold mb-3 text-white'>About <span style={{ color: 'var(--primary-color)' }}>Smart Bid</span></h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
            At our premium bidding platform, we offer a vast range of exclusive items, from vintage fashion and beauty to rare electronics and collectibles. Our team carefully curates each auction to ensure that it meets our high standards of quality and authenticity.
          </p>
        </div>

        <Row className="mb-5 align-items-center animate-slide-up delay-100">
          <Col md={6} className='mb-4 mb-md-0'>
            <div className="glass-card p-5 rounded-lg h-100 glow-card border-0">
              <h2 className="font-weight-bold mb-4" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-history mr-3" style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}></i> Our Story
              </h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Our journey began in 2022 when we noticed a gap in the market for secure, reliable live-bidding platforms. We started small, hosting exclusive events, but quickly expanded as our enthusiastic community of collectors grew.
              </p>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Today, we are proud to connect thousands of buyers with unique products sourced from the best manufacturers and private sellers globally.
              </p>
            </div>
          </Col>
          <Col md={6} className='text-center'>
            <div className="product-img-wrapper rounded-lg shadow-lg overflow-hidden" style={{ height: 'auto', maxHeight: '400px' }}>
              <img className='img-fluid product-img-animated' src={require('./images/about.png')} alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Col>
        </Row>

        <Row className="mb-5 align-items-center flex-column-reverse flex-md-row animate-slide-up delay-200">
          <Col md={6} className='text-center mb-4 mb-md-0'>
            <div className="product-img-wrapper rounded-lg shadow-lg overflow-hidden" style={{ height: 'auto', maxHeight: '400px' }}>
              <img className='img-fluid product-img-animated' src={require('./images/img.jpg')} alt="Our Mission" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Col>
          <Col md={6}>
            <div className="glass-card p-5 rounded-lg h-100 glow-card border-0">
              <h2 className="font-weight-bold mb-4" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-bullseye mr-3" style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}></i> Our Mission
              </h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Our mission at Smart Bid is to provide our users with a thrilling, transparent, and seamlessly enjoyable auction experience. We strive to offer an elite selection of top-tier products at fair competitive prices, backed by instant fast-shipping.
              </p>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                We believe in ethical sourcing, contributing to a better future for our dedicated customers. We're continuously evolving our tech so you never miss a bid.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="animate-slide-up delay-300">
          <Col xs={12}>
            <div className="checkout-card-premium p-5 text-center shadow-lg">
              <h2 className="font-weight-bold text-white mb-4">Meet Our Exceptional Team</h2>
              <p className="text-slate-muted mx-auto mb-0" style={{ maxWidth: '900px', fontSize: '1.1rem', lineHeight: '1.8' }}>
                We are a dedicated collective of tech professionals who are deeply passionate about e-commerce and creating the ultimate bidding arena. Our team spans experts in secure transactions, real-time live streaming, and dedicated customer success. If you ever have questions, we are here for you 24/7.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AboutScreen
