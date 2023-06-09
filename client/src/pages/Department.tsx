import { Card } from 'react-bootstrap';
import { trpc } from '../utils/trpc';
import { useLocation } from 'react-router-dom';
import { EmployeesList } from '../components/EmployeesList';


export const Department: React.FC = () => {
    const location = useLocation()
    const id = location.pathname.split("/")[2];
    const {data: departmentInfo, refetch: ref1, isSuccess} = trpc.getDepartmentInfo.useQuery({id: +id}); 
    const {data: employees, refetch: ref2, isLoading} = trpc.getDepEmployees.useQuery({id: +id});

    const refetchData = () => {
      ref1();
      ref2();
    }

    return (
        <div style={{margin: "0 auto"}}>
          <h1>Department Information</h1>
          {isSuccess && (
            <div style={{margin: "0 auto"}}>
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
              <EmployeesList style={{ maxWidth: "70%", margin: "0 auto" }} employees={employees} 
              refetch={refetchData} isLoading={isLoading} depName={departmentInfo.name}/>
            </div>
          )}
          
        </div>
      );
};