import sql from 'mssql';
import produtoModel from '../models/Produto';

const produtoService = {
  async getProdutoPorBarcode(barcode: string) {
    const result = await sql.query`
      SELECT * FROM PRODUTO WHERE CODIGO_BARRAS = ${barcode}`;
    return result.recordset[0];
  },
  async listarTodos() {
    const result = await sql.query`
      SELECT * FROM PRODUTO`;
    return result.recordset;
  },
  async aggregate() {
    // Por Família
    const byFamily = await sql.query`
      SELECT
        fp.DESCRICAO AS FAMILIA,
        COUNT(*) AS total,
        SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
      FROM
        PRODUTO p
      JOIN
        FAMILIA_PRODUTO fp ON p.CODIGO_FAMILIA = fp.CODIGO
      GROUP BY fp.DESCRICAO
    `;

    // Por Marca
    const byMarca = await sql.query`
      SELECT
        mp.DESCRICAO AS MARCA,
        COUNT(*) AS total,
        SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
      FROM
        PRODUTO p
      JOIN
        MARCA_PRODUTO mp ON p.CODIGO_MARCA = mp.CODIGO
      GROUP BY mp.DESCRICAO
    `;

    // Por Fornecedor
    const byFornecedor = await sql.query`
      SELECT 
        m.NOME AS FORNECEDOR,
        SUM(p.ESTOQUE_ATUAL) AS total,
        SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
      FROM PRODUTO p
      JOIN FORNECEDOR m ON p.COD_FORNECEDOR = m.CODIGO      
      GROUP BY m.NOME
    `;

    return {
      byFamily: byFamily.recordset,
      byMarca: byMarca.recordset,
      byFornecedor: byFornecedor.recordset,
    };
  },
  async getEstoque() {
    const result = await sql.query`
      SELECT TOP (10)
        CODIGO,
        DESCRICAO,
        ESTOQUE_ATUAL,
        ESTOQUE_MINIMO
      FROM PRODUTO
    `;
    return result.recordset;
  },
  async buscarPorCodigo(codigo: number) {
    const produto = await produtoModel.getById(codigo);
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  },
  async criar(produtoData: any) {
    // Adicione validações ou regras de negócio aqui
    return await produtoModel.create(produtoData);
  },
  async atualizar(codigo: number, produtoData: any) {
    // Validação ou lógica extra pode ser adicionada aqui
    return await produtoModel.update(codigo, produtoData);
  },
  async remover(codigo: number) {
    // Ao invés de remover fisicamente, marca como deletado
    await sql.query`UPDATE PRODUTO SET DELETADO = 1 WHERE CODIGO = ${codigo}`;
    return { codigo };
  },

  // Lixeira: lista produtos deletados
  async listarLixeira() {
    const result = await sql.query`SELECT * FROM PRODUTO WHERE DELETADO = 1`;
    return result.recordset;
  },

  // Lixeira: conta produtos deletados
  async contarLixeira() {
    const result = await sql.query`SELECT COUNT(*) AS count FROM PRODUTO WHERE DELETADO = 1`;
    return result.recordset[0]?.count || 0;
  },

  // Lixeira: restaurar produto
  async restaurarProduto(codigo: number) {
    await sql.query`UPDATE PRODUTO SET DELETADO = 0 WHERE CODIGO = ${codigo}`;
    return { codigo };
  },

  // Lixeira: excluir permanentemente
  async excluirPermanentemente(codigo: number) {
    await sql.query`DELETE FROM PRODUTO WHERE CODIGO = ${codigo}`;
    return { codigo };
  },

  // Busca produtos por termo (código ou descrição)
  async buscarProdutos(termo: string) {
    const likeTerm = `%${termo}%`;
    const result = await sql.query`
      SELECT * FROM PRODUTO
      WHERE (CAST(CODIGO AS VARCHAR) LIKE ${likeTerm} OR DESCRICAO LIKE ${likeTerm})
        AND (DELETADO = 0 OR DELETADO IS NULL)
    `;
    return result.recordset;
  },
};

export default produtoService;
