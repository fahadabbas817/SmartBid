import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Alert,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { io } from "socket.io-client";
import axios from "axios";
import ConfirmAlert from "./ConfirmAlert";
import Price from "./Price";
import { useSelector } from "react-redux";

const BidBox = ({ product, user }) => {
  const currencyState = useSelector((state) => state.currency) || { code: 'USD', rate: 1 };
  const { code, rate } = currencyState;

  // Dynamically pull values based on standard legacy structure
  const [currentBid, setCurrentBid] = useState(
    product.currentBid || product.startingPrice || 0,
  );
  const [localEndTime, setLocalEndTime] = useState(product.auctionEndTime);
  const [bidAmount, setBidAmount] = useState(
    (product.currentBid || product.startingPrice || 0) +
      (product.minimumIncrement || 1),
  );
  const [socket, setSocket] = useState(null);

  const [errorMesg, setErrorMesg] = useState("");
  const [isClosed, setIsClosed] = useState(product.isAuctionClosed);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // Real-Time Countdown Engine
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    // 1. Digital Clock Interval Logic
    let timerInterval;
    if (localEndTime && !isClosed) {
      timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(localEndTime).getTime() - now;

        if (distance <= 0) {
          clearInterval(timerInterval);
          setCountdown("00d 00h 00m 00s");
          setIsClosed(true);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
    } else {
      setCountdown("AUCTION CLOSED");
    }

    // 2. Initialize WebSocket Feed
    const newSocket = io();
    setSocket(newSocket);

    // Join specific auction room
    newSocket.emit("joinAuction", product._id);

    // Listen passively for secure API Broadcasts
    newSocket.on("bidUpdated", (data) => {
      setCurrentBid(data.newBid);
      setBidAmount(data.newBid + (product.minimumIncrement || 1));
      setErrorMesg("");
      if (data.timeExtended && data.auctionEndTime) {
        setLocalEndTime(data.auctionEndTime);
      }
    });

    // Capture the Background CRON Sweep lock globally
    newSocket.on("auctionEnded", () => {
      setIsClosed(true);
      setCountdown("AUCTION CLOSED");
    });

    return () => {
      if (timerInterval) clearInterval(timerInterval);
      newSocket.close();
    };
  }, [product._id, localEndTime, isClosed]);

  const submitBid = async (e) => {
    e.preventDefault();
    setErrorMesg("");

    if (bidAmount < currentBid + (product.minimumIncrement || 1)) {
      setErrorMesg(
        `Bid must be at least the minimum required amount.`,
      );
      return;
    }

    if (user) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Optimistic Front-End Override: Calculate UI logic perfectly so user never waits for WebSocket trip
        const tempAmount = Number(bidAmount);
        setCurrentBid(tempAmount);
        setBidAmount(tempAmount + (product.minimumIncrement || 1));

        await axios.post(
          "/api/live/bid",
          { productId: product._id, amount: tempAmount },
          config,
        );
        // The REST call naturally propagates socket.io arrays externally globally.
      } catch (error) {
        // Robust Form Trapping! Map any 400 Bad Requests dynamically.
        setErrorMesg(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        );
      }
    } else {
      setErrorMesg(
        "Please log in to place a valid bid. Rejection: Unauthorized.",
      );
    }
  };

  const handleEndAuctionEarly = () => {
    setShowConfirmAlert(true);
  };

  const executeForceEndAuction = async () => {
    setShowConfirmAlert(false);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`/api/products/${product._id}/end-auction`, {}, config);
      // The backend broadcast 'auctionEnded' socket event will trigger state change automatically.
    } catch (error) {
      setErrorMesg(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
  };

  return (
    <div className="w-100 d-flex flex-column h-100" style={{ maxHeight: "100%", overflow: 'hidden' }}>
    {/* Status Row */}
    <div
      className="d-flex align-items-center mb-2"
      style={{ color: "#829ab1", fontSize: "0.95rem", letterSpacing: "1px" }}
    >
      <span
        className="text-uppercase flex-shrink-0"
        style={{ marginRight: "20px" }}
      >
        {isClosed ? "AUCTION CLOSED" : "AUCTION LIVE"}
      </span>
      <span className="text-uppercase text-white text-truncate">
        ENDS IN: <strong style={{ letterSpacing: "2px" }}>{countdown}</strong>
      </span>
    </div>
    {/* Current Bid */}
    <div className="mb-2">
      <div
        className="mb-0 text-uppercase"
        style={{ color: "#39ff14", fontSize: "0.9rem", fontWeight: "bold" }}
      >
        CURRENT BID:
      </div>
      <div
        className="neon-pulse-text"
        style={{
          color: "#39ff14",
          fontSize: "2.8rem",
          fontWeight: "bold",
          lineHeight: "1",
          whiteSpace: "nowrap",
        }}
      >
        <Price amount={currentBid} />
      </div>
    </div>

    {/* Pill */}
    {product.reservePrice <= currentBid && (
      <div className="mb-3">
        <Badge
          pill
          style={{
            backgroundColor: "#121b2b",
            color: "#829ab1",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "6px 14px",
            fontSize: "0.9rem",
            fontWeight: "normal",
          }}
        >
          Reserve Met
        </Badge>
      </div>
    )}

    {/* Guest Warning */}
    {errorMesg && !showModal && (
      <div className="mb-3 animate-fade-in">
        <Alert variant="danger" className="text-center py-2 mb-0" style={{ border: '1px solid rgba(220,53,69,0.5)', backgroundColor: 'rgba(220,53,69,0.1)', color: '#ffb3b3' }}>
          {errorMesg}
        </Alert>
      </div>
    )}

    {/* Action Button */}
    <div className="mb-3">
      <Button
        className="btn-block neon-pulse-btn py-2 rounded-pill shadow font-weight-bold"
        style={{
          backgroundColor: "#39ff14",
          color: "#000",
          fontSize: "1.4rem",
          border: "none",
          transition: "all 0.3s ease",
        }}
        onClick={() => {
          if (!user) {
            setErrorMesg("Please sign in or register to participate in live auctions.");
          } else {
            setShowModal(true);
          }
        }}
        disabled={isClosed}
      >
        PLACE BID NOW
      </Button>
    </div>

    {/* Modal for Bidding */}
    <Modal contentClassName="rounded-modal border-0 overflow-hidden" show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#071018",
          borderBottom: "1px solid #1a2838",
        }}
        className="modal-header-custom border-0 text-white"
      >
        <Modal.Title className="text-white">Place Your Bid</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#0b1521" }} className="text-white">
        {errorMesg && <Alert variant="danger">{errorMesg}</Alert>}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            submitBid(e);
            if (!errorMesg) setShowModal(false);
          }}
        >
          <Form.Group controlId="bidAmount" className="mb-4">
            <Form.Label>Bid Amount ({code})</Form.Label>
            <Form.Control
              type="number"
              step="any"
              value={code === 'PKR' ? (bidAmount * rate).toFixed(0) : (bidAmount * rate).toFixed(2)}
              onChange={(e) => setBidAmount(Number(e.target.value) / rate)}
              min={(currentBid + (product.minimumIncrement || 1)) * rate}
              className="form-control font-weight-bold tracking-wider"
              style={{ backgroundColor: '#0b1521', color: '#fff', border: '1px solid rgba(57, 255, 20, 0.4)' }}
            />
            <Form.Text className="text-muted mt-2">
              Minimum bid: <Price amount={currentBid + (product.minimumIncrement || 1)} />
            </Form.Text>
          </Form.Group>
          <Button
            type="submit"
            className="btn-block btn-checkout-animated py-3 text-uppercase font-weight-bold"
            style={{
              backgroundColor: "#39ff14",
              color: "#000",
              border: "none",
            }}
          >
            Confirm Bid
          </Button>
        </Form>
      </Modal.Body>
    </Modal>

    {/* Administrative & Seller Override Controls */}
    {user &&
      !isClosed &&
      (user.isAdmin || user.isSeller || user._id === product.user) && (
        <div
          className="mt-4 pt-3 position-absolute"
          style={{ bottom: "-60px", right: "0", width: "200px" }}
        >
          <Button
            variant="outline-danger"
            size="sm"
            className="w-100 font-weight-bold shadow-sm"
            onClick={handleEndAuctionEarly}
            style={{ letterSpacing: "1px" }}
          >
            <i className="fas fa-exclamation-triangle mr-1"></i> FORCE END
            AUCTION
          </Button>
        </div>
      )}
      
      <ConfirmAlert 
        show={showConfirmAlert}
        title="Override Security Clearance"
        message="Are you absolutely sure you want to forcefully end this live auction? This action is heavily audited and cannot be reversed by anyone."
        onConfirm={executeForceEndAuction}
        onCancel={() => setShowConfirmAlert(false)}
        confirmText="FORCE CLOSE AUCTION"
      />
    </div>
  );
};

export default BidBox;
