import React from 'react';

const CartInfo = () => (
  <div className="mt-8 space-y-4">
    <details className="border-t pt-4" open>
      <summary className="font-semibold text-gray-700">Return Policy</summary>
      <p className="text-sm text-gray-500 mt-2">
        This is our example return policy which is everything you need to know about our returns.
      </p>
    </details>
    <details className="border-t pt-4" open>
      <summary className="font-semibold text-gray-700">Shipping Options</summary>
      <p className="text-sm text-gray-500 mt-2">
        UPS/USPS Surepost and UPS Ground Shipping.
      </p>
    </details>
  </div>
)

export default CartInfo;