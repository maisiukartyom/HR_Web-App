import { Table } from "react-bootstrap";
import { trpc } from "../utils/trpc";

type Employee = {
    id: number,
    firstName: string, 
    lastName: string, 
    createdAt: string
}


export const LastEmployees: React.FC = () => {

    const {data: emplData , isSuccess} = trpc.getLastEmployees.useQuery();

    return (
        <div>
          <h1>Recently Added Employees</h1>
          {isSuccess &&
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {emplData.map((employee: Employee) => (
                <tr key={employee.id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>}
        </div>
      );
}