import express from 'express';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import * as trcpExpress from '@trpc/server/adapters/express'
import { PrismaClient } from '@prisma/client';
import { companiesRouter } from './routes/companiesRouter';
import { departmentsRouter } from './routes/departmentsRouter';
import { employeesRouter } from './routes/employeesRouter';
import { usersRouter } from './routes/usersRouter';
 
const t = initTRPC.create();
 
const mergeRouters = t.mergeRouters;

export const prisma = new PrismaClient();
 
const appRouter = mergeRouters(companiesRouter, departmentsRouter, employeesRouter, usersRouter);

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use("/trpc/", trcpExpress.createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}));

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});

export type AppRouter = typeof appRouter;
