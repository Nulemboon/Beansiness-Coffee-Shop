import React, { useEffect, useState, useContext } from 'react';
import './VoucherSite.css';
import { StoreContext } from '../../Context/StoreContext';

const VoucherSite = () => {
  const { url } = useContext(StoreContext);
  const [allVouchers, setAllVouchers] = useState([]);
  const [userVouchers, setUserVouchers] = useState({});
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserVouchers = async () => {
      try {
        const response = await fetch(`${url}/account/current`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPoints(data.point);
        const voucherMap = data.vouchers.reduce((acc, v) => {
          if (v.voucher_id && v.voucher_id._id) {
            acc[v.voucher_id._id] = v.quantity;
          }
          return acc;
        }, {});
        setUserVouchers(voucherMap);
      } catch (error) {
        throw new Error(error.message);
      }
    };

    const fetchAllVouchers = async () => {
      try {
        const response = await fetch(`${url}/voucher`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllVouchers(data);
      } catch (error) {
        throw new Error(error.message);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUserVouchers(), fetchAllVouchers()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const handleExchange = async (voucherId) => {
    const selectedVoucher = allVouchers.find(v => v._id === voucherId);
    if (!selectedVoucher || points < selectedVoucher.required_points) {
      setError('Not enough points to exchange for this voucher.');
      return;
    }

    try {
      const response = await fetch(`${url}/account/vouchers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ voucherId }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange voucher.');
      }

      setPoints(prevPoints => prevPoints - selectedVoucher.required_points);
      setUserVouchers(prevUserVouchers => ({
        ...prevUserVouchers,
        [voucherId]: (prevUserVouchers[voucherId] || 0) + 1,
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="voucher-site-container">
      <h2 style={{color: '#9e592c'}}>Available Vouchers</h2>
      <div className="points-display">
        <p>Current Points: {points}</p>
      </div>
      <div className="vouchers-list">
        {allVouchers.map((voucher) => (
          <div key={voucher._id} className="voucher-card">
            <div className="voucher-details">
              <h3>{voucher.name}</h3>
              <p>Description: {voucher.description}</p>
              <p>Discount: {voucher.discount.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
              <p>Required Points: {voucher.required_points}</p>
              <p>You have: {userVouchers[voucher._id] || 0} vouchers</p>
              <button
                className="exchange-button"
                onClick={() => handleExchange(voucher._id)}
                disabled={points < voucher.required_points}
              >
                Exchange
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherSite;
