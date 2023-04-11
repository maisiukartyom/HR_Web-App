import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import { initTRPC } from '@trpc/server';
import * as trcpExpress from '@trpc/server/adapters/express'
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import status from 'http-status'
 
const t = initTRPC.create();
 
const router = t.router;
const publicProcedure = t.procedure;

const addEmployeeRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  departmentName: z.string(),
  isHead: z.boolean().optional(),
});

const addCompanyRequestSchema = z.object({
  name: z.string(),
});

const addDepartmentRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  companyId: z.number(),
});


export const addResponseSchema = z.object({
  success: z.boolean(),
});


const prisma = new PrismaClient()
 
const appRouter = router({
  addEmployee: publicProcedure
    .input(addEmployeeRequestSchema)
    .output(addResponseSchema)
    .mutation(async ({ input }) => {
      const { firstName, lastName, position, departmentName, isHead } = input;

      // Find the department by name
      const department = await prisma.department.findUnique({ where: { name: departmentName } });

      // Throw an error if department doesn't exist
      if (!department) {
        throw {
          status: status[500],
          message: 'Department not found',
        };
      }

      // Check if the department already has a head
      if (isHead) {
        const existingHead = await prisma.employee.findFirst({
          where: { departmentId: department.id, isHead: true },
        });

        if (existingHead) {
          throw {
            status: status[500],
            message: 'Department already has a head employee',
          };
        }
      }

      // Create the new employee
      const employee = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          position,
          department: {
            connect: { id: department.id },
          },
          isHead: isHead || false,
        },
        include: { department: true },
      });

      return {
        success: true
      }
    }),
  addCompany: publicProcedure
    .input(addCompanyRequestSchema)
    .output(addResponseSchema)
    .mutation(async ({ input }) => {
      const { name } = input;

      // Create the new company
      const company = await prisma.company.create({ data: { name } })

      return{
        success: true
      }
    }),
  addDepartment: publicProcedure
    .input(addDepartmentRequestSchema)
    .output(addResponseSchema)
    .mutation(async ({ input }) => {
      const { name, description,  companyId} = input;

      // Find the company by ID
      const company = await prisma.company.findUnique({ where: { id: companyId } });

      // Throw an error if company doesn't exist
      if (!company) {
        throw {
          status: status[500],
          message: 'Company not found',
        };
      }

      // Create the new department
      const department = await prisma.department.create({
        data: {
          name,
          description,
          company: { connect: { id: companyId } },
        },
        include: { company: true },
      });

      return { 
        success: true
       };
    })
});

const app = express();

app.use(express.json());
app.use("/trpc", trcpExpress.createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}))



app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});

export type AppRouter = typeof appRouter;


