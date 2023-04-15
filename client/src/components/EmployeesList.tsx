import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { trpc } from "../utils/trpc";
import { Link } from "react-router-dom";

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

export const EmployeesList= ({employees, isLoading, refetch, depName}: any):JSX.Element => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPosition, setNewPosition] = useState("");
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [newUsername, setNewUsername] = useState("");
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
    
    const filteredEmployees: Array<Employee> = employees?.filter((employee: Employee) =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const mutationDel = trpc.deleteEmployee.useMutation();
    const mutationAdd = trpc.addEmployee.useMutation();

    const handleAddEmployee = async () => {
      await mutationAdd.mutateAsync({
        firstName: newFirstName,
        lastName: newLastName,
        position: newPosition,
        departmentName: depName? depName: newDepartmentName,
        username: newUsername
      });
      setShowAddModal(false);
      refetch();
    };

    const handleDeleteEmployee = async (id: number) => {
      await mutationDel.mutateAsync({id: id});
      refetch();
    }

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
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Employee
        </Button>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee: Employee) => (
              <tr key={employee.id}>
                <td><Link to={`/employee/${employee.id}`}>{employee.firstName} {employee.lastName}</Link></td>
                <td>{employee.company.name}</td>
                <td>{employee.createdAt}</td>
                <td>
                  <Button
                      variant="danger"
                      onClick={() => handleDeleteEmployee(employee.id)}>
                      Delete
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filteredEmployees.length=== 0 && <h3>No employees found!</h3>}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Department</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="newEmployee">
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter position"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                  />
                  <Form.Control
                    disabled={depName? true : false}
                    type="text"
                    placeholder="Enter department name"
                    value={depName? depName : newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddEmployee}>
                    Add employee
                </Button>
            </Modal.Footer>
            </Modal>
      </div>
    );
  };