import {z} from 'zod'
import { prisma } from '../index';
import status from 'http-status'
import { deletionRequest } from '../utils/commonSchemas';

export const addResponseSchema = z.object({
    success: z.boolean(),
  });

export const addUserRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

export const addUser = async ({input}: {input: z.infer<typeof addUserRequestSchema>}) => {
    const { username, password } = input;

    const tmp = await prisma.user.findUnique({where: {username: username}});

    if (tmp){
        throw {
            status: status[500],
            message: "Such user already exists!"
        }
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