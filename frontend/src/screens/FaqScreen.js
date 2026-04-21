import React from 'react';

function FaqScreen() {
  return (
    <div className='Faqs container'>
        <h3 className='text-center mt-4'>FAQ's</h3>
        <h1 className='text-center'>You Should Know</h1>

        <div className='Qna'>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i> How do I create an account?</h6>
          <p>To create an account, simply click on the "Sign Up" button and fill out the registration form. You will need to provide your name, email address, and create a password.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How do I place a bid on an auction item?</h6>
          <p>To place a bid, go to the auction page and enter the amount you want to bid. If someone outbids you, you will receive an email notification so you can decide if you want to increase your bid.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>What happens if I win an auction?</h6>
          <p>If you win an auction, you will receive an Email and instructions on how to complete the payment process. Once payment is received, the item will be shipped to you.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>Can I retract my bid?</h6>
          <p>Generally, bids cannot be retracted unless there is a valid reason, such as an error in the bid amount or a technical issue. Contact customer support if you need to retract a bid.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How do I pay for my auction item?</h6>
          <p>Payment can be made through the website using a variety of payment methods such as credit card, PayPal, or bank transfer. The specific payment options available will be displayed during the checkout process.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How do I know if my bid is the highest?</h6>
          <p>The auction page will show the current highest bid. If your bid is not the highest, your price will be removed from page</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How do I sell items on the website?</h6>
          <p>To sell items on the website, login as "Seller" and follow the instructions to create a listing. You will need to provide a description, photos, and pricing information.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How long will it take to receive my order?</h6>
          <p>Shipping times vary depending on the shipping method and the seller's location. Check the item listing or contact the seller directly for an estimated delivery date.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How do I contact customer support?</h6>
          <p>You can contact customer support through the website's contact form or via email. Response times may vary depending on the volume of inquiries.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>What types of payment methods do you accept?</h6>
          <p>We accept a variety of payment methods including credit card, PayPal, and bank transfer. The specific payment options available will be displayed during the checkout process.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>Is my personal and financial information secure on your website?</h6>
          <p>Yes, we take security seriously and use the latest encryption technologies to protect your personal and financial information.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>How can an ecommerce website handle shipping and delivery?</h6>
          <p>An ecommerce website can handle shipping and delivery by partnering with reliable shipping carriers, providing tracking information to customers, and offering various delivery options such as standard, expedited, or same-day delivery.</p>
          <h6 className='pt-3'><i class="fa fa-check" aria-hidden="true"></i>What is return policy of a purchased item?</h6>
          <p>Return Policy will be depend upon the category of the product.</p>
        </div>
    </div>
    )
}
export default FaqScreen