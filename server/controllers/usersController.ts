import {z} from 'zod'
import { prisma } from '../index';
import { deletionRequest } from '../utils/commonSchemas';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

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
  isAdmin: z.boolean(),
})

export const addUser = async ({input}: {input: z.infer<typeof addUserRequestSchema>}) => {
    const { username, password } = input;

    const tmp = await prisma.user.findUnique({where: {username: username}});
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    if (tmp){
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "User already exists!"
      })
    };

    const newUser = await prisma.user.create({
        data:{
            username, 
            password: hash
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
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true, 
      username: true,
      password: true,
      isAdmin: true
    }
  });


  if (!user){
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "User doesn't exist!"
    })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect){
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Password doesn't match!"
    })
  }

  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}