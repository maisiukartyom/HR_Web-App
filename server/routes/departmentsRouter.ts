import { initTRPC } from '@trpc/server';
import { addDepartment, addDepartmentRequestSchema, addResponseSchema } from '../controllers/departmentsController';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const departmentsRouter = router({
    addDepartment: publicProcedure
        .input(addDepartmentRequestSchema)
        .output(addResponseSchema)
        .mutation(async ({input}) => addDepartment({input}))
})