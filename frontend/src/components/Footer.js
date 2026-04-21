import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "../index.css";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#050b14",
        color: "#829ab1",
        padding: "3rem 0",
        marginTop: "auto",
        borderTop: "1px solid #0f1c2d"
      }}
    >
      <Container>
        <Row>
          <Col className="text-center mb-4 mb-md-0" xs={12} md={4}>
            <h5 className="mb-3 font-weight-bold">Stay Connected</h5>
            <div
              className="d-flex justify-content-center gap-3"
              style={{ gap: "1rem" }}
            >
              <a
                href="https://www.facebook.com"
                style={{ color: "#829ab1", fontSize: "1.2rem", transition: 'color 0.2s' }}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com"
                style={{ color: "#829ab1", fontSize: "1.2rem", transition: 'color 0.2s' }}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://www.twitter.com"
                style={{ color: "#829ab1", fontSize: "1.2rem", transition: 'color 0.2s' }}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </Col>

          <Col className="text-center mb-4 mb-md-0" xs={12} md={4}>
            <h5 className="mb-3 font-weight-bold">Need Help</h5>
            <div className="d-flex flex-column">
              <Link to="/about" style={{ color: "#cbd5e1", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = '#39ff14'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                About Us
              </Link>
              <Link to="/contactus" style={{ color: "#cbd5e1", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = '#39ff14'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                Contact Us
              </Link>
              <Link to="/policy" style={{ color: "#cbd5e1", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = '#39ff14'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                Privacy Policy
              </Link>
              <Link to="/faq" style={{ color: "#cbd5e1", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = '#39ff14'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                FAQ's
              </Link>
            </div>
          </Col>

          <Col className="text-center text-md-left" xs={12} md={4}>
            <h5 className="mb-3 font-weight-bold text-center">Our Mission</h5>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "0.9rem",
                lineHeight: "1.6",
              }}
            >
              We value sustainability and ethical business practices. We believe
              in operating with integrity and transparency. Our mission is to be
              the go-to destination for a seamless auction experience.
            </p>
          </Col>
        </Row>
        <hr style={{ borderColor: "#334155", margin: "2rem 0" }} />
        <Row>
          <Col className="text-center">
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
              &copy; {new Date().getFullYear()} SmartBid | All Rights Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
