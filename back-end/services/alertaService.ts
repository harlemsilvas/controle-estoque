import sql from 'mssql';

const alertaService = {
  async getHistorico() {
    const result = await sql.query`
      SELECT 
        a.*, 
        p.DESCRICAO as PRODUTO_DESCRICAO,
        p.ESTOQUE_ATUAL,
        p.ESTOQUE_MINIMO
      FROM ALERTAS_ESTOQUE a
      INNER JOIN PRODUTO p ON a.CODIGO_PRODUTO = p.CODIGO
      ORDER BY a.DATA_CRIACAO DESC
    `;
    return result.recordset;
  },
};

export default alertaService;
