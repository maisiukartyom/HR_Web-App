import { Container, Row, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export const AuthRequired: React.FC = () => {
    const navigate = useNavigate();

    return (
      <Container className="mt-5">
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="text-center">
            <h1>Please authorize to view content</h1>
            <p>You need to be logged in to view the content. Click the button below to log in or sign up.</p>
            <Button variant="primary" onClick={() => navigate("/login")} >Login</Button>
          </Col>
        </Row>
      </Container>
    );
  };
