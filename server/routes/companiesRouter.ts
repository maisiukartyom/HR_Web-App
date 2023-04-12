import { addCompany, addCompanyRequestSchema, addResponseSchema } from '../controllers/companiesControllers';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const companiesRouter = router({
    addCompany: publicProcedure
        .input(addCompanyRequestSchema)
        .output(addResponseSchema)
        .mutation(async ({input}) => addCompany({input}))
})