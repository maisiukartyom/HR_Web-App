import { trpc } from "../utils/trpc";
import {Table} from 'react-bootstrap';
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom";

type Department = {
    name: string,
    id: number,
    count: number
}

export const TopDepartments: React.FC = () => {

    //const [topDepartments, setTopDepartments] = useState<Department[]>([]);
    //const [loading, setLoading] = useState<boolean>(true);
    const {data: depData, isSuccess} = trpc.topDepartments.useQuery(); 

    return (
        <div>
          <h1>Top departments</h1>
          {isSuccess && <Table striped bordered hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {depData.map((department: Department) => (
                <tr key={department.id}>
                  <td>{department.count}</td>
                  <td><Link style={{ textDecoration: 'none' }} to={`/department/${department.id}`} >{department.name}</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>}
        </div>
      );
};
