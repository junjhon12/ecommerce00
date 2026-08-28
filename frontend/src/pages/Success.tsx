import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
    /* 
      feat: handle post-checkout success view
      A dedicated functional component was chosen here to provide immediate user feedback 
      after Stripe redirection, optimizing the UX flow while balancing straightforward 
      rendering with highly readable component lifecycle logic.
    */
    useEffect(() => {
        // Future integration: clear the global cart state or verify the session ID here
        console.log("Payment successful, welcome back.");
    }, []);

    return (
        <main className="success-page">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order is currently being processed.</p>
            <Link to="/">
                <button>Return to Storefront</button>
            </Link>
        </main>
    );
}