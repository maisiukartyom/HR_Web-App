import { initTRPC } from '@trpc/server';
import { addEmployee, addEmployeeRequestSchema, 
    getEmployeesInfo, 
    getEmployeesResponseScheme, getInfoRequest, 
    getLastAdded, getLastResponseScheme, getEmployeeRequest, 
    getEmployeeResponse, 
    getEmployeeInfo,
    deleteEmployee,
    getDepEmployeeRequest,
    getDepEmployees,
    getEmployeeInfoUser} from '../controllers/employeesController';
import { deletionRequest, mutationResponse } from '../utils/commonSchemas';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const employeesRouter = router({
    addEmployee: publicProcedure
        .input(addEmployeeRequestSchema)
        .output(mutationResponse)
        .mutation(async ({input}) => addEmployee({input})),
    getLastEmployees: publicProcedure
        .output(getLastResponseScheme)
        .query(() => getLastAdded()),
    getEmployeesInfo: publicProcedure
        .input(getInfoRequest)
        .output(getEmployeesResponseScheme)
        .query(({input}) => getEmployeesInfo({input})),
    getEmployeeInfo: publicProcedure
        .input(getEmployeeRequest)
        .output(getEmployeeResponse)
        .query(({input}) => getEmployeeInfo({input})),
    deleteEmployee: publicProcedure
        .input(deletionRequest)
        .output(mutationResponse)
        .mutation(({input}) => deleteEmployee({input})),
    getDepEmployees: publicProcedure
        .input(getDepEmployeeRequest)
        .output(getEmployeesResponseScheme)
        .query(({input}) => getDepEmployees({input})),
    getEmployeeInfoUser: publicProcedure
        .input(getEmployeeRequest)
        .output(getEmployeeResponse)
        .query(({input}) => getEmployeeInfoUser({input}))
    
})