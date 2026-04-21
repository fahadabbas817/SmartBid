import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button, Badge } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";
import "../index.css";

const LiveScreen = ({ history }) => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // 100% Secure Architecture Hook -> Fetches Real Central Database
    dispatch(listProducts(""));
  }, [dispatch]);

  // Filter precisely ONLY products defined securely as Auctions
  const auctionProducts = products
    ? products.filter((p) => p.auctionMode === true)
    : [];

  return (
    <div className="auction py-4">
      <Row className="mb-4">
        <Col lg={12} className="mb-4 mb-lg-0 animate-fade-in">
          <div className="card glow-card border-0 rounded-lg overflow-hidden bg-white shadow-sm">
            <div
              className="p-3 border-bottom d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <h4
                className="mb-0 font-weight-bold"
                style={{
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.2rem",
                }}
              >
                <span className="live-pulse-dot"></span>
                Official ProShop Auctions Sub-Network
              </h4>
            </div>

            <div style={{ backgroundColor: "#000", position: "relative" }}>
              <img
                src="/images/live_placeholder.png"
                alt="Stream Offline Placeholder"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  maxHeight: "250px",
                  objectFit: "cover",
                  display: "block",
                  opacity: "0.85",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "#cbd5e1",
                }}
              >
                <i
                  className="fas fa-video-slash mb-2"
                  style={{ fontSize: "3rem", color: "#64748b" }}
                ></i>
                <h5
                  className="font-weight-bold"
                  style={{ letterSpacing: "2px" }}
                >
                  STREAM OFFLINE
                </h5>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="animate-slide-up delay-200">
        <Col xs={12}>
          <div className="card glow-card border-0 rounded-lg bg-white overflow-hidden mt-2 shadow-sm border">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h4 className="mb-0 font-weight-bold text-dark">
                Verified Auction Listings
              </h4>
              <Badge
                variant="success"
                className="p-2 px-3 shadow-sm"
                style={{ letterSpacing: "1px" }}
              >
                Global Server Secured
              </Badge>
            </div>
            <div className="p-0 table-responsive">
              <Table
                hover
                className="table-borderless mb-0"
                style={{ minWidth: "800px" }}
              >
                <thead className="bg-light border-bottom">
                  <tr>
                    <th className="px-4 py-3 text-muted">Auction Asset</th>
                    <th className="px-4 py-3 text-muted">Starting Reserve</th>
                    <th className="px-4 py-3 text-muted">Current High Bid</th>
                    <th className="px-4 py-3 text-muted">Timer Status</th>
                    <th className="px-4 py-3 text-muted text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Loader />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="p-4">
                        <Message variant="danger">{error}</Message>
                      </td>
                    </tr>
                  ) : auctionProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i
                          className="fas fa-box-open mb-3 text-secondary"
                          style={{ fontSize: "3rem", display: "block" }}
                        ></i>
                        <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                          No active auctions found in network right now.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    auctionProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-bottom align-middle"
                      >
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-light rounded shadow-sm me-3 border"
                              style={{
                                width: "55px",
                                height: "55px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div style={{ marginLeft: "15px" }}>
                              <div
                                className="font-weight-bold text-dark"
                                style={{ fontSize: "1.05rem" }}
                              >
                                {product.name}
                              </div>
                              <small
                                className="text-muted text-uppercase"
                                style={{ letterSpacing: "1px" }}
                              >
                                {product.brand}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-4 py-3 font-weight-bold"
                          style={{ fontSize: "1.1rem" }}
                        >
                          ${product.startingPrice || 0}
                        </td>
                        <td
                          className="px-4 py-3 font-weight-bold text-success"
                          style={{ fontSize: "1.1rem" }}
                        >
                          ${product.currentBid || 0}
                        </td>
                        <td className="px-4 py-3">
                          {product.isAuctionClosed ? (
                            <span className="badge px-3 py-2 rounded-pill bg-danger shadow-sm">
                              GAVEL LOCKED
                            </span>
                          ) : (
                            <span
                              className="badge px-3 py-2 rounded-pill bg-success shadow-sm"
                              style={{ letterSpacing: "1px" }}
                            >
                              <span
                                className="live-pulse-dot"
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  marginRight: "5px",
                                  display: "inline-block",
                                }}
                              ></span>{" "}
                              BROADCASTING
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link to={`/product/${product._id}`}>
                            <Button
                              variant={
                                product.isAuctionClosed
                                  ? "outline-secondary"
                                  : "outline-primary"
                              }
                              size="sm"
                              className="font-weight-bold rounded-pill px-4"
                            >
                              Enter Block{" "}
                              <i className="fas fa-arrow-right ml-1"></i>
                            </Button>
                          </Link>
                          {userInfo &&
                            (userInfo.isAdmin ||
                              userInfo._id === product.user) && (
                              <Link
                                to={`/admin/product/${product._id}/edit`}
                                className="ml-2"
                              >
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="rounded-circle text-muted shadow-sm"
                                >
                                  <i className="fas fa-hammer"></i>
                                </Button>
                              </Link>
                            )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LiveScreen;
