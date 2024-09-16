import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const utils = require(__dirname + "/utils.js");

const authService = new AuthService();

  export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password } = req.body;
  
      const user = await authService.findUserByUsername(username);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '23h' });
      return res.json({ success: true, data: {user ,token} });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };

  export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password, name, brokerId } = req.body;
      const newUser = await authService.createUser(username, password, name, brokerId);
      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  export const loginStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as any).user.id;
      const user = await authService.findUserById(userId);
      if (!user) return res.status(400).json({ message: 'User not found' });
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error' });
    }
  };

  export const getEmbedToken = async (req: Request, res: Response): Promise<Response> => {
    try{
      // Validate whether all the required configurations are provided in config.json
      const configCheckResult = utils.validateConfig();
      if (configCheckResult) {
          return res.status(400).send({
              "error": configCheckResult
          });
      }
      // Get the details like Embed URL, Access token and Expiry
      const result = await authService.getEmbedInfo();

      // result.status specified the statusCode that will be sent along with the result object
      return res.status(result?.status).send(result);

    } catch (error) {
      console.log(error)
      throw error
    }

  }
