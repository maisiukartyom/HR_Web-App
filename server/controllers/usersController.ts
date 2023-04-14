import {z} from 'zod'
import { prisma } from '../index';
import status from 'http-status'
import { deletionRequest } from '../utils/commonSchemas';
import { TRPCError } from '@trpc/server';

export const addResponseSchema = z.object({
    success: z.boolean(),
  });

export const addUserRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

export const loginRequest = z.object({
  username: z.string(),
  password: z.string()
})

export const loginResponse = z.object({
  id: z.number(),
  username: z.string(),
})

export const addUser = async ({input}: {input: z.infer<typeof addUserRequestSchema>}) => {
    const { username, password } = input;

    const tmp = await prisma.user.findUnique({where: {username: username}});

    if (tmp){
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "User already exists!"
      })
    };

    const newUser = await prisma.user.create({
        data:{
            username, 
            password
        }
    });

    return{
        success: true
    };
}

export const deleteUser = async ({input}: {input: z.infer<typeof deletionRequest>}) => {
    const {id} = input;
    await prisma.user.delete({
      where: {
        id: id
      }
    })
  
    return({
      success: true
    })
  }

export const Login = async ({input}: {input: z.infer<typeof loginRequest>}) => {
  const {username, password} = input;
  const user = await prisma.user.findFirst({
    where: {
      username: username,
      password: password,
    },
    select: {
      id: true, 
      username: true
    }
  });

  if (!user){
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "User doesn't exist!"
    })
  }
  
  return user;
}