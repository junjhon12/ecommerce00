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
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 font-sans text-center">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order is currently being processed.</p>
                <Link to="/">
                    <button className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto">
                        Return to Storefront
                    </button>
                </Link>
            </div>
        </main>
    );
}