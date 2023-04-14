import { useState } from "react";
import { Table } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { trpc } from "../utils/trpc";

type Employee = {
    id: number, 
    firstName: string, 
    lastName: string,
    isHead: boolean, 
    createdAt: string,
    company: {
        id: number,
        name: string
    }
};

export const EmployeesList= ({employees, isLoading}: any):JSX.Element => {
    const [searchTerm, setSearchTerm] = useState("");
    //const {data: employees, isLoading} = trpc.getEmployeesInfo.useQuery({filter: true});
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
    
    const filteredEmployees = employees?.filter((employee: Employee) =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading){
        return (<div>Loading...</div>)
    }
  
    return (
      <div style={{ maxWidth: "70%", margin: "0 auto" }}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Company</th>
              <th>Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee: Employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.company.name}</td>
                <td>{employee.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };