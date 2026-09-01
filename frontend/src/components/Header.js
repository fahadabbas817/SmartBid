import React from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";
import { setCurrency } from "../actions/currencyActions";
import "../index.css";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const currencyState = useSelector((state) => state.currency) || { code: 'USD' };
  const { code: currencyCode } = currencyState;

  const toggleCurrency = () => {
    dispatch(setCurrency(currencyCode === 'USD' ? 'PKR' : 'USD'));
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar
        bg="primary"
        variant="dark"
        expand="xl"
        collapseOnSelect
        className="py-3 sticky-top navbar-glass border-bottom-0"
      >
        <Container fluid className="px-xl-4 px-3 d-flex align-items-center">
          {/* LEFT: LOGO */}
          <LinkContainer
            to="/"
            className="me-auto"
            style={{ cursor: "pointer" }}
          >
            <Navbar.Brand className="d-flex align-items-center">
              <img
                src="/images/smartbid_logo.png"
                alt="SmartBid Logo"
                width="35"
                height="35"
                className="mr-2"
                style={{ objectFit: "contain" }}
              />
              <span
                className="font-weight-bold ml-2 text-white"
                style={{ fontSize: "1.6rem", letterSpacing: "0.5px" }}
              >
                SmartBid
              </span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-0 shadow-none"
          />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="flex-grow-1 justify-content-center"
          >
            {/* CENTER: MAIN LINKS */}
            <Nav
              className="align-items-center mx-auto"
              style={{ gap: "2rem", fontWeight: "500", fontSize: "1rem" }}
            >
              <LinkContainer to="/" exact>
                <Nav.Link
                  className="text-muted hover-white position-relative"
                  style={{ transition: "color 0.2s", paddingBottom: "0.5rem" }}
                >
                  Home
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/auctions">
                <Nav.Link
                  className="text-muted hover-white position-relative"
                  style={{ transition: "color 0.2s", paddingBottom: "0.5rem" }}
                >
                  Auctions
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shop">
                <Nav.Link
                  className="text-muted hover-white position-relative"
                  style={{ transition: "color 0.2s", paddingBottom: "0.5rem" }}
                >
                  Shop
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/About">
                <Nav.Link
                  className="text-muted hover-white"
                  style={{ transition: "color 0.2s", paddingBottom: "0.5rem" }}
                >
                  About
                </Nav.Link>
              </LinkContainer>
            </Nav>

            {/* RIGHT: CONTROLS & SEARCH */}
            <div
              className="d-flex align-items-center justify-content-end flex-nowrap mt-3 mt-xl-0"
              style={{ gap: "1.5rem" }}
            >
              <div className="d-none d-xl-flex align-items-center position-relative mr-3" style={{ minWidth: "220px" }}>
                <Route render={({ history }) => <SearchBox history={history} />} />
              </div>

              <Nav
                className="align-items-center flex-row"
                style={{ gap: "1.2rem" }}
              >
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={toggleCurrency}
                  className="font-weight-bold"
                  style={{ borderRadius: '20px', padding: '2px 10px', fontSize: '0.85rem' }}
                >
                  {currencyCode}
                </Button>

                <LinkContainer to="/cart">
                  <Nav.Link className="position-relative d-flex align-items-center" style={{ color: "#829ab1" }}>
                    <i className="fas fa-shopping-cart" style={{ fontSize: "1.3rem" }}></i>
                  </Nav.Link>
                </LinkContainer>

                {userInfo ? (
                  <NavDropdown
                    title={
                      <i
                        className="far fa-user-circle"
                        style={{ fontSize: "1.3rem", color: "#829ab1" }}
                      ></i>
                    }
                    id="username"
                    alignRight
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {userInfo.isSeller && (
                      <LinkContainer to="/seller/products">
                        <NavDropdown.Item>My Products</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {(userInfo.isAdmin || userInfo.isSeller) && (
                      <LinkContainer to="/seller/create-listing">
                        <NavDropdown.Item>List Product</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/Querylist">
                        <NavDropdown.Item>Queries</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    {userInfo.isAdmin && (
                      <LinkContainer to="/admin/Auctionlist">
                        <NavDropdown.Item>Auctions</NavDropdown.Item>
                      </LinkContainer>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={logoutHandler}
                      className="text-danger"
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex align-items-center ml-2">
                      <Button
                        variant="outline-primary"
                        className="rounded-pill px-3 py-1 font-weight-bold"
                        style={{
                          borderWidth: "2px",
                          backgroundColor: "transparent",
                          color: "var(--primary-color)",
                        }}
                      >
                        Sign In
                      </Button>
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
