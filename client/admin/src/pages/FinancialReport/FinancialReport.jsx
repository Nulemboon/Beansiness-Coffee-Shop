import React, { useState } from 'react';
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

const reportTypes = ['Revenue by product', 'Revenue by day', 'Sales by product'];

const FinancialReport = () => {
  const [selectedReport, setSelectedReport] = useState(reportTypes[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [productId, setProductId] = useState('');

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleGenerateReport = async () => {
    try {
      let url = '';
      let params = {};

      switch (selectedReport) {
        case 'Revenue by product':
          url = 'http://localhost:3000/api/report/product';
          params = {
            fromDate: fromDate,
            toDate: toDate,
          };
          break;
        case 'Revenue by day':
          url = 'http://localhost:3000/api/report/revenue';
          params = {
            fromDate: fromDate,
            toDate: toDate,
          };
          break;
        case 'Sales by product':
          url = 'http://localhost:3000/api/report/sales';
          params = {
            fromDate: fromDate,
            toDate: toDate,
            prodId: productId,
          };
          break;
        default:
          console.error('Invalid report type');
          return;
      }

      const response = await axios.get(url, { params });

      if (response.data.success) {
        setFilteredData(response.data.data);
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
            Product ID:
            <input type="text" value={productId} onChange={handleProductIdChange} />
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
