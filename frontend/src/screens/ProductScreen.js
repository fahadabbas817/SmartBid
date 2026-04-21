import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";
import Meta from "../components/Meta";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import BidBox from "../components/BidBox";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  const [localAuctionClosed, setLocalAuctionClosed] = useState(false);

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    } else {
      setLocalAuctionClosed(product.isAuctionClosed);
    }
  }, [dispatch, match, successProductReview, product]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      }),
    );
  };

  const renderDescription = (desc) => {
    if (!desc)
      return (
        <p>
          No detailed description available for this item. Contact our
          specialist team for further inquiries.
        </p>
      );

    // Split description by bullets '•', '*', '-' or newlines to format nicely
    const parts = desc.split(/ • | \* | - |\n/g).filter((p) => p.trim() !== "");

    if (parts.length <= 1) {
      return <p>{desc}</p>;
    }

    return (
      <>
        <p className="mb-3">{parts[0]}</p>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
          {parts.slice(1).map((part, index) => (
            <li key={index} className="mb-2">
              {part.trim()}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        width: "100%",
        backgroundColor: "#040b16",
        position: "relative",
      }}
    >
      {loading ? (
        <div className="container mt-5" style={{ maxWidth: "1200px" }}>
          <SkeletonLoader type="product-details" />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={`SmartBid | ${product.name}`} />
          <div className="container pb-5" style={{ maxWidth: "1200px" }}>
            {/* Main Hero Section: Fits roughly within 100vh */}
            <Row
              className="m-0 align-items-center w-100"
              style={{ minHeight: "calc(100vh - 120px)" }}
            >
              {/* Left: Product Hero Image Container */}
              <Col
                lg={6}
                className="animate-fade-in d-flex justify-content-center align-items-center py-4"
              >
                <div
                  className="w-100 d-flex align-items-center justify-content-center p-4 position-relative"
                  style={{
                    backgroundColor: "#121b2b",
                    borderRadius: "30px",
                    boxShadow:
                      "inset 0 0 50px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    style={{
                      maxHeight: "85%",
                      maxWidth: "90%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))",
                    }}
                  />
                </div>
              </Col>
              {/* Right: Info and Trading/Checkout Container */}
              <Col
                lg={6}
                className="d-flex flex-column pl-lg-5 animate-slide-up delay-100 justify-content-center py-4"
              >
                {/* Product Metadata Header */}
                <div className="mb-2">
                  <h1
                    className="text-white font-weight-bold mb-1 text-uppercase"
                    style={{
                      fontSize: "1.8rem",
                      lineHeight: "1.2",
                      wordBreak: "break-word",
                      letterSpacing: "0.5px",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    {product.name}
                  </h1>
                </div>

                {product.auctionMode ? (
                  <BidBox
                    product={product}
                    user={userInfo}
                    onAuctionClosed={() => setLocalAuctionClosed(true)}
                  />
                ) : (
                  // Direct Buy View (Adjusted to fit without scroll)
                  <div className="direct-buy-interface">
                    <p
                      className="text-uppercase mb-2 font-weight-bold"
                      style={{
                        color: "#64748b",
                        letterSpacing: "4px",
                        fontSize: "0.85rem",
                      }}
                    >
                      LISTING PRICE
                    </p>
                    <h2
                      className="text-white font-weight-bold m-0 mb-4"
                      style={{ fontSize: "4rem" }}
                    >
                      ${product.price}
                    </h2>

                    <Row className="align-items-center mb-4">
                      <Col
                        xs="auto"
                        className="text-uppercase font-weight-bold"
                        style={{ color: "#829ab1" }}
                      >
                        Status:
                      </Col>
                      <Col xs="auto">
                        {product.countInStock > 0 ? (
                          <span
                            className="font-weight-bold"
                            style={{
                              color: "#39ff14",
                              textShadow: "0 0 10px rgba(57, 255, 20, 0.3)",
                            }}
                          >
                            In Stock
                          </span>
                        ) : (
                          <span className="text-danger font-weight-bold">
                            Sold Out
                          </span>
                        )}
                      </Col>
                    </Row>

                    {product.countInStock > 0 && (
                      <Row className="align-items-center mb-4">
                        <Col
                          xs="auto"
                          className="text-uppercase font-weight-bold"
                          style={{ color: "#829ab1" }}
                        >
                          Qty:
                        </Col>
                        <Col xs="auto">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="rounded bg-dark text-white border border-secondary shadow-none"
                            style={{ width: "80px", cursor: "pointer" }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ),
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    )}

                    <Button
                      onClick={addToCartHandler}
                      className="btn-checkout-animated py-3 rounded shadow font-weight-bold mt-2"
                      type="button"
                      disabled={product.countInStock === 0}
                      style={{
                        fontSize: "1.2rem",
                        letterSpacing: "1px",
                        width: "250px",
                      }}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i> Acquire
                      Asset
                    </Button>
                  </div>
                )}
              </Col>
            </Row>

            {/* Full Width Details Box Below Image */}
            <Row className="m-0 mt-4 animate-slide-up delay-200">
              <Col xs={12}>
                <div className="glass-details-box p-5 w-100">
                  <h5
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginBottom: "25px",
                      letterSpacing: "1px",
                    }}
                    className="text-uppercase"
                  >
                    Product Information
                  </h5>
                  <div
                    style={{
                      color: "#cbd5e1",
                      fontSize: "1.05rem",
                      lineHeight: "1.8",
                    }}
                  >
                    <Row className="mb-4">
                      <Col md={6}>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>
                            Model No:
                          </strong>{" "}
                          {product._id?.substring(0, 8).toUpperCase() ||
                            "AC-LE-001"}
                        </div>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>Brand:</strong>{" "}
                          {product.brand || "Premium Selection"}
                        </div>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>
                            Category:
                          </strong>{" "}
                          {product.category || "High-End Goods"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>
                            Condition:
                          </strong>{" "}
                          Pristine
                        </div>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>
                            Authenticity:
                          </strong>{" "}
                          Verified & Certified
                        </div>
                        <div className="mb-2">
                          <strong style={{ color: "#829ab1" }}>
                            Shipping:
                          </strong>{" "}
                          Insured Global Delivery
                        </div>
                      </Col>
                    </Row>
                    <div
                      className="border-top pt-4 mt-3"
                      style={{
                        borderColor: "rgba(255,255,255,0.05) !important",
                      }}
                    >
                      <div className="mb-3">
                        <h5
                          style={{
                            color: "#f8fafc",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                          }}
                        >
                          About the Asset
                        </h5>
                      </div>
                      <div
                        className="product-description-formatted"
                        style={{
                          fontSize: "1rem",
                          color: "#94a3b8",
                          lineHeight: "1.9",
                        }}
                      >
                        {renderDescription(product.description)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Global Auction Lockout Overlay */}
          {localAuctionClosed && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(4, 11, 22, 0.85)",
                backdropFilter: "blur(12px)",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", color: "#fff" }}>
                <i
                  className="fas fa-lock text-danger mb-4"
                  style={{ fontSize: "5rem" }}
                ></i>
                <h1
                  className="font-weight-bold tracking-widest text-uppercase"
                  style={{ letterSpacing: "4px" }}
                >
                  AUCTION CONCLUDED
                </h1>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1.2rem",
                    maxWidth: "500px",
                    margin: "0 auto",
                  }}
                >
                  This lot is officially closed and the trading floor has been
                  sealed. The winning bidder and the seller will be notified to
                  proceed with final fulfillment.
                </p>
                <Button
                  variant="outline-light"
                  className="mt-5 rounded-pill px-5 py-2 font-weight-bold"
                  onClick={() => history.push("/")}
                >
                  Return to Active Floor
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductScreen;
