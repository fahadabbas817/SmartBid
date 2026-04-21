import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import HeroCoverflowCarousel from "../components/HeroCoverflowCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import SkeletonLoader from "../components/SkeletonLoader";

const HomeScreen = ({ match, mode = "" }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, mode));
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [dispatch, keyword, pageNumber, mode]);

  // Enforce exclusively pure Auction items on Front Page
  const auctionItems = products
    ? products.filter((p) => p.auctionMode === true)
    : [];
  const activeAuctions = auctionItems.filter((p) => !p.isAuctionClosed);

  // Isolate static fixed-price standard eCommerce items
  const fixedProducts = products
    ? products.filter((p) => p.auctionMode !== true)
    : [];

  return (
    <>
      <Meta title="SmartBid | Precision Auction Floor" />
      
      {!keyword && mode === '' && (
        <>
          <div className="animate-fade-in pb-5">
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <HeroCoverflowCarousel products={activeAuctions} />
            )}
          </div>

          <div
            className="d-flex justify-content-between align-items-center mb-4 pb-2"
            style={{ borderBottom: "1px solid #0f1c2d", marginTop: "1rem" }}
          >
            <h2
              className="font-weight-bold m-0 text-white"
              style={{ letterSpacing: "1px" }}
            >
              Global Premier Auctions
            </h2>
          </div>
        </>
      )}

      {keyword && (
        <Link
          to="/"
          className="btn btn-outline-primary rounded-pill mb-4 px-4 py-2 font-weight-bold shadow-sm"
          style={{
            color: "var(--primary-color)",
            borderWidth: "2px",
            backgroundColor: "transparent",
          }}
        >
          <i className="fas fa-arrow-left mr-2"></i> GO BACK
        </Link>
      )}

      {loading ? (
        <Row>
          {[...Array(8)].map((_, i) => (
            <Col key={i} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <SkeletonLoader type="product" />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {mode !== 'shop' && (
            <>
              <Row>
                {activeAuctions.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              {mode === '' && activeAuctions.length > 0 && (
                 <div className="text-center mt-2 mb-5">
                    <Link to="/auctions" className="btn btn-outline-primary rounded-pill px-5 font-weight-bold" style={{ borderWidth: "2px", color: "var(--primary-color)", backgroundColor: "transparent" }}>
                      Explore All Auctions <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                 </div>
              )}
            </>
          )}

          {mode !== 'auction' && fixedProducts.length > 0 && (
            <>
              <div
                className="d-flex justify-content-between align-items-center mb-4 pb-2 mt-5"
                style={{ borderBottom: "1px solid #0f1c2d" }}
              >
                <h2
                  className="font-weight-bold m-0 text-white"
                  style={{ letterSpacing: "1px" }}
                >
                  Direct Market (Buy It Now)
                </h2>
              </div>
              <Row>
                {fixedProducts.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              {mode === '' && fixedProducts.length > 0 && (
                 <div className="text-center mt-2">
                    <Link to="/shop" className="btn btn-outline-primary rounded-pill px-5 font-weight-bold" style={{ borderWidth: "2px", color: "var(--primary-color)", backgroundColor: "transparent" }}>
                      View Direct Market <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                 </div>
              )}
            </>
          )}

          {(mode !== '' || keyword) && (
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
              mode={mode}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
