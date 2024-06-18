import React from 'react';
import vouchers from '../../../../backend/Fake_Data(to_be_deleted)/voucher.js';//tmp
import './VoucherSite.css';

const VoucherSite = () => {
  return (
    <div className="voucher-site-container">
      <h2>Available Vouchers</h2>
      <div className="vouchers-list">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="voucher-card">
            <img src={voucher.imageUrl} alt={voucher.description} className="voucher-image" />
            <div className="voucher-details">
              <h3>{voucher.description}</h3>
              <p>Discount: {voucher.discountAmount}</p>
              <p>Expiry Date: {new Date(voucher.expiryDate).toLocaleDateString()}</p>
              <p>Code: <strong>{voucher.code}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherSite;
