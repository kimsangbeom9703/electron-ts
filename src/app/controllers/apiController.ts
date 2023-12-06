import { Request, Response, NextFunction } from 'express';
import apiService from '../services/apiService';

const home = async (req: Request, res: Response, next: NextFunction) => {
    const data = await apiService.getData();
    res.status(200).send(data);
};

export default {
    home
};
