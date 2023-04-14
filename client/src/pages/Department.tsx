import { Card } from 'react-bootstrap';
import { trpc } from '../utils/trpc';
import { useLocation } from 'react-router-dom';
import { EmployeesList } from '../components/EmployeesList';


export const Department: React.FC = () => {
    const location = useLocation()
    const id = location.pathname.split("/")[2];
    const {data: departmentInfo, isSuccess} = trpc.getDepartmentInfo.useQuery({id: +id}); 
    const {data: employees, isLoading} = trpc.getDepEmployees.useQuery({id: +id});

    return (
        <div >
          <h1>Department Information</h1>
          {isSuccess && (
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{departmentInfo.name}</Card.Title>
                <Card.Text>
                  Number of Employees: {departmentInfo.count}
                </Card.Text>
                <Card.Text>
                  Head of Department: {departmentInfo.headOfDepartment?.firstName}{' '}
                  {departmentInfo.headOfDepartment?.lastName}
                </Card.Text>
                <Card.Text>
                  Creation Date: {departmentInfo.creationDate}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
          <EmployeesList style={{ maxWidth: "70%", margin: "0 auto" }} employees={employees} isLoading={isLoading}/>
        </div>
      );
};