import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';


function PolicyScreen() {
  return (
    <div className='Policy text-center contatiner'>
        <h3 className='mt-4'>Privacy Policy</h3>
        <h1>Term & Condition</h1>
        <p>Thank you for visiting our ecommerce website. Your privacy is important to us, and we are committed to protecting your personal information. This privacy policy explains how we collect, use, and protect your personal data.</p>
        <div className='privacy'>
          <h5 className='pt-3'>Information Collection and Use</h5>
           <p>We may collect personal information from you when you use our website, including your name, email address, phone number, shipping address, billing address, and payment information. We use this information to process your orders, communicate with you about your purchases, and improve our website and marketing efforts. We may also collect non-personal information such as your IP address, web browser details, and device information to help us provide a better user experience and to analyze how visitors use our site.</p>
          <h5 className='pt-3'>Information Sharing</h5>
          <p>We may share your personal information with third-party service providers such as shipping companies, payment processors, and marketing agencies to fulfill orders, process payments, and improve our marketing efforts. We may also share your information in compliance with legal requirements, such as responding to court orders or subpoenas, or to protect our rights and interests.</p>
          <h5 className='pt-3'>Data Security</h5>
          <p>We take the security of your personal information seriously and use reasonable measures to protect your data. We use secure servers and encryption to protect your information, and limit access to your information to authorized personnel only. However, please note that no data transmission over the internet or electronic storage method is completely secure, and we cannot guarantee the absolute security of your data.</p>
          <h5 className='pt-3'>User Rights</h5>
          <p>You have the right to access, correct, or delete your personal information at any time. If you would like to do so, please contact us using the information provided at the end of this policy. We will respond to your request as soon as possible.</p>
          <h5 className='pt-3'>Cookies and Tracking</h5>
          <p>We use cookies and other tracking technologies to collect non-personal information about your use of our website. This information is used to improve our website and marketing efforts, and to provide a better user experience. You can choose to disable cookies in your web browser, although this may affect some functionality of our website.</p>
          <h5 className='pt-3'>Changes to Privacy Policy</h5>
          <p>We may update this privacy policy from time to time. If we make any material changes, we will notify you by email or by posting a notice on our website. Your continued use of our website after any changes to the policy indicates your acceptance of the updated policy.</p>
          <h5 className='pt-3'>Contact Us</h5>
          <p>If you have any questions or concerns about our privacy policy or how we handle your personal information, please contact us at <LinkContainer to='/contactus'><Link>Contact US</Link></LinkContainer>.</p>
        </div> 
    </div>
    
    )
}
export default PolicyScreen