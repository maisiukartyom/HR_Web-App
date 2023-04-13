import { Link } from "react-router-dom";
import { TopDepartments } from "../components/TopDepartments";
import { LastEmployees } from "../components/LastEmployees";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const HomePage: React.FC = () => {
    return (
      <div>
        <TopDepartments />
        <LastEmployees />
      </div>
    );
  };
  
  export default HomePage;