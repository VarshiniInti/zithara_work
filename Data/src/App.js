// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TablePagination } from '@mui/material';
import moment from 'moment';


const bodyStyles = {
  body: {
    fontFamily: 'Poppins, sans-serif',
    padding: '40px'
  }
}

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateSortCriteria, setDateSortCriteria] = useState('');
  const [timeSortCriteria, setTimeSortCriteria] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        console.log(response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    };

    fetchData();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.Location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateSortChange = (event) => {
    setDateSortCriteria(event.target.value);
  };

  const handleTimeSortChange = (event) => {
    setTimeSortCriteria(event.target.value);
  };

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    if (dateSortCriteria === 'asc' || dateSortCriteria === 'desc') {
      const dateSortOrder = dateSortCriteria === 'asc' ? 1 : -1;
      return dateSortOrder * (new Date(a.Date) - new Date(b.Date));
    }
    if (timeSortCriteria === 'asc' || timeSortCriteria === 'desc') {
      const timeSortOrder = timeSortCriteria === 'asc' ? 1 : -1;
      return timeSortOrder * moment(a.Time, "HH:mm:ssZ").diff(moment(b.Time, "HH:mm:ssZ"));
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentCustomers = sortedCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="App" style={bodyStyles.body}>
      <div className="heading">CUSTOMERS LIST</div>
      <div className="search-and-sort">
        <div className="search-section">
          <div className="search-label">Search :</div>
          <TextField
            id="standard-basic"
            label="Enter Name or Location"
            variant="standard"
            onChange={handleSearchChange}
          />
        </div>
       
        <Box sx={{ width: '170px' }} className="sort-dropdown">
          <FormControl fullWidth>
            <InputLabel className="sort-label">Date Sort</InputLabel>
            <Select
              labelId="date-sort-select-label"
              id="date-sort-select"
              value={dateSortCriteria}
              label="Date Sort"
              onChange={handleDateSortChange}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '170px' }} className="sort-dropdown">
          <FormControl fullWidth>
            <InputLabel className="sort-label">Time Sort</InputLabel>
            <Select
              labelId="time-sort-select-label"
              id="time-sort-select"
              value={timeSortCriteria}
              label="Time Sort"
              onChange={handleTimeSortChange}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <TableContainer className="table-container">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>SNo</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Age</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Phone</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Location</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 600, padding: '12px', backgroundColor: '#4CAF50', color: 'white' }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow key={customer.Sno}>
                <TableCell>{customer.Sno}</TableCell>
                <TableCell>{customer.Name}</TableCell>
                <TableCell>{customer.Age}</TableCell>
                <TableCell>{customer.Phone}</TableCell>
                <TableCell>{customer.Location}</TableCell>
                <TableCell>{moment(customer.Date).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{moment(customer.Time, "HH:mm:ssZ").format('HH:mm:ss')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default App;
