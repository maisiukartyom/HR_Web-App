import { addCompany, addCompanyRequestSchema } from '../controllers/companiesControllers';
import { initTRPC } from '@trpc/server';
import { mutationResponse } from '../utils/commonSchemas';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const companiesRouter = router({
    addCompany: publicProcedure
        .input(addCompanyRequestSchema)
        .output(mutationResponse)
        .mutation(async ({input}) => addCompany({input}))
})