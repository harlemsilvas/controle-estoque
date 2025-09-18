import { Request, Response, NextFunction } from 'express';
import alertaService from '../services/alertaService';

const alertaController = {
  async historico(req: Request, res: Response, next: NextFunction) {
    try {
      const historico = await alertaService.getHistorico();
      res.json(historico);
    } catch (err) {
      next(err);
    }
  },
};

export default alertaController;
