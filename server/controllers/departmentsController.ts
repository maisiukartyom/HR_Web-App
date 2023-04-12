import {z} from 'zod';
import { prisma } from '../index';
import status from 'http-status';

export const addResponseSchema = z.object({
    success: z.boolean(),
});

export const addDepartmentRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    companyId: z.number(),
});

export const addDepartment = async ({input}: {input: z.infer<typeof addDepartmentRequestSchema>}) => {
    const { name, description,  companyId} = input;

      // Find the company by ID
      const company = await prisma.company.findUnique({ where: { id: companyId } });

      // Throw an error if company doesn't exist
      if (!company) {
        throw {
          status: status[500],
          message: 'Company not found',
        };
      };

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
}