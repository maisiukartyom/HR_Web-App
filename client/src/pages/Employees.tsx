import { EmployeesList } from "../components/EmployeesList"
import { trpc } from "../utils/trpc";


export const Employees: React.FC = () => {
    const {data: employees, refetch, isLoading} = trpc.getEmployeesInfo.useQuery({filter: true});

    return(
        <div>
            <h1>Employees list</h1>
            <EmployeesList employees={employees} isLoading={isLoading} refetch={refetch}/>
        </div>
    )  
}