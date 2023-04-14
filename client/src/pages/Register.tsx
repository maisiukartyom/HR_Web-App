import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { trpc } from '../utils/trpc';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutationReg = trpc.addUser.useMutation();
  const navigate = useNavigate();
  
  const handleRegistration = async () => {
    // Handle registration logic here
    await mutationReg.mutateAsync({
        username: username,
        password: password
    });
    if (!mutationReg.isError){
        navigate("/login")
    }
    else{

    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center">Registration</h1>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleRegistration}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
