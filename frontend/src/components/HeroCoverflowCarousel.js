import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const dummyUpcoming = [
  { _id: 'dummy1', name: 'Rolex Daytona Platinum', image: '/images/sample.jpg', currentBid: 42000, auctionEndTime: Date.now() + 86400000 * 2, isDummy: true },
  { _id: 'dummy2', name: 'Porsche 911 GT3 RS', image: '/images/sample.jpg', currentBid: 310000, auctionEndTime: Date.now() + 86400000 * 5, isDummy: true },
  { _id: 'dummy3', name: 'First Edition Charizard', image: '/images/sample.jpg', currentBid: 8500, auctionEndTime: Date.now() + 86400000 * 7, isDummy: true }
];

const HeroCoverflowCarousel = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
     const interval = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(interval);
  }, []);

  // Pad the products array if it's less than 3
  const activeProducts = products || [];
  const displayItems = [...activeProducts];
  if (displayItems.length < 3) {
      displayItems.push(...dummyUpcoming.slice(0, 3 - displayItems.length));
  }
  // If still less than 3 somehow, duplicate the array to fill the carousel safely
  while(displayItems.length < 3) {
      displayItems.push(displayItems[0]);
  }

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % displayItems.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);

  const formatTime = (endTime) => {
      const distance = new Date(endTime).getTime() - now;
      if (distance <= 0) return '00:00:00';
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="coverflow-container position-relative mx-auto my-4" style={{ height: '480px', width: '100%', maxWidth: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {displayItems.map((item, index) => {
           let position = 'hidden';
           if (index === activeIndex) position = 'active';
           else if (index === (activeIndex - 1 + displayItems.length) % displayItems.length) position = 'prev';
           else if (index === (activeIndex + 1) % displayItems.length) position = 'next';

           if (position === 'hidden') return null;

           const isActive = position === 'active';
           
           const cardStyle = {
               position: 'absolute',
               width: isActive ? '60%' : '50%',
               height: isActive ? '400px' : '320px',
               transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
               transform: isActive ? 'translateX(0) scale(1)' : position === 'prev' ? 'translateX(-65%) scale(0.9)' : 'translateX(65%) scale(0.9)',
               opacity: isActive ? 1 : 0.6,
               zIndex: isActive ? 10 : 5,
               filter: isActive ? 'none' : 'blur(1.5px)',
               borderRadius: '24px',
               overflow: 'hidden',
               border: isActive ? '2px solid var(--primary-color)' : '1px solid #1a2838',
               boxShadow: isActive ? '0 0 50px rgba(57, 255, 20, 0.2)' : 'none',
               backgroundColor: '#0b1521'
           };

           return (
               <div key={`${item._id}-${index}`} style={cardStyle} onClick={() => { if(!isActive) position === 'prev' ? prevSlide() : nextSlide(); }} className={!isActive ? "cursor-pointer" : ""}>
                   <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(5, 11, 20, 0.65)', zIndex: 1 }}></div>
                   <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                   
                   {isActive && (
                       <div className="position-absolute w-100 h-100" style={{ zIndex: 5 }}>
                           {/* Massive Centered Timer */}
                           <div className="d-flex align-items-center justify-content-center w-100 h-100 pb-5">
                               <h1 className="font-weight-bold emerald-text m-0" style={{ fontSize: '6rem', letterSpacing: '6px', textShadow: '0 0 30px rgba(57, 255, 20, 0.6), 0 0 10px rgba(57, 255, 20, 0.9)', fontFamily: "'Courier New', Courier, monospace", lineHeight: 1 }}>
                                   {formatTime(item.auctionEndTime || Date.now() + 86400000)}
                               </h1>
                           </div>
                           
                           {/* Bottom Left Anchored Details */}
                           <div className="position-absolute text-left" style={{ bottom: '25px', left: '30px', maxWidth: '70%' }}>
                               <h3 className="text-white font-weight-bold mb-1" style={{ fontSize: '1.8rem', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{item.name}</h3>
                               <p className="text-white text-uppercase font-weight-bold mb-3" style={{ letterSpacing: '1px', fontSize: '0.9rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                   Current Bid: <span className="emerald-text ml-2" style={{ fontSize: '1rem' }}>${item.currentBid || item.startingPrice || 100}</span>
                               </p>
                               
                               <Link to={item.isDummy ? '#' : `/product/${item._id}`}>
                                  <Button variant="primary" className="btn-checkout-animated px-4 py-2 rounded-pill shadow" style={{ fontSize: '0.9rem' }}>
                                    PLACE BID NOW <i className="fas fa-gavel ml-2"></i>
                                  </Button>
                               </Link>
                           </div>
                       </div>
                   )}
               </div>
           );
       })}

       {/* Controls */}
       <div className="position-absolute d-flex justify-content-between w-100 px-5" style={{ zIndex: 20, pointerEvents: 'none' }}>
           <Button variant="dark" onClick={prevSlide} className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '50px', height: '50px', pointerEvents: 'auto', backgroundColor: '#050b14', borderColor: '#1a2838' }}>
               <i className="fas fa-chevron-left" style={{ color: '#829ab1' }}></i>
           </Button>
           <Button variant="dark" onClick={nextSlide} className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '50px', height: '50px', pointerEvents: 'auto', backgroundColor: '#050b14', borderColor: '#1a2838' }}>
               <i className="fas fa-chevron-right" style={{ color: '#829ab1' }}></i>
           </Button>
       </div>
    </div>
  )
}
export default HeroCoverflowCarousel;
