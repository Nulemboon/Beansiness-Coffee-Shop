import React, { useEffect, useState, useContext } from 'react';
import './VoucherSite.css';

import { StoreContext } from '../../Context/StoreContext'; 

const VoucherSite = () => {
  const { url } = useContext(StoreContext);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(`${url}/voucher`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVouchers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [url]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
