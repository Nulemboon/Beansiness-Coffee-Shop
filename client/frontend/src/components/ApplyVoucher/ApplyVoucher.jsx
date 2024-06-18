// src/components/ApplyVoucher/ApplyVoucher.jsx

import React, { useState } from 'react';
import './ApplyVoucher.css';

const ApplyVoucher = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');

  const handleApplyVoucher = () => {
    // Example logic to check the voucher code (this could be replaced with actual validation logic)
    if (voucherCode === 'DISCOUNT10') {
      setMessage('Voucher applied successfully! You get a 10% discount.');
    } else {
      setMessage('Invalid voucher code. Please try again.');
    }
  };

  return (
    <div className="apply-voucher-container">
      <h2>Apply Voucher</h2>
      <div className="apply-voucher-form">
        <input
          type="text"
          placeholder="Enter voucher code"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
        />
        <button onClick={handleApplyVoucher}>Apply</button>
      </div>
      {message && <p className="voucher-message">{message}</p>}
    </div>
  );
};

export default ApplyVoucher;
