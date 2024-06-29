import React, { useState, useEffect } from 'react';
import './FinancialReport.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';

const reportTypes = ['Revenue by product', 'Revenue by day', 'Sales by product'];

const FinancialReport = () => {
  const [selectedReport, setSelectedReport] = useState(reportTypes[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product list when component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/product', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    console.log('From Date:', e.target.value);  // Debug log
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    console.log('To Date:', e.target.value);  // Debug log
  };

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleGenerateReport = async () => {
    console.log('Generating report with:', { selectedReport, fromDate, toDate, productId });  // Debug log

    try {
      let url = '';
      let params = {};

      switch (selectedReport) {
        case 'Revenue by product':
          url = 'http://localhost:3000/report/product-sold';
          params = {
            dateFrom: fromDate,
            dateTo: toDate,
          };
          break;
        case 'Revenue by day':
          url = 'http://localhost:3000/report/revenue';
          params = {
            dateFrom: fromDate,
            dateTo: toDate,
          };
          break;
        case 'Sales by product':
          url = 'http://localhost:3000/report/sales';
          params = {
            dateFrom: fromDate,
            dateTo: toDate,
            prodId: productId,
          };
          break;
        default:
          console.error('Invalid report type');
          return;
      }

      const response = await axios.get(url, { 
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } 
      });

      if (response.status === 200) {
        toast.success("Successfully generated report!");
        let transformedData = [];

        if (selectedReport === 'Revenue by product') {
          transformedData = Object.values(response.data).map(item => ({
            product: item.product_name,
            revenue: item.revenue
          }));
        } else if (selectedReport === 'Revenue by day') {
          transformedData = Object.keys(response.data).map(key => ({
            day: key,
            revenue: response.data[key]
          }));
        } else if (selectedReport === 'Sales by product') {
          transformedData = Object.values(response.data).map(date => ({
            date: date,
            sales: response.data[date]
          }));
        }
        
        console.log(transformedData);
        setFilteredData(transformedData);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderBarChart = () => {
    switch (selectedReport) {
      case 'Revenue by product':
        return (
          <BarChart width={1000} height={600} data={filteredData}>
            <XAxis dataKey="product" stroke="#8884d8" />
            <YAxis />
            <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
            <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="revenue" fill="#673317" barSize={30} />
          </BarChart>
        );
      case 'Revenue by day':
        return (
          <BarChart width={1000} height={600} data={filteredData}>
            <XAxis dataKey="day" stroke="#8884d8" />
            <YAxis />
            <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
            <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="revenue" fill="#673317" barSize={30} />
          </BarChart>
        );
      case 'Sales by product':
        return (
          <BarChart width={1000} height={600} data={filteredData}>
            <XAxis dataKey="product" stroke="#8884d8" />
            <YAxis />
            <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
            <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="sales" fill="#673317" barSize={30} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className='title'>Financial Report</h1>
      <div className='selection'>
        <label style={{ marginRight: '20px' }}>
          Report Type:
          <select value={selectedReport} onChange={handleReportChange}>
            {reportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginRight: '20px' }}>
          From Date:
          <input type="date" value={fromDate} onChange={handleFromDateChange} />
        </label>
        <label style={{ marginRight: '20px' }}>
          To Date:
          <input type="date" value={toDate} onChange={handleToDateChange} />
        </label>
        {selectedReport === 'Sales by product' && (
          <label style={{ marginRight: '20px' }}>
            Product:
            <select value={productId} onChange={handleProductIdChange}>
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button onClick={handleGenerateReport} className='button-63'>Generate Report</button>
      </div>
      <div className='chart'>
        {renderBarChart()}
      </div>
    </div>
  );
};

export default FinancialReport;
