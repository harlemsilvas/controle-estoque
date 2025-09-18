import { Request, Response, NextFunction } from 'express';
import estoqueService from '../services/estoqueService';

const estoqueController = {
  // Valor total geral do estoque
  async getValorTotalEstoque(req: Request, res: Response, next: NextFunction) {
    try {
      const valor = await estoqueService.getValorTotalEstoque();
      res.json({ valor_total: valor });
    } catch (err) {
      next(err);
    }
  },

  // Valor total por família
  async getValorTotalPorFamilia(req: Request, res: Response, next: NextFunction) {
    try {
      const valores = await estoqueService.getValorTotalPorFamilia();
      res.json(valores);
    } catch (err) {
      next(err);
    }
  },

  // Valor total por marca
  async getValorTotalPorMarca(req: Request, res: Response, next: NextFunction) {
    try {
      const valores = await estoqueService.getValorTotalPorMarca();
      res.json(valores);
    } catch (err) {
      next(err);
    }
  },

  // Valor total por fornecedor
  async getValorTotalPorFornecedor(req: Request, res: Response, next: NextFunction) {
    try {
      const valores = await estoqueService.getValorTotalPorFornecedor();
      res.json(valores);
    } catch (err) {
      next(err);
    }
  },
  async getHistoricoPorBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcode } = req.params;
      const historico = await estoqueService.getHistoricoPorBarcode(barcode);
      res.json(historico);
    } catch (err) {
      next(err);
    }
  },

  // Movimentação por código do produto
  async movimentarEstoque(req: Request, res: Response, next: NextFunction) {
    try {
      const { codigoProduto, tipo, quantidade, usuario } = req.body;
      const resultado = await estoqueService.registrarMovimentacaoPorCodigo({
        codigoProduto,
        tipo,
        quantidade,
        usuario,
      });
      res.status(201).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // Movimentação por código de barras
  async movimentarPorBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { codigo_barras, tipo, quantidade, usuario } = req.body;
      const resultado = await estoqueService.registrarMovimentacaoPorBarcode({
        codigo_barras,
        tipo,
        quantidade,
        usuario,
      });
      res.status(201).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // Retorna os 15 produtos com mais e menos estoque
  async getEstoqueResumo(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await estoqueService.getEstoqueResumo();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

export default estoqueController;
