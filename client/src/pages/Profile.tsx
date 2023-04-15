import { useContext, useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import { trpc } from "../utils/trpc";
import { EmployeeInfo } from "../components/EmployeeInfo";


export const Profile: React.FC = () => {
    const {user} = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPosition, setNewPosition] = useState("");
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const mutationAdd = trpc.addEmployee.useMutation();

    const {data: employee, refetch, isError, isLoading} = trpc.getEmployeeInfoUser.useQuery({id: Number(user?.id)},
    {
        retry: false
    });

    //const [curEmployee, setCurEmployee] = useState(employee);
    const mutationDel = trpc.deleteEmployee.useMutation();

    const handleAddEmployee = async () => {
        if (user){
            await mutationAdd.mutateAsync({
                firstName: newFirstName,
                lastName: newLastName,
                position: newPosition,
                departmentName: newDepartmentName,
                username: user.username
            });
            setNewFirstName("")
            setNewLastName("")
            setNewPosition("")
            setNewDepartmentName("")
            setShowModal(false);
            refetch();
        }
            
    }

    const handleDeleteEmployee = async (id: number) => {
        await mutationDel.mutateAsync({id: id});  
        refetch();
        //setCurEmployee(undefined)    
    }
  
    return (
        !isLoading?
        <div>
            <Container>
                <Row className="mw-50 justify-content-center mt-5">
                <Col md={6} className=" border border-5 text-center">
                    <h1>Welcome, {user?.username}!</h1>
                    <p>Thank you for joining our platform. Enjoy your profile and make the most of it!</p>
                    {isError &&
                    <>
                        <h4>You are not an employee yet!</h4>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Become an Employee
                        </Button>
                    </>
                    }
                </Col>
                </Row>
            </Container>

            {!isError && 
            <div className="text-left">
                <EmployeeInfo employee={employee} isLoading={isLoading}/>
                <div className="text-center">
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteEmployee(Number(employee?.id))}>
                        Delete employee
                    </Button>
                </div>
                
            </div>}
            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Become employee</Modal.Title>
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
                    type="text"
                    placeholder="Enter department name"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                    <Form.Control
                    disabled={true}
                    type="text"
                    placeholder="Enter username"
                    value={user?.username}
                    />
                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddEmployee}>
                    Add employee
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
        :
        <div>
            ""
        </div>
      
    );
  };
