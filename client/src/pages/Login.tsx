import { useMutation } from "@tanstack/react-query";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { trpc } from "../utils/trpc";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";


export const Login: React.FC = () => {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const mutationLogin = trpc.login.useMutation();

    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        await mutationLogin.mutateAsync({username: newUsername, password: newPassword});
        if (!mutationLogin.isError){
            setUser({
                id: mutationLogin.data?.id,
                username: mutationLogin.data?.username
            });
            navigate("/");
        }
        else{

        };
    }

    return (
      <Container className="mt-5">
        <Row className="justify-content-center align-items-center">
          <Col md={6}>
            <div className="login-form">
              <h1 className="text-center">Login</h1>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="test" placeholder="Enter username" 
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
            <div className="text-center mt-3">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </Col>
        </Row>
           
      </Container>
    );
  };