import { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { trpc } from "../utils/trpc";
import { Link } from "react-router-dom";

type Department = {
    id: number,
    name: string,
    employeeCount: number,
    headOfDepartment?: {
        id: number,
        firstName: string,
        lastName: string,
        position: string,
        isHead: boolean,
    },
  creationDate: string,
}

export const Departments: React.FC = () => {
 
    const {data: departments, isLoading, refetch} = trpc.getDepartmentsInfo.useQuery(); 
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [newDepartmentDesc, setNewDepartmentDesc] = useState("");

    const mutationDel = trpc.deleteDepartment.useMutation();
    const mutationAdd = trpc.addDepartment.useMutation();

    const handleDeleteDepartment = async (id: number) => {
      await mutationDel.mutateAsync({id: id});
      refetch();
    };

    const handleAddDepartment = async () => {
      // companyID need to be changed!!!!
      await mutationAdd.mutateAsync({name: newDepartmentName, description: newDepartmentDesc, companyId: 1});
      setShowAddModal(false);
      refetch();
    };

    if (isLoading) {
        return (<div>Loading...</div>);
    };

    return (
        <div style={{ maxWidth: "70%", margin: "0 auto" }}>
          <h1>Department Management</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Department
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Employee Count</th>
                <th>Head of Department</th>
                <th>Creation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments?.map((department: Department) => (
                <tr key={department.id}>
                  <td><Link to={`/department/${department.id}`} style={{ textDecoration: 'none' }}>{department.name}</Link></td>
                  <td>{department.employeeCount}</td>
                  <td>{department.headOfDepartment? (`${department.headOfDepartment?.firstName} ${department.headOfDepartment?.lastName}`) : "-"}</td>
                  <td>{department.creationDate}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteDepartment(department.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
    
          {/* Add Department Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Department</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="departmentName">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter department name"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter department description"
                    value={newDepartmentDesc}
                    onChange={(e) => setNewDepartmentDesc(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddDepartment}>
                    Add Department
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
);
}