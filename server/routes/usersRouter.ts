import { initTRPC } from '@trpc/server';
import { addUser, addUserRequestSchema, addResponseSchema } from '../controllers/usersController';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const usersRouter = router({
    addUser: publicProcedure
        .input(addUserRequestSchema)
        .output(addResponseSchema)
        .mutation(async ({input}) => addUser({input}))
})