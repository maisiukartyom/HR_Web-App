import {z} from 'zod';
import { prisma } from '../index';
import status from 'http-status';

export const addResponseSchema = z.object({
    success: z.boolean(),
  });

export const addCompanyRequestSchema = z.object({
    name: z.string(),
  });

export const addCompany = async ({input}: {input: z.infer<typeof addCompanyRequestSchema>}) => {
    const { name } = input;
      const tmp = await prisma.company.findUnique({ where: { name: name } });

      if (tmp){
        throw {
          status: status[500],
          message: 'Company already exists!',
        };
      };
      // Create the new company
      const company = await prisma.company.create({ data: { name } });

      return{
        success: true
      };
}