import { useMutation } from "@tanstack/react-query";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { trpc } from "../utils/trpc";
import { useState } from "react";


export const Login: React.FC = () => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const mutationLogin = trpc.login.useMutation();
    const handleLogin = async () => {
        await mutationLogin.mutateAsync({username: newUsername, password: newPassword});
        if (!mutationLogin.isError){
                
        }
        else{

        }
    }

    return (
      <Container>
        <Row className="justify-content-center align-items-center vh-100">
          <Col md={6}>
            <div className="login-form">
              <h1 className="text-center">Login</h1>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" onClick={handleLogin}>
                  Sign In
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };