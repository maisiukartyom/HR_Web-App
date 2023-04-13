import { Card } from 'react-bootstrap';
import { trpc } from '../utils/trpc';
import { useLocation } from 'react-router-dom';


export const Department: React.FC = () => {
    const location = useLocation()
    const id = location.pathname.split("/")[2]
    //const [topDepartments, setTopDepartments] = useState<Department[]>([]);
    //const [loading, setLoading] = useState<boolean>(true);
    const {data: departmentInfo, isSuccess} = trpc.getDepartmentInfo.useQuery({id: +id}); 

    return (
        <div>
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
        </div>
      );
};