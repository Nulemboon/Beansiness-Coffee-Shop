
import React, { useState } from 'react';
import './FinancialReport.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const salesData = [
  { day: 'Jan', revenue: 4000 },
  { day: 'Feb', revenue: 3000 },
  { day: 'Mar', revenue: 9800 },
  { day: 'Apr', revenue: 3908 },
  { day: 'May', revenue: 4800 },
  { day: 'Jun', revenue: 3800 },
];

const reportTypes = ['Revenue by product', 'Revenue by day', 'Sales by product'];

const FinancialReport = () => {
  const [selectedReport, setSelectedReport] = useState(reportTypes[0]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredData, setFilteredData] = useState(salesData);

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleGenerateReport = () => {
    // For simplicity, filteredData remains same. You can add your logic to filter data based on fromDate, toDate, and selectedReport.
    setFilteredData(salesData);
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
        <button onClick={handleGenerateReport} className='button-63'>Generate Report</button>
      </div>
      <div         className='chart'>
      <BarChart width={1000} height={600} data={salesData}>
        <XAxis dataKey="day" stroke="#8884d8" />
        <YAxis />
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
        <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="revenue" fill="#673317" barSize={30} />
    </BarChart>
      </div>
    </div>
  );
};

export default FinancialReport;