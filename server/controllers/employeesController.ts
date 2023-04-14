import { z } from "zod";
import { prisma } from '../index';
import status from 'http-status'
import { deletionRequest } from "../utils/commonSchemas";
import { TRPCError } from "@trpc/server";

export const addEmployeeRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    departmentName: z.string(),
    username: z.string()
});

export const addResponseSchema = z.object({
    success: z.boolean(),
});

export const getLastResponseScheme = z.array(z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string()
}));

export const getEmployeesResponseScheme = z.array(z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  // position: employee.position,
  // departmentId: employee.departmentId,
  // userId: employee.userId,
  isHead: z.boolean(),
  createdAt: z.string(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
}));

export const getInfoRequest = z.object({
  filter: z.boolean()
});

export const getEmployeeRequest = z.object({
  id: z.number() //or firstName
});

export const getEmployeeResponse = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  isHead: z.boolean(),
  createdAt: z.date(),
  department: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const getDepEmployeeRequest = z.object({
  id: z.number()
})




export const addEmployee = async ({input}: {input: z.infer<typeof addEmployeeRequestSchema>}) => {
    const { firstName, lastName, position, departmentName, username } = input;

      // Find the department by name
      const department = await prisma.department.findUnique({ where: { name: departmentName } });

      // Throw an error if department doesn't exist
      if (!department) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Department not found!"
        })
      };

      const user = await prisma.user.findUnique({where: {username: username}});

      if (!user){
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "User doesn't exist!"
        })
      };

      // Check if the department already has a head
      // if (isHead) {
      //   const existingHead = await prisma.employee.findFirst({
      //     where: { departmentId: department.id, isHead: true },
      //   });

      //   if (existingHead) {
      //     throw {
      //       status: status[500],
      //       message: 'Department already has a head employee',
      //     };
      //   }
      // }

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
          }
        },
        include: { department: true},
      });

      return {
        success: true
      };
}

export const getLastAdded = async () => {
  const last = await prisma.employee.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return last.map(emp => ({
    id: emp.id,
    firstName: emp.firstName,
    lastName: emp.lastName,
    createdAt: String(emp.createdAt)
  }))
}

export const getEmployeesInfo = async ({input}: {input: z.infer<typeof getInfoRequest>}) => {
  const {filter} = input;
  const employees = await prisma.employee.findMany({
    orderBy: { firstName: "asc" },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return employees.map((employee) => {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      // position: employee.position,
      // departmentId: employee.departmentId,
      // userId: employee.userId,
      isHead: employee.isHead,
      createdAt: String(employee.createdAt),
      company: {
        id: employee.department.companyId,
        name: employee.department.company.name,
      },
    };
  });
}

export const getEmployeeInfo = async ({input}: {input: z.infer<typeof getEmployeeRequest>}) => {
  const {id} = input;

  const employee = await prisma.employee.findUnique({
    where: {
      id: id
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!employee){
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Employee not found!"
    })
  };

  return {
    id: employee.id, 
    firstName: employee.firstName, 
    lastName: employee.lastName,
    position: employee.position,
    isHead: employee.isHead,
    createdAt: employee.createdAt,
    department: {
      id: employee.department.id,
      name: employee.department.name
    }
  };
}

export const deleteEmployee = async ({input}: {input: z.infer<typeof deletionRequest>}) => {
  const {id} = input;
  await prisma.employee.delete({
    where: {
      id: id
    }
  })

  return({
    success: true
  })
}

export const getDepEmployees = async ({input}: {input: z.infer<typeof getDepEmployeeRequest>}) => {
  const {id} = input;
  const employees = await prisma.employee.findMany({
    where: {
      departmentId: id
    },
    orderBy: { firstName: "asc" },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return employees.map((employee) => {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      // position: employee.position,
      // departmentId: employee.departmentId,
      // userId: employee.userId,
      isHead: employee.isHead,
      createdAt: String(employee.createdAt),
      company: {
        id: employee.department.companyId,
        name: employee.department.company.name,
      },
    };
  });
}
  