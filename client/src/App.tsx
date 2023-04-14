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
import { Employees } from './pages/Employees';
import { Employee } from './pages/Employee';
import { Login } from './pages/Login';
// import { UserProvider } from './context/userContext';


const AppContent = () => {
  return (
    <>
      <BrowserRouter>
          <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand as={Link} to="/">HR_App</Navbar.Brand>
              <Nav className="me-auto">
              <Nav.Link as={Link} to="/employees">Employees</Nav.Link>
                <Nav.Link as={Link} to="/departments">Departments</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/login">Profile</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/department/:id' element={<Department />}/>
            <Route path='/departments' element={<Departments />}/>
            <Route path='/employees' element={<Employees />}/>
            <Route path='/employee/:id' element={<Employee />}/>
            <Route path='/login' element={<Login />}/>
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
