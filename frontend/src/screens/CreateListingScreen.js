import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Price from "../components/Price";

const CreateListingScreen = ({ history }) => {
  const [listingMode, setListingMode] = useState("auction");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fixed Price Mode States
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  // Auction Mode States
  const [startingPrice, setStartingPrice] = useState(0);
  const [reservePrice, setReservePrice] = useState(0);
  const [minimumIncrement, setMinimumIncrement] = useState(0);
  const [auctionEndTime, setAuctionEndTime] = useState("");

  // Modal visibility states
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);

  // AI Price Predictor State
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceResult, setPriceResult] = useState(null);
  const [priceError, setPriceError] = useState("");

  // AI Description Generator State
  const [descLoading, setDescLoading] = useState(false);
  const [descResult, setDescResult] = useState(null);
  const [descError, setDescError] = useState("");

  // AI Image Fetcher State
  const [imageLoading, setImageLoading] = useState(false);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageError, setImageError] = useState("");

  // Visual success states
  const [priceApplied, setPriceApplied] = useState(false);
  const [descApplied, setDescApplied] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const currencyState = useSelector((state) => state.currency) || { code: 'USD', rate: 1 };
  const { code, rate } = currencyState;

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    setCreateError("");

    if (!title) {
      setCreateError("Title is required");
      return;
    }

    if (!category) {
      setCreateError("Category is required");
      return;
    }

    if (listingMode === "auction" && (startingPrice === "" || startingPrice === null || startingPrice === undefined || !auctionEndTime)) {
      setCreateError("Starting price and auction end date are required for auctions");
      return;
    }

    if (listingMode === "fixed" && (price === "" || price === null || price === undefined)) {
      setCreateError("Price cannot be empty for standard items");
      return;
    }

    setCreateLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      let formattedAuctionEndTime = null;
      if (listingMode === "auction" && auctionEndTime) {
        const [datePart, timePart] = auctionEndTime.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');
        const localDate = new Date(year, month - 1, day, hour, minute);
        formattedAuctionEndTime = localDate.toISOString();
      }


      const payload =
        listingMode === "auction"
          ? {
              name: title,
              category,
              description,
              image,
              price: startingPrice,
              startingPrice,
              reservePrice,
              minimumIncrement,
              auctionEndTime: formattedAuctionEndTime,
              auctionMode: true,
              fixedPriceMode: false,
              countInStock: 1,
            }
          : {
              name: title,
              category,
              description,
              image,
              price,
              countInStock,
              auctionMode: false,
              fixedPriceMode: true,
            };

      await axios.post("/api/products", payload, config);

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setTitle('');
        setCategory('');
        setDescription('');
        setImage('');
        setPrice(0);
        setCountInStock(0);
        setStartingPrice(0);
        setReservePrice(0);
        setMinimumIncrement(0);
        setAuctionEndTime('');
        setPriceResult(null);
        setPriceError('');
        setPriceApplied(false);
        setDescResult(null);
        setDescError('');
        setDescApplied(false);
      }, 2500);
    } catch (error) {
      setCreateError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
    setCreateLoading(false);
  };

  const uploadFileHandler = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image upload failed! Images only (jpg, png).");
    }
  };

  const handlePredictPrice = async () => {
    if (!title || !category) {
      setPriceError("Please enter a title and category first.");
      return;
    }

    setPriceError("");
    setPriceLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/ai/suggest-price",
        { title, category, description },
        config,
      );
      setPriceResult(data);
    } catch (error) {
      setPriceError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
    setPriceLoading(false);
  };

  const handleGenerateDescription = async () => {
    if (!image && !title) {
      setDescError(
        "Please enter a title or upload an image to generate a description.",
      );
      return;
    }

    setDescError("");
    setDescLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/ai/generate-description",
        { keywords: title, imageKeywords: image },
        config,
      );
      setDescResult(data);
    } catch (error) {
      setDescError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
    setDescLoading(false);
  };

  const handleFetchImages = async () => {
    if (!title) {
      setImageError("Please enter a Product Title first.");
      setShowImageModal(true);
      return;
    }

    setImageError("");
    setFetchedImages([]);
    setImageLoading(true);
    setShowImageModal(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post("/api/ai/fetch-images", { title }, config);
      setFetchedImages(data.images || []);
    } catch (error) {
      setImageError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
    setImageLoading(false);
  };

  const applyPriceSuggestion = () => {
    if (priceResult) {
      setStartingPrice(priceResult.suggestedStartingPrice);
      setReservePrice(priceResult.suggestedReservePrice);
      setMinimumIncrement(priceResult.suggestedMinimumIncrement || 5);
      setPrice(priceResult.estimatedFinalPrice);
      setPriceApplied(true);
      setTimeout(() => {
        setPriceApplied(false);
        setShowPriceModal(false);
      }, 1000);
    }
  };

  const applyDescSuggestion = () => {
    if (descResult) {
      setDescription(descResult.generatedDescription);
      setDescApplied(true);
      setTimeout(() => {
        setDescApplied(false);
        setShowDescModal(false);
      }, 1000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in container my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {/* <div className="text-center mb-4">
            <h2 className='brand-smart-bid font-weight-bold'>Create Smart Listing</h2>
            <p className="text-muted">Fill out your item details beautifully, or let AI write them for you.</p>
          </div> */}

          <Card
            className="glass-details-box p-4 shadow-lg border-0"
            style={{ borderRadius: "15px" }}
          >
            <Form onSubmit={submitHandler}>
              {createError && <Message variant="danger">{createError}</Message>}

              {/* Master Mode Toggle */}
              <div className="d-flex justify-content-center mb-5 mt-2">
                <div
                  className="btn-group"
                  role="group"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "30px",
                    padding: "5px",
                  }}
                >
                  <Button
                    variant="link"
                    className={`rounded-pill px-4 ${listingMode === "fixed" ? "font-weight-bold shadow-sm text-dark" : "text-muted"}`}
                    style={{
                      textDecoration: "none",
                      background:
                        listingMode === "fixed"
                          ? "linear-gradient(45deg, #39ff14, #26c205)"
                          : "transparent",
                      border: "none",
                    }}
                    onClick={() => setListingMode("fixed")}
                  >
                    Fixed Price
                  </Button>
                  <Button
                    variant="link"
                    className={`rounded-pill px-4 ${listingMode === "auction" ? "font-weight-bold shadow-sm text-dark" : "text-muted"}`}
                    style={{
                      textDecoration: "none",
                      background:
                        listingMode === "auction"
                          ? "linear-gradient(45deg, #39ff14, #26c205)"
                          : "transparent",
                      border: "none",
                    }}
                    onClick={() => setListingMode("auction")}
                  >
                    Live Auction
                  </Button>
                </div>
              </div>

              <Form.Group controlId="title" className="mb-3">
                <Form.Label className="font-weight-bold">
                  Product Title
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-pill px-3 py-2 border-0 shadow-sm"
                  style={{ backgroundColor: "#0b1521", color: "#fff" }}
                />
              </Form.Group>

              <Form.Group controlId="category" className="mb-3">
                <Form.Label className="font-weight-bold">Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-pill px-3 py-2 border-0 shadow-sm"
                  style={{ backgroundColor: "#0b1521", color: "#fff", cursor: "pointer", borderRight: "16px solid transparent" }}
                >
                  <option value="">Select an official category...</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Antiquities">Antiquities</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Other">Other...</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="image" className="mb-3">
                <Form.Label className="font-weight-bold">Asset Image Representation</Form.Label>
                <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="rounded-pill px-3 py-2 border-0 shadow-sm flex-grow-1"
                    style={{ backgroundColor: "#0b1521", color: "#fff" }}
                  />
                  <div className="custom-file" style={{ width: 'auto', minWidth: '150px' }}>
                    <input
                      type="file"
                      id="image-file"
                      className="custom-file-input d-none"
                      onChange={uploadFileHandler}
                    />
                    <label 
                      className="btn btn-outline-secondary rounded-pill px-4 py-2 m-0 d-flex align-items-center justify-content-center h-100 font-weight-bold shadow-sm" 
                      htmlFor="image-file"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      {uploading ? <Spinner animation="border" size="sm" /> : <><i className="fas fa-upload mr-2 text-primary"></i> Upload</>}
                    </label>
                  </div>
                  <Button
                    variant="outline-info"
                    className="rounded-pill px-3 py-2 m-0 d-flex align-items-center justify-content-center h-100 font-weight-bold shadow-sm"
                    style={{ whiteSpace: 'nowrap', borderColor: 'rgba(255,255,255,0.1)' }}
                    onClick={handleFetchImages}
                  >
                    <i className="fas fa-search mr-2"></i> Web Images
                  </Button>
                </div>
              </Form.Group>

              <Form.Group controlId="description" className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="font-weight-bold mb-0">
                    Description
                  </Form.Label>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill border-0 shadow-sm font-weight-bold"
                    onClick={() => setShowDescModal(true)}
                    style={{
                      background: "linear-gradient(45deg, #39ff14, #26c205)",
                      borderRadius: "2rem",
                      color: "#000",
                    }}
                  >
                    <i className="fas fa-magic mr-1"></i> AI Writer
                  </Button>
                </div>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter short notes (e.g. used, mint condition) or full description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-0 shadow-sm p-3"
                  style={{
                    borderRadius: "15px",
                    resize: "none",
                    backgroundColor: "#0b1521",
                    color: "#fff",
                  }}
                />
              </Form.Group>

              <Row className="mb-4">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                    <h6 className="font-weight-bold mb-0 text-muted">
                      Pricing Details
                    </h6>
                    {listingMode === "auction" && (
                      <Button
                        variant="warning"
                        size="sm"
                        className="rounded-pill border-0 shadow-sm font-weight-bold text-dark neon-pulse-btn"
                        onClick={() => setShowPriceModal(true)}
                        style={{
                          background:
                            "linear-gradient(45deg, #39ff14, #26c205)",
                        }}
                      >
                        <i className="fas fa-robot mr-1"></i> Analyze Market
                      </Button>
                    )}
                  </div>
                </Col>

                {listingMode === "fixed" ? (
                  <>
                    <Col md={6}>
                      <Form.Group controlId="price">
                        <Form.Label className="small text-muted mb-1">
                          Price ({code})
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={price ? (price * rate).toFixed(code === 'PKR' ? 0 : 2) : ''}
                          onChange={(e) => setPrice(Number(e.target.value) / rate)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{ backgroundColor: "#0b1521", color: "#fff" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="countInStock">
                        <Form.Label className="small text-muted mb-1">
                          Count In Stock
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{ backgroundColor: "#0b1521", color: "#fff" }}
                        />
                      </Form.Group>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6} lg={3}>
                      <Form.Group controlId="startingPrice">
                        <Form.Label className="small text-muted mb-1">
                          Start Price ({code})
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={startingPrice ? (startingPrice * rate).toFixed(code === 'PKR' ? 0 : 2) : ''}
                          onChange={(e) => setStartingPrice(Number(e.target.value) / rate)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{ backgroundColor: "#0b1521", color: "#fff" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} lg={3}>
                      <Form.Group controlId="reservePrice">
                        <Form.Label className="small text-muted mb-1">
                          Reserve ({code})
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={reservePrice ? (reservePrice * rate).toFixed(code === 'PKR' ? 0 : 2) : ''}
                          onChange={(e) => setReservePrice(Number(e.target.value) / rate)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{ backgroundColor: "#0b1521", color: "#fff" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} lg={3}>
                      <Form.Group controlId="minimumIncrement">
                        <Form.Label className="small text-muted mb-1">
                          Min Increment ({code})
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={minimumIncrement ? (minimumIncrement * rate).toFixed(code === 'PKR' ? 0 : 2) : ''}
                          onChange={(e) => setMinimumIncrement(Number(e.target.value) / rate)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{ backgroundColor: "#0b1521", color: "#fff" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} lg={3}>
                      <Form.Group controlId="auctionEndTime">
                        <Form.Label className="small text-muted mb-1">
                          End Time
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={auctionEndTime}
                          onChange={(e) => setAuctionEndTime(e.target.value)}
                          className="rounded-pill px-3 py-2 border-0 shadow-sm"
                          style={{
                            backgroundColor: "#0b1521",
                            color: "#fff",
                            colorScheme: "dark",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <Button
                type="submit"
                variant={publishSuccess ? "success" : "primary"}
                className="w-100 py-3 font-weight-bold shadow-sm"
                style={{ borderRadius: "12px" }}
                disabled={createLoading || publishSuccess}
              >
                {publishSuccess ? (
                  <>
                    <i className="fas fa-check-circle mr-2"></i> Listing
                    Published!
                  </>
                ) : createLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="mr-2" />{" "}
                    Publishing...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* AI Price Modal */}
      <Modal
        show={showPriceModal}
        onHide={() => setShowPriceModal(false)}
        centered
        contentClassName="rounded-modal border-0 overflow-hidden"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#071018",
            borderBottom: "1px solid #1a2838",
          }}
          className="modal-header-custom border-0 pb-0 text-white"
        >
          <Modal.Title className="text-white font-weight-bold">
            <i className="fas fa-robot text-warning mr-2"></i> AI Market
            Analysis
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "#0b1521" }}
          className="text-white p-4"
        >
          <p className="text-muted small">
            Make sure you have entered a Product Title and Category to get
            accurate market value predictions.
          </p>

          <Button
            variant="warning"
            className="w-100 mb-3 font-weight-bold text-dark shadow-sm rounded-pill neon-pulse-btn"
            style={{ background: "linear-gradient(45deg, #39ff14, #26c205)", border: "none" }}
            onClick={handlePredictPrice}
            disabled={priceLoading}
          >
            {priceLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2"></span>{" "}
                Crunching numbers...
              </>
            ) : (
              "Generate AI Estimate"
            )}
          </Button>

          {priceError && (
            <Badge variant="danger" className="mb-2 w-100 p-2">
              {priceError}
            </Badge>
          )}

          {priceResult && (
            <div
              className="p-3 rounded shadow-sm mt-3 animate-slide-up"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="d-flex justify-content-between mb-2 border-bottom pb-2"
                style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
              >
                <strong>Suggested Start:</strong>
                <span className="text-success font-weight-bold">
                  <Price amount={priceResult.suggestedStartingPrice} />
                </span>
              </div>
              <div
                className="d-flex justify-content-between mb-2 border-bottom pb-2"
                style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
              >
                <strong>Estimated Final:</strong>
                <span className="electric-blue-text font-weight-bold">
                  <Price amount={priceResult.estimatedFinalPrice} />
                </span>
              </div>
              <div
                className="d-flex justify-content-between mb-2 border-bottom pb-2"
                style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
              >
                <strong>Suggested Reserve:</strong>
                <span className="text-warning font-weight-bold">
                  <Price amount={priceResult.suggestedReservePrice} />
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <strong>Suggested Min Increment:</strong>
                <span className="text-muted font-weight-bold">
                  <Price amount={priceResult.suggestedMinimumIncrement || 5} />
                </span>
              </div>
              <div className="w-100 text-center mb-3">
                <Badge
                  pill
                  variant="success"
                  className="px-3 py-1"
                  style={{
                    backgroundColor: "rgba(57, 255, 20, 0.2)",
                    color: "#39ff14",
                    border: "1px solid rgba(57, 255, 20, 0.4)",
                  }}
                >
                  High Confidence Applied
                </Badge>
              </div>
              <Button
                variant={priceApplied ? "success" : "primary"}
                className="w-100 font-weight-bold rounded-pill text-dark neon-pulse-btn"
                onClick={applyPriceSuggestion}
                style={
                  !priceApplied
                    ? {
                        background: "linear-gradient(45deg, #39ff14, #26c205)",
                        border: "none",
                      }
                    : {}
                }
              >
                {priceApplied ? (
                  <>
                    <i className="fas fa-check mr-1"></i> Applied!
                  </>
                ) : (
                  "Apply Pricing Formats"
                )}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* AI Description Modal */}
      <Modal
        show={showDescModal}
        onHide={() => setShowDescModal(false)}
        centered
        size="lg"
        contentClassName="rounded-modal border-0 overflow-hidden"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#071018",
            borderBottom: "1px solid #1a2838",
          }}
          className="modal-header-custom border-0 pb-0 text-white"
        >
          <Modal.Title className="text-white font-weight-bold">
            <i className="fas fa-magic text-success mr-2"></i> AI Copywriter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "#0b1521" }}
          className="text-white p-4"
        >
          <p className="text-muted small">
            Type some short bullet points in your form's description box, and
            our AI will instantly turn it into an SEO-optimized professional
            listing.
          </p>

          <Button
            variant="primary"
            className="w-100 mb-3 font-weight-bold shadow-sm rounded-pill text-dark neon-pulse-btn"
            style={{
              background: "linear-gradient(45deg, #39ff14, #26c205)",
              border: "none",
            }}
            onClick={handleGenerateDescription}
            disabled={descLoading}
          >
            {descLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2"></span>{" "}
                Writing description...
              </>
            ) : (
              "Generate Pro Description"
            )}
          </Button>

          {descError && (
            <Badge variant="danger" className="mb-2 w-100 p-2">
              {descError}
            </Badge>
          )}

          {descResult && (
            <div
              className="p-4 rounded shadow-sm mt-3 animate-slide-up"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h5
                className="font-weight-bold text-white mb-3 border-bottom pb-2"
                style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
              >
                {descResult.generatedTitle}
              </h5>
              <div
                className="text-muted mb-4"
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  fontSize: "0.95rem",
                  color: "#cbd5e1",
                }}
              >
                {descResult.generatedDescription}
              </div>
              <p
                className="font-italic mb-4 p-3 rounded"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderLeft: "4px solid #39ff14",
                  color: "#a0aec0",
                }}
              >
                "{descResult.marketingCopy}"
              </p>
              <Button
                variant={descApplied ? "success" : "primary"}
                className="w-100 font-weight-bold rounded-pill text-dark neon-pulse-btn"
                onClick={applyDescSuggestion}
                style={
                  !descApplied
                    ? {
                        background: "linear-gradient(45deg, #39ff14, #26c205)",
                        border: "none",
                      }
                    : {}
                }
              >
                {descApplied ? (
                  <>
                    <i className="fas fa-check mr-1"></i> Applied!
                  </>
                ) : (
                  "Apply Description"
                )}
              </Button>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-muted small p-0"
                  onClick={() => copyToClipboard(descResult.generatedDescription)}
                >
                  <i className="far fa-copy mr-1"></i> Copy to clipboard
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* AI Web Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
        contentClassName="rounded-modal border-0 overflow-hidden"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#071018",
            borderBottom: "1px solid #1a2838",
          }}
          className="modal-header-custom border-0 pb-0 text-white"
        >
          <Modal.Title className="text-white font-weight-bold">
            <i className="fas fa-images text-info mr-2"></i> Select Web Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "#0b1521" }}
          className="text-white p-4"
        >
          {imageLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="info" />
              <p className="mt-3 text-muted">Searching the web for "{title}"...</p>
            </div>
          )}

          {imageError && (
            <Badge variant="danger" className="mb-2 w-100 p-2">
              {imageError}
            </Badge>
          )}

          {!imageLoading && !imageError && fetchedImages.length === 0 && (
            <p className="text-muted text-center py-4">No images found. Try a different title.</p>
          )}

          {!imageLoading && fetchedImages.length > 0 && (
            <Row>
              {fetchedImages.map((imgUrl, idx) => (
                <Col md={3} sm={4} xs={6} key={idx} className="mb-3">
                  <div 
                    className="position-relative img-thumbnail-wrapper"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: image === imgUrl ? '3px solid #39ff14' : '1px solid rgba(255,255,255,0.1)'
                    }}
                    onClick={() => {
                      setImage(imgUrl);
                      setShowImageModal(false);
                    }}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Web Search ${idx}`} 
                      className="img-fluid" 
                      style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {image === imgUrl && (
                      <div className="position-absolute" style={{ top: '5px', right: '5px', backgroundColor: '#39ff14', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-check text-dark" style={{ fontSize: '12px' }}></i>
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default CreateListingScreen;
