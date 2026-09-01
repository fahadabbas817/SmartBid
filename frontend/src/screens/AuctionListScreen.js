import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts, endAuctionEarly } from '../actions/productActions';
import { updateCheck } from '../actions/checkActions';

const AuctionListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productEndAuction = useSelector((state) => state.productEndAuction);
  const { success: successEndAuction } = productEndAuction;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      // Fetch ONLY products actively set as 'auction'
      dispatch(listProducts('', '', 'auction'));
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo, successEndAuction]);



  const endAuctionHandler = (id) => {
    if (window.confirm('Are you sure you want to end this auction early? Bidding will be closed permanently.')) {
      dispatch(endAuctionEarly(id));
    }
  };

  const generateCSV = (data) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const fileName = `auction_inventory_${currentDate}.csv`;

    const mappedData = data.map(product => ({
      ID: product._id,
      Name: `"${product.name}"`,
      StartingBid: product.startingPrice,
      CurrentBid: product.currentBid,
      HighestBidder: product.highestBidder ? product.highestBidder : 'None',
      Status: product.isAuctionClosed ? 'Closed' : 'Active'
    }));

    let csvContent = 'data:text/csv;charset=utf-8,';
    if (mappedData.length > 0) {
       csvContent += Object.keys(mappedData[0]).join(',') + '\n' +
                     mappedData.map((row) => Object.values(row).join(',')).join('\n');
    } else {
       csvContent += 'ID,Name,StartingBid,CurrentBid,HighestBidder,Status\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <div className='card shadow-sm border-0 rounded-lg bg-transparent overflow-hidden my-4' style={{ backgroundColor: '#0b1521 !important' }}>
      <div className='p-4 border-bottom d-flex align-items-center justify-content-between flex-wrap' style={{ gap: '1rem', borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <h3 className='mb-0 font-weight-bold text-white' style={{ letterSpacing: '1px' }}>AUCTIONS MANAGEMENT</h3>
        <div className="d-flex" style={{ gap: '0.8rem' }}>
          <Button variant='success' className="font-weight-bold shadow-sm d-flex align-items-center border-0 px-3 py-2" onClick={() => generateCSV(products || [])} style={{ borderRadius: '8px' }}>
            <i className='fas fa-file-export me-2'></i> Export CSV
          </Button>
        </div>
      </div>



      <div className="p-4" style={{ backgroundColor: '#0b1521' }}>
        {successEndAuction && <Message variant='success'>Auction forced to end successfully.</Message>}
        {showAlert && <Message variant='success'>System bidding status saved.</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <div className="table-responsive">
            <Table hover variant='dark' className='table-custom-dark align-middle mb-0' style={{ backgroundColor: '#0b1521' }}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <tr>
                  <th className="px-3 py-3 text-muted small">PRODUCT ID</th>
                  <th className="px-3 py-3 text-white small">NAME</th>
                  <th className="px-3 py-3 text-white small">STARTING BID</th>
                  <th className="px-3 py-3 text-white small">HIGHEST BID</th>
                  <th className="px-3 py-3 text-white small text-center">STATUS</th>
                  <th className="px-3 py-3 text-white small text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products && products.map((product) => (
                  <tr key={product._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                    <td className="px-3 py-3 text-muted small" style={{ fontFamily: 'monospace' }}>{product._id}</td>
                    <td className="px-3 py-3 font-weight-bold text-white">{product.name}</td>
                    <td className="px-3 py-3 text-muted font-weight-bold">${product.startingPrice}</td>
                    <td className="px-3 py-3 text-success font-weight-bold" style={{ fontSize: '1.1rem' }}>${product.currentBid}</td>
                    <td className="px-3 py-3 text-center">
                      {!product.isAuctionClosed && (!product.auctionEndTime || new Date(product.auctionEndTime).getTime() > Date.now()) ? (
                         <div className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">Active</div>
                      ) : (
                         <div className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm">Ended</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-end" style={{ whiteSpace: 'nowrap' }}>
                      <div className='d-flex justify-content-end align-items-center' style={{ gap: '0.5rem' }}>
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                          <Button variant='light' className='btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center' title="Edit Product" style={{ width: '35px', height: '35px', padding: 0 }}>
                            <i className='fas fa-edit'></i>
                          </Button>
                        </LinkContainer>
                        {!product.isAuctionClosed && (
                          <Button
                            variant='danger'
                            className='btn-sm font-weight-bold px-3 py-1 text-white text-nowrap'
                            title="End Auction Early"
                            onClick={() => endAuctionHandler(product._id)}
                            style={{ borderRadius: '8px' }}
                          >
                            END NOW
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!products || products.length === 0) && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No active auction products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionListScreen;
