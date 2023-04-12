import {z} from 'zod';
import { prisma } from '../index';
import status from 'http-status';
import { deletionRequest } from '../utils/commonSchemas';

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
  id: z.number()
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
    departmentId: z.number(),
    userId: z.number(),
    isHead: z.boolean(),
    createdAt: z.date()
  }).optional(),
  creationDate: z.date(),
}))

export const getDepartmentRequestSchema = z.object({
  name: z.string()
})

export const getDepartmentResponseSchema = z.object({
  name: z.string(),
  creationDate: z.date(),
  description: z.string(),
  employees: z.array(z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    userId: z.number(),
    isHead: z.boolean(),
    createdAt: z.date(),
  })),
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

export const getTopDepartments = async () => {
  const departments = await prisma.department.findMany({
    orderBy: [
      {
        employees: {
          _count: 'desc',
        },
      },
    ],
    take: 1,
    include: {
      employees: true,
    },
  });

  return departments.map(dep => ({
    name: dep.name, id: dep.id
  }))
}

export const getDepartmentsInfo = async () => {
    const departments = await prisma.department.findMany({
      include: {
        employees: true,
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
      creationDate: department.creationDate,
    }));

    return departmentsInfo;
}

export const getDepartmentInfo = async ({input}: {input: z.infer<typeof getDepartmentRequestSchema>}) => {
  const {name} = input;
  const department = await prisma.department.findUnique({
    where: { name: name },
    select: {
      name: true,
      creationDate: true,
      description: true,
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          position: true,
          userId: true,
          isHead: true,
          createdAt: true,
        },
      },
    },
  });

  if (!department){
    throw {
      status: status[500],
      message: "No such department!"
    }
  };

  return {
    name: department.name,
    creationDate: department.creationDate,
    description: department.description,
    employees: department.employees,
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


