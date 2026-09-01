import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link, Redirect } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Price from "../components/Price";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  updateOrderShipping,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && order) {
    // Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    );
  }

  const isOrderOwner = order && userInfo && (
    (order.user && order.user._id && order.user._id.toString() === userInfo._id.toString()) ||
    (order.user && typeof order.user === 'string' && order.user === userInfo._id.toString()) ||
    (order.user === userInfo._id)
  );

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }

    if (order && order.shippingAddress.address !== "TBD") {
      setAddress(order.shippingAddress.address);
      setCity(order.shippingAddress.city);
      setPostalCode(order.shippingAddress.postalCode);
      setCountry(order.shippingAddress.country);
    }
  }, [dispatch, orderId, successPay, successDeliver, order, userInfo, history]);

  const updateShippingHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateOrderShipping(orderId, { address, city, postalCode, country }),
    );
  };

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  // if (!order) {
  //   return <Redirect to="/notfound" />;
  // }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div className="animate-fade-in">
      <h1
        className="text-white font-weight-bold mb-4"
        style={{ letterSpacing: "2px", wordBreak: "break-all" }}
      >
        ORDER {order._id}
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup
            variant="flush"
            className="rounded-lg overflow-hidden shadow-lg border-0 mb-4"
            style={{ backgroundColor: "#0b1521" }}
          >
            <ListGroup.Item
              className="bg-transparent border-bottom"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <h2 className="emerald-text font-weight-bold h4 mb-3">
                SHIPPING
              </h2>
              <p className="text-white mb-2">
                <strong className="text-muted small uppercase mr-2">
                  Name:
                </strong>{" "}
                {order.user && order.user.name ? order.user.name : (isOrderOwner ? userInfo.name : "Unknown")}
              </p>
              <p className="text-white mb-2">
                <strong className="text-muted small uppercase mr-2">
                  Email:
                </strong>{" "}
                <a
                  href={`mailto:${order.user && order.user.email ? order.user.email : (isOrderOwner ? userInfo.email : "")}`}
                  className="text-info"
                  style={{ textDecoration: "none" }}
                >
                  {order.user && order.user.email ? order.user.email : (isOrderOwner ? userInfo.email : "Unknown")}
                </a>
              </p>
              <p className="text-white mb-3">
                <strong className="text-muted small uppercase mr-2">
                  Address:
                </strong>
                {order.shippingAddress.address === "TBD" ? (
                  <span className="text-warning font-weight-bold">
                    Address Required for Shipping
                  </span>
                ) : (
                  <>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </>
                )}
              </p>
              {order.isDelivered ? (
                <div className="p-3 rounded text-success small font-weight-bold border border-success d-flex align-items-center" style={{ backgroundColor: "rgba(40, 167, 69, 0.1)" }}>
                  <i
                    className="fas fa-check-circle mr-2"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span>Delivered on {order.deliveredAt.substring(0, 10)}</span>
                </div>
              ) : (
                <div className="p-3 rounded text-danger small font-weight-bold border border-danger d-flex align-items-center" style={{ backgroundColor: "rgba(220, 53, 69, 0.1)" }}>
                  <i
                    className="fas fa-clock mr-2"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span>Package Not Yet Shipped</span>
                </div>
              )}
            </ListGroup.Item>

            <ListGroup.Item
              className="bg-transparent border-bottom"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <h2 className="emerald-text font-weight-bold h4 mb-3">
                PAYMENT METHOD
              </h2>
              <p className="text-white mb-3">
                <strong className="text-muted small uppercase mr-2">
                  Method:
                </strong>
                <span className="font-weight-bold text-info">
                  {order.paymentMethod}
                </span>
              </p>
              {order.isPaid ? (
                <div className="p-3 rounded text-success small font-weight-bold border border-success d-flex align-items-center" style={{ backgroundColor: "rgba(40, 167, 69, 0.1)" }}>
                  <i
                    className="fas fa-check-circle mr-2"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span>
                    Transaction Completed on {order.paidAt.substring(0, 10)}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded text-warning small font-weight-bold border border-warning d-flex align-items-center" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}>
                  <i
                    className="fas fa-exclamation-triangle mr-2"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <span>Awaiting Marketplace Transaction</span>
                </div>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="bg-transparent">
              <h2 className="emerald-text font-weight-bold h4 mb-3">
                ORDER ITEMS
              </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="bg-transparent px-0 border-0 mb-2"
                    >
                      <Row className="align-items-center">
                        <Col md={1} xs={3}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            className="shadow-sm border"
                            style={{ borderColor: "rgba(255,255,255,0.1)" }}
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                            className="text-white font-weight-bold hover-info"
                            style={{ textDecoration: "none" }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className="text-right text-white">
                          <span className="text-muted">
                            {item.qty} x <Price amount={item.price} /> =
                          </span>{" "}
                          <span className="emerald-text font-weight-bold">
                            <Price amount={item.qty * item.price} />
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card
            className="border-0 shadow-lg"
            style={{ backgroundColor: "#0b1521", borderRadius: "15px" }}
          >
            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item
                className="bg-transparent border-bottom"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <h2 className="text-white font-weight-bold h5 py-2 m-0">
                  ORDER SUMMARY
                </h2>
              </ListGroup.Item>
              <ListGroup.Item
                className="bg-transparent border-bottom text-white"
                style={{ borderColor: "rgba(255,255,255,0.02)" }}
              >
                <Row>
                  <Col className="text-muted small font-weight-bold">ITEMS</Col>
                  <Col className="text-right"><Price amount={order.itemsPrice} /></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item
                className="bg-transparent border-bottom text-white"
                style={{ borderColor: "rgba(255,255,255,0.02)" }}
              >
                <Row>
                  <Col className="text-muted small font-weight-bold">
                    SHIPPING
                  </Col>
                  <Col className="text-right"><Price amount={order.shippingPrice} /></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item
                className="bg-transparent border-bottom text-white"
                style={{ borderColor: "rgba(255,255,255,0.02)" }}
              >
                <Row>
                  <Col className="text-muted small font-weight-bold">TAX</Col>
                  <Col className="text-right"><Price amount={order.taxPrice} /></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent mb-2 text-white">
                <Row className="align-items-center">
                  <Col className="font-weight-bold h5 emerald-text m-0">
                    TOTAL
                  </Col>
                  <Col className="text-right h5 emerald-text font-weight-bold m-0">
                    <Price amount={order.totalPrice} />
                  </Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && isOrderOwner && (
                <ListGroup.Item className="bg-transparent border-0 pt-0 text-center">
                  {order.shippingAddress.address === "TBD" ? (
                    <div
                      className="glass-details-box p-4 text-left border border-warning"
                      style={{ backgroundColor: "rgba(255,193,7,0.05)" }}
                    >
                      <h5 className="text-warning font-weight-bold mb-3">
                        Fulfillment Required
                      </h5>
                      <p className="text-muted small mb-4">
                        Please provide a valid shipping address to unlock the
                        checkout and marketplace payment gateways.
                      </p>
                      <Form onSubmit={updateShippingHandler}>
                        <Form.Group controlId="address" className="mb-2">
                          <Form.Label className="small text-muted font-weight-bold">
                            STREET ADDRESS
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter street address"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className="bg-transparent text-white border-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.9rem" }}
                          />
                        </Form.Group>
                        <Form.Group controlId="city" className="mb-2">
                          <Form.Label className="small text-muted font-weight-bold">
                            CITY
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            className="bg-transparent text-white border-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.9rem" }}
                          />
                        </Form.Group>
                        <Form.Group controlId="postalCode" className="mb-2">
                          <Form.Label className="small text-muted font-weight-bold">
                            POSTAL CODE
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter postal code"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="bg-transparent text-white border-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.9rem" }}
                          />
                        </Form.Group>
                        <Form.Group controlId="country" className="mb-4">
                          <Form.Label className="small text-muted font-weight-bold">
                            COUNTRY
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter country"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className="bg-transparent text-white border-secondary rounded-pill px-3 py-1"
                            style={{ fontSize: "0.9rem" }}
                          />
                        </Form.Group>
                        <Button
                          type="submit"
                          variant="warning"
                          className="w-100 rounded-pill font-weight-bold py-2 shadow-sm"
                        >
                          SAVE & PROCEED TO PAYMENT
                        </Button>
                      </Form>
                    </div>
                  ) : (
                    <>
                      {loadingPay && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <div
                          className="rounded p-2"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        >
                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}
                          />
                        </div>
                      )}
                    </>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item className="bg-transparent border-0">
                    <Button
                      type="button"
                      className="btn btn-success w-100 rounded-pill font-weight-bold py-3 shadow-lg"
                      onClick={deliverHandler}
                    >
                      MARK AS DELIVERED
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
