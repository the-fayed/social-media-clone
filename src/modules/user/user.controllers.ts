import asyncHandler from "express-async-handler";
import { CreateUserBody, IUser, UpdateLoggedUserPassword, UpdateSpecificUserData } from "./user.interfaces";
import UserServices from "./user.services";
import ApiError from "./../../utils/api.error";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";

class UserControllers {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }
  /**
   *  @desc   Create a new user
   *  @route  POST /api/v1/users
   *  @access Privet (Admin)
   */
  createNewUser = asyncHandler(async (req, res, next): Promise<void> => {
    const createUserBody: CreateUserBody = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      role: req.body.role,
      avatar: req.file?.path,
      website: req.body.website,
    };
    const user = await this.userServices.createUser(createUserBody);
    if (!user) return next(new ApiError("Can not create this user email at the time please try again late", 500));
    res.status(201).json({ status: "success", data: user });
  });

  /**
   *  @desc   Get all users
   *  @route  GET /api/v1/users
   *  @access Privet (Admin)
   */
  getAllUsers = asyncHandler(async (req, res, next): Promise<void> => {
    const users = await this.userServices.getAllUsers();
    if (!users) throw new ApiError("Can not get any users at time", 500);
    res.status(200).json({ status: "success", data: users });
  });

  /**
   *  @desc   Get a specific user
   *  @route  GET /api/v1/users/:id
   *  @access Privet (Admin)
   */
  getSpecificUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userServices.getSpecificUser(Number(id));
    if (!user) return next(new ApiError("Can not get this user at the time", 500));
    res.status(200).json({ status: "success", data: user });
  });

  /**
   *  @desc   Update a specific user data
   *  @route  PUT /api/v1/users/:id
   *  @access Privet (Admin)
   */
  UpdateSpecificUserData = asyncHandler(async (req, res, next): Promise<void> => {
    const updateSpecificUserDataBody: UpdateSpecificUserData = {
      id: Number(req.params.id),
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      avatar: req.file?.path,
      website: req.body.website,
    };
    const user = await this.userServices.updateSpecificUserData(updateSpecificUserDataBody);
    if (!user) return next(new ApiError("Can not update user data at time", 500));
    res.status(200).json({ status: "success", data: user });
  });

  /**
   *  @desc   Update a specific user data
   *  @route  PUT /api/v1/users/update/loggedUserData
   *  @access Privet (user || admin)
   */
  updateLoggedUserData = asyncHandler(async (req: AuthorizationRequest, res, next) => {
    const updateSpecificUserDataBody: UpdateSpecificUserData = {
      id: Number(req.user.id),
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      avatar: req.file?.path,
      website: req.body.website,
    };
    const user = await this.userServices.updateSpecificUserData(updateSpecificUserDataBody);
    if (!user) return next(new ApiError("Can not update user data at time", 500));
    res.status(200).json({ status: "success", data: user });
  });

  /**
   *  @desc   Update a specific user data
   *  @route  PUT /api/v1/users/update/loggedUserData
   *  @access Privet (user || admin)
   */
  updateLoggedUserPassword = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const updateLoggedUserPasswordBody: UpdateLoggedUserPassword = {
      id: Number(req.user.id),
      password: req.body.password,
    };
    const user = await this.userServices.updateLoggedUserPassword(updateLoggedUserPasswordBody);
    if (!user) return next(new ApiError("Cant not update user password at time", 500));
    res.status(200).json({ status: "success", data: user });
  });

  /**
   *  @desc   Delete a specific user
   *  @route  DELETE /api/v1/users/:id
   *  @access Privet (Admin)
   */
  deleteAUser = asyncHandler(async (req, res, next): Promise<void> => {
    const { id } = req.params;
    const result = await this.userServices.deleteSpecificUser(Number(id));
    if (!result) return next(new ApiError("Can not delete this user at time", 500));
    res.status(200).json({ status: "success", message: result });
  });
};

export default UserControllers;