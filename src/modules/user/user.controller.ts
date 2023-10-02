import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { User } from './user.interfaces';

const prisma = new PrismaClient();

/**
 *  @desc   Create a new user
 *  @route  POST /api/v1/users
 *  @access Privet (Admin)
 */
export const createNewUserHandler = asyncHandler(async (req, res, next) => {
  const { email, password, name, username, city, role } = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 12),
      role: role,
      profile: {
        create: {
          city: city,
        },
      },
    },
  });
  res.status(201).json({ status: "success", data: user });
});

/**
 *  @desc   Get all users
 *  @route  GET /api/v1/users
 *  @access Privet (Admin)
 */
export const getAllUsersHandler = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
  include: {
    profile: true
  }
  });
  res.status(200).json({ status: "success", data: users });
});

/**
 *  @desc   Get a specific user
 *  @route  GET /api/v1/users/:id
 *  @access Privet (Admin)
 */
export const getSpecificUserHandler = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const user= await prisma.user.findUnique({where: {id: Number(id)}, include: {
    profile: true
  }});
  res.status(200).json({status: 'success', data: user});
});

/**
 *  @desc   Update a specific user data
 *  @route  PUT /api/v1/users/:id
 *  @access Privet (Admin)
 */
export const updateSpecificUserHandler = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const {email, name, username} = req.body;
  const user = await prisma.user.update({where: {id: Number(id)}, data: {
    name : name,
    username: username,
    email: email
  }});
  res.status(200).json({status: 'success', message: 'User updated successfully', data: user});
});

/**
 *  @desc   Delete a specific user
 *  @route  DELETE /api/v1/users/:id
 *  @access Privet (Admin)
 */
export const deleteSpecificUserHandler = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const user = await prisma.user.update({where: {id: Number(id)}, data: {
    isActive: false
  }});
  res.status(200).json({status: 'success', message: 'User deleted successfully'});
});