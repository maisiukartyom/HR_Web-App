import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './utils/trpc';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Department } from './pages/Department';
import { Departments } from './pages/Departments';


const AppContent = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark">
          <Container>
          <Navbar.Brand><Link to="/" style={{ textDecoration: 'none' }}>HR_App</Link></Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link><Link to="/employees" style={{ textDecoration: 'none' }}>Employees</Link></Nav.Link>
              <Nav.Link><Link to="/departments" style={{ textDecoration: 'none' }}>Departments</Link></Nav.Link>
              <Nav.Link><Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link></Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/department/:id' element={<Department />}/>
          <Route path='/departments' element={<Departments />}/>
        </Routes>
      </BrowserRouter>
    </>
    
  )
}

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:4000/trpc',
          // You can pass any HTTP headers you wish here
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent/>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
