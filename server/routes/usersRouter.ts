import { initTRPC } from '@trpc/server';
import { addUser, addUserRequestSchema, deleteUser, loginRequest, loginResponse, Login } from '../controllers/usersController';
import { deletionRequest, mutationResponse } from '../utils/commonSchemas';

const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const usersRouter = router({
    addUser: publicProcedure
        .input(addUserRequestSchema)
        .output(mutationResponse)
        .mutation(async ({input}) => addUser({input})),
    deleteUser: publicProcedure
        .input(deletionRequest)
        .output(mutationResponse)
        .mutation(({input}) => deleteUser({input})),
    login: publicProcedure
        .input(loginRequest)
        .output(loginResponse)
        .mutation(({input}) => Login({input}))
})
