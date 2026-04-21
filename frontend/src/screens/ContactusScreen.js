import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { contactList } from '../actions/contactusAction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

const ContactusScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userContactus = useSelector((state) => state.userContactus);
  const { loading, error, userInfo } = userContactus;

  // const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      setMessage('Your Message has been Sent Successfully!');

      // Clear the success message after 3 seconds
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);

      // Cleanup the timer when the component unmounts or the message changes
      return () => clearTimeout(timer);
    }
  }, [userInfo]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(contactList(name, email, subject, text));
    setName('');
    setEmail('');
    setSubject('');
    setText('');
  };
  return (
    <div className='contactus py-5 animate-fade-in'>
      <Container>
        <div className="text-center mb-5 animate-slide-up">
          <h1 className='display-4 font-weight-bold mb-3' style={{ color: 'var(--primary-color)' }}>Get in <span style={{ color: 'var(--accent-color)' }}>Touch</span></h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Have a question about an auction, or just want to say hi? We'd love to hear from you. Reach out to our team using the form or the details below.
          </p>
        </div>

        <Row className="mb-5 animate-slide-up delay-100">
          <Col md={3} sm={6} className="mb-4">
            <div className="glass-card text-center p-4 rounded-lg h-100 glow-card border-0">
              <div className="icon-container mb-3" style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>
                <i className="fas fa-location-arrow"></i>
              </div>
              <h4 className="font-weight-bold mb-3" style={{ color: 'var(--text-main)' }}>Address</h4>
              <p className="text-muted mb-1">Avenue 1, Khayaban-e-Jinnah,</p>
              <p className="text-muted mb-1">Johar Town, Lahore</p>
              <p className="text-muted mb-0">Punjab, Pakistan</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="glass-card text-center p-4 rounded-lg h-100 glow-card border-0">
              <div className="icon-container mb-3" style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>
                <i className="fa fa-phone"></i>
              </div>
              <h4 className="font-weight-bold mb-3" style={{ color: 'var(--text-main)' }}>Phone</h4>
              <p className="text-muted mb-1">Mobile: +92 312 345 678</p>
              <p className="text-muted mb-1">Landline: 042 123 4567</p>
              <p className="text-muted mb-0">Fax: +92 42 987 6543</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="glass-card text-center p-4 rounded-lg h-100 glow-card border-0">
              <div className="icon-container mb-3" style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>
                <i className="fa fa-envelope-open"></i>
              </div>
              <h4 className="font-weight-bold mb-3" style={{ color: 'var(--text-main)' }}>Email</h4>
              <p className="text-muted mb-1">Admin: admin@smartbid.com</p>
              <p className="text-muted mb-0">Care: info@smartbid.com</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <div className="glass-card text-center p-4 rounded-lg h-100 glow-card border-0">
              <div className="icon-container mb-3" style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>
                <i className="fa fa-share-alt"></i>
              </div>
              <h4 className="font-weight-bold mb-3" style={{ color: 'var(--text-main)' }}>Socials</h4>
              <div className="d-flex justify-content-center gap-3">
                <a href="https://www.facebook.com" className="text-muted mx-2" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#1877F2'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://www.instagram.com" className="text-muted mx-2" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#E4405F'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.twitter.com" className="text-muted mx-2" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#1DA1F2'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center animate-slide-up delay-200">
          <Col lg={8}>
            <div className="checkout-card-premium p-5 shadow-lg">
              <h2 className='text-center text-white font-weight-bold mb-4'>Send us a Message</h2>

              {message && <Message variant='success'>{message}</Message>}
              {error && <Message variant='danger'>{error}</Message>}
              {loading && <Loader />}

              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId='name' className="mb-4">
                      <Form.Label className="text-slate-muted">Name</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder='Enter Your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-light border-0"
                        style={{ padding: '0.8rem 1rem', borderRadius: '8px' }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId='email' className="mb-4">
                      <Form.Label className="text-slate-muted">Email Address</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Enter Your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-light border-0"
                        style={{ padding: '0.8rem 1rem', borderRadius: '8px' }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId='subject' className="mb-4">
                  <Form.Label className="text-slate-muted">Subject</Form.Label>
                  <Form.Control
                    type='subject'
                    placeholder='Subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-light border-0"
                    style={{ padding: '0.8rem 1rem', borderRadius: '8px' }}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='text' className="mb-4">
                  <Form.Label className="text-slate-muted">Message</Form.Label>
                  <Form.Control
                    as="textarea" rows={5}
                    placeholder='Type Your Message...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="bg-light border-0"
                    style={{ padding: '0.8rem 1rem', borderRadius: '8px' }}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' className='btn-block btn-checkout-animated py-3 mt-2' style={{ letterSpacing: '2px' }}>
                  Send Message <i className="fas fa-paper-plane ml-2"></i>
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContactusScreen
