import { initTRPC } from '@trpc/server';
import { addEmployee, addEmployeeRequestSchema, addResponseSchema } from '../controllers/employeesController';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const employeesRouter = router({
    addEmployee: publicProcedure
        .input(addEmployeeRequestSchema)
        .output(addResponseSchema)
        .mutation(async ({input}) => addEmployee({input}))
})