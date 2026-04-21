import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }),
    );
  };

  return (
    <div className="animate-fade-in">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="mt-4">
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
              <p className="text-white mb-0">
                <strong className="text-muted small uppercase mr-2">
                  Address:
                </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item
              className="bg-transparent border-bottom"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <h2 className="emerald-text font-weight-bold h4 mb-3">
                PAYMENT METHOD
              </h2>
              <p className="text-white mb-0">
                <strong className="text-muted small uppercase mr-2">
                  Method:
                </strong>
                <span className="font-weight-bold text-info">
                  {cart.paymentMethod}
                </span>
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="bg-transparent">
              <h2 className="emerald-text font-weight-bold h4 mb-3">
                ORDER ITEMS
              </h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
                            {item.qty} x ${item.price} =
                          </span>{" "}
                          <span className="emerald-text font-weight-bold">
                            ${item.qty * item.price}
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
                <h2 className="text-white font-weight-bold h5 py-2 m-0 uppercase">
                  Final Review
                </h2>
              </ListGroup.Item>
              <ListGroup.Item
                className="bg-transparent border-bottom text-white"
                style={{ borderColor: "rgba(255,255,255,0.02)" }}
              >
                <Row>
                  <Col className="text-muted small font-weight-bold">ITEMS</Col>
                  <Col className="text-right">${cart.itemsPrice}</Col>
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
                  <Col className="text-right">${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item
                className="bg-transparent border-bottom text-white"
                style={{ borderColor: "rgba(255,255,255,0.02)" }}
              >
                <Row>
                  <Col className="text-muted small font-weight-bold">TAX</Col>
                  <Col className="text-right">${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent mb-3 text-white">
                <Row className="align-items-center">
                  <Col className="font-weight-bold h5 emerald-text m-0">
                    TOTAL
                  </Col>
                  <Col className="text-right h5 emerald-text font-weight-bold m-0">
                    ${cart.totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item className="bg-transparent border-0 py-0">
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item className="bg-transparent border-0">
                <Button
                  type="button"
                  className="btn-checkout-animated w-100 rounded-pill py-3 font-weight-bold shadow-lg"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  CONFIRM & PLACE ORDER{" "}
                  <i className="fas fa-check-circle ml-2"></i>
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
