import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { trpc } from "../utils/trpc";

type EmployeeT = {
    id: number,
    firstName: string,
    lastName: string,
    position: string,
    isHead: boolean,
    createdAt: string,
    department: {
        id: number,
        name: string,
    },
}

export const EmployeeInfo = ({employee, isLoading} : any):JSX.Element => {

    return(
        <div>
            {!isLoading ? 
                (<Container> 
                    <Row>
                    <Col  className="border border-5 t" md={{ span: 6, offset: 3 }}>
                        <div className="employee-details">
                        <h1 className="text-center">Employee Details</h1>
                        <div className="employee-info">
                            <h4>
                            Name:{' '}
                            <span className="text-muted">
                                {employee?.firstName} {employee?.lastName}
                            </span>
                            </h4>
                            <h4>
                            Position:{' '}
                            <span className="text-muted">{employee?.position}</span>
                            </h4>
                            <h4>
                            Creation Date:{' '}
                            <span className="text-muted">{employee?.createdAt}</span>
                            </h4>
                            <h4>
                            Department:{' '}
                            <Link to={`/department/${employee?.department.id}`}>
                                <span className="text-muted">{employee?.department.name}</span>
                            </Link>
                            </h4>
                        </div>
                        </div>
                    </Col>
                    </Row>
                    
            </Container>) : "Loading..."}
        </div>
    );
}