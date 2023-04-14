import { Link } from "react-router-dom";
import { TopDepartments } from "../components/TopDepartments";
import { LastEmployees } from "../components/LastEmployees";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const HomePage: React.FC = () => {
    return (
      <div style={{ maxWidth: "70%", margin: "0 auto" }}>
        <TopDepartments />
        <LastEmployees />
      </div>
    );
  };
  
  export default HomePage;