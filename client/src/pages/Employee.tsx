import { Col, Container, Row } from "react-bootstrap";
import { trpc } from "../utils/trpc";
import { Link, useLocation } from "react-router-dom";
import { EmployeeInfo } from "../components/EmployeeInfo";


export const Employee: React.FC = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const {data: employee, isLoading} = trpc.getEmployeeInfo.useQuery({id: +id});

    return (
        <div>
            <h2>Info about employee</h2>
            <EmployeeInfo employee={employee} isLoading={isLoading}/>
        </div>
      );
}

