import {z} from 'zod';
import { prisma } from '../index';
import status from 'http-status';
import { deletionRequest } from '../utils/commonSchemas';
import { TRPCError } from '@trpc/server';

export const addResponseSchema = z.object({
    success: z.boolean(),
});

export const addDepartmentRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    companyId: z.number(),
});

export const getTopResponseSchema = z.array(z.object({
  name: z.string(),
  id: z.number(),
  count: z.number()
}))

export const getDepartmentsResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  employeeCount: z.number(),
  headOfDepartment: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    isHead: z.boolean(),
  }).optional(),
  creationDate: z.string(),
}))

export const getDepartmentRequestSchema = z.object({
  id: z.number()
})

export const getDepartmentResponseSchema = z.object({
  name: z.string(),
  creationDate: z.string(),
  description: z.string(),
  count: z.number(),
  headOfDepartment: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    userId: z.number(),
    isHead: z.boolean()
  }).optional(),
  // employees: z.array(z.object({
  //   id: z.number(),
  //   firstName: z.string(),
  //   lastName: z.string(),
  //   position: z.string(),
  //   userId: z.number(),
  //   isHead: z.boolean(),
  //   createdAt: z.date(),
  // })),
});

export const deleteDepartmentRequest = z.object({
  id: z.number()
})


export const addDepartment = async ({input}: {input: z.infer<typeof addDepartmentRequestSchema>}) => {
    const { name, description,  companyId} = input;

      // Find the company by ID
      const company = await prisma.company.findUnique({ where: { id: companyId } });

      // Throw an error if company doesn't exist
      if (!company) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Company not found!"
        })
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

export const getTopDepartments = async () => {
  const departments = await prisma.department.findMany({
    orderBy: [
      {
        employees: {
          _count: 'desc',
        },
      },
    ],
    take: 5,
    include: {
      employees: true,
    },
  });

  return departments.map(dep => ({
    name: dep.name, id: dep.id, count: dep.employees.length
  }))
}

export const getDepartmentsInfo = async () => {
    const departments = await prisma.department.findMany({
      include: {
        employees: {
          select: {
            id: true, 
            firstName: true, 
            lastName: true, 
            position: true,
            isHead: true
          }
        },
        company: false,
      },
      orderBy: { creationDate: "asc" },
    });

    // Extract relevant information from departments
    const departmentsInfo = departments.map((department) => ({
      id: department.id,
      name: department.name,
      employeeCount: department.employees.length,
      headOfDepartment: department.employees.find(
        (employee) => employee.isHead === true
      ),
      creationDate: String(department.creationDate),
    }));

    return departmentsInfo;
}

export const getDepartmentInfo = async ({input}: {input: z.infer<typeof getDepartmentRequestSchema>}) => {
  const {id} = input;
  const department = await prisma.department.findUnique({
    where: { id: id },
    select: {
      name: true,
      creationDate: true,
      description: true,
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userId: true,
          isHead: true,
        },
      },
    },
  });

  if (!department){
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Department not found!"
    })
  };

  return {
    name: department.name,
    creationDate: String(department.creationDate),
    description: department.description,
    count: department.employees.length,
    headOfDepartment: department.employees.find(
      (employee) => employee.isHead === true
    ),
    //employees: department.employees,
  };
}

export const deleteDepartment = async ({input}: {input: z.infer<typeof deletionRequest>}) => {
  const {id} = input;
  await prisma.department.delete({
    where: {
      id: id
    }
  })

  return({
    success: true
  })
}


