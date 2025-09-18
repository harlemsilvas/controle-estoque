import { Request, Response, NextFunction } from 'express';
import familiaService from '../services/familiaService';

/**
 * @swagger
 * tags:
 *   name: Familia
 *   description: Operações relacionadas a famílias
 */
const familiaController = {
  /**
   * @swagger
   * /familia:
   *   get:
   *     summary: Lista todas as famílias
   *     tags: [Familia]
   *     responses:
   *       200:
   *         description: Lista de famílias
   */
  async listarTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const familias = await familiaService.listarTodos();
      res.json(familias);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /familia/{codigo}:
   *   get:
   *     summary: Busca uma família pelo código
   *     tags: [Familia]
   *     parameters:
   *       - in: path
   *         name: codigo
   *         schema:
   *           type: integer
   *         required: true
   *         description: Código da família
   *     responses:
   *       200:
   *         description: Família encontrada
   *       404:
   *         description: Família não encontrada
   */
  async buscarPorCodigo(req: Request, res: Response, next: NextFunction) {
    try {
      const codigo = parseInt(req.params.codigo, 10);
      const familia = await familiaService.buscarPorCodigo(codigo);
      res.json(familia);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /familia:
   *   post:
   *     summary: Cria uma nova família
   *     tags: [Familia]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       201:
   *         description: Família criada
   *       400:
   *         description: Erro de validação
   */
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const novaFamilia = await familiaService.criar(req.body);
      res.status(201).json(novaFamilia);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /familia/{codigo}:
   *   put:
   *     summary: Atualiza uma família existente
   *     tags: [Familia]
   *     parameters:
   *       - in: path
   *         name: codigo
   *         schema:
   *           type: integer
   *         required: true
   *         description: Código da família
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Família atualizada
   *       400:
   *         description: Erro de validação
   */
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const codigo = parseInt(req.params.codigo, 10);
      const familiaAtualizada = await familiaService.atualizar(codigo, req.body);
      res.json(familiaAtualizada);
    } catch (err) {
      next(err);
    }
  },
  /**
   * @swagger
   * /familia/{codigo}:
   *   delete:
   *     summary: Remove uma família
   *     tags: [Familia]
   *     parameters:
   *       - in: path
   *         name: codigo
   *         schema:
   *           type: integer
   *         required: true
   *         description: Código da família
   *     responses:
   *       204:
   *         description: Família removida
   *       400:
   *         description: Erro ao remover
   */
  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const codigo = parseInt(req.params.codigo, 10);
      await familiaService.remover(codigo);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default familiaController;
