import { z } from "zod";
import { prisma } from '../index';
import status from 'http-status'

export const addEmployeeRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    departmentName: z.string(),
    username: z.string(),
    isHead: z.boolean().optional(),
});

export const addResponseSchema = z.object({
    success: z.boolean(),
});

export const addEmployee = async ({input}: {input: z.infer<typeof addEmployeeRequestSchema>}) => {
    const { firstName, lastName, position, departmentName, username,  isHead } = input;

      // Find the department by name
      const department = await prisma.department.findUnique({ where: { name: departmentName } });

      // Throw an error if department doesn't exist
      if (!department) {
        throw {
          status: status[500],
          message: 'Department not found',
        };
      };

      const user = await prisma.user.findUnique({where: {username: username}});

      if (!user){
        throw {
          status: status[500],
          message: "User doesn't exist"
        }
      };

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
          user: {
            connect: {id: user.id}
          },
          isHead: isHead || false,
        },
        include: { department: true},
      });

      return {
        success: true
      };
}
  