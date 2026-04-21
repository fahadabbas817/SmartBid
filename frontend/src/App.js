import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactusScreen from "./screens/ContactusScreen";
import FaqScreen from "./screens/FaqScreen";
import PolicyScreen from "./screens/PolicyScreen";
import LiveScreen from "./screens/LiveScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import AuctionListScreen from "./screens/AuctionListScreen";
import AuctionEditScreen from "./screens/AuctionEditScreen";
import QueryListScreen from "./screens/QueryListScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import SessionTimeout from "./components/SessionTimeout"; // Add this line
import CreateListingScreen from "./screens/CreateListingScreen";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Switch>
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/About" component={AboutScreen} />
            <Route path="/Contactus" component={ContactusScreen} />
            <Route path="/Policy" component={PolicyScreen} />
            <Route path="/Faq" component={FaqScreen} />
            <Route path="/Live" component={LiveScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route
              path="/product/:id"
              render={(props) => <ProductScreen {...props} />}
            />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/admin/userlist" component={UserListScreen} />
            <Route path="/admin/user/:id/edit" component={UserEditScreen} />
            <Route
              path="/admin/productlist"
              component={ProductListScreen}
              exact
            />
            <Route
              path="/admin/productlist/:pageNumber"
              component={ProductListScreen}
            />
            <Route
              path="/admin/product/:id/edit"
              component={ProductEditScreen}
            />
            <Route path="/admin/orderlist" component={OrderListScreen} />
            <Route path="/admin/Querylist" component={QueryListScreen} />
            <Route
              path="/seller/create-listing"
              component={CreateListingScreen}
            />
            <Route path="/admin/Auctionlist" component={AuctionListScreen} />
            <Route path="/admin/Auctionedit" component={AuctionEditScreen} />
            <Route path="/search/:keyword" component={HomeScreen} exact />
            <Route path="/page/:pageNumber" component={HomeScreen} exact />
            <Route
              path="/search/:keyword/page/:pageNumber"
              component={HomeScreen}
              exact
            />
            <Route path="/" component={HomeScreen} exact />
            <Route path="/auctions" render={(props) => <HomeScreen {...props} mode="auction" />} exact />
            <Route path="/auctions/page/:pageNumber" render={(props) => <HomeScreen {...props} mode="auction" />} exact />
            <Route path="/shop" render={(props) => <HomeScreen {...props} mode="shop" />} exact />
            <Route path="/shop/page/:pageNumber" render={(props) => <HomeScreen {...props} mode="shop" />} exact />
            <Redirect from="/product" to="/notfound" />
            <Redirect from="/order" to="/notfound" />
            <Route path="/notfound" component={NotFoundScreen} />
            <Route component={NotFoundScreen} />
          </Switch>
        </Container>
      </main>
      <Footer />
      <SessionTimeout /> {/* Add this line */}
    </Router>
  );
};

export default App;
