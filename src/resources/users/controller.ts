import { Request, Response } from 'express';

const getAll = async (req: Request, res: Response) => {
  try {
    const users = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'];
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export default {
  getAll,
};
