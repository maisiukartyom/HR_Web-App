import { initTRPC } from '@trpc/server';
import { addDepartment, addDepartmentRequestSchema, getTopDepartments,
     getTopResponseSchema, getDepartmentsResponseSchema, 
     getDepartmentResponseSchema, getDepartmentsInfo, getDepartmentRequestSchema, getDepartmentInfo, deleteDepartment } from '../controllers/departmentsController';
import { deletionRequest, mutationResponse } from '../utils/commonSchemas';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const departmentsRouter = router({
    addDepartment: publicProcedure
        .input(addDepartmentRequestSchema)
        .output(mutationResponse)
        .mutation(({input}) => addDepartment({input})),
    topDepartments: publicProcedure
        .output(getTopResponseSchema)
        .query(() => getTopDepartments()),
    getDepartmentsInfo: publicProcedure
        .output(getDepartmentsResponseSchema)
        .query(() => getDepartmentsInfo()),
    getDepartmentInfo: publicProcedure
        .input(getDepartmentRequestSchema)
        .output(getDepartmentResponseSchema)
        .query(({input}) => getDepartmentInfo({input})),
    deleteDepartment: publicProcedure
        .input(deletionRequest)
        .output(mutationResponse)
        .mutation(({input}) => deleteDepartment({input}))
})