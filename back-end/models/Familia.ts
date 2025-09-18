import sql from 'mssql';
import { connectToDatabase } from './db';

export interface Familia {
  CODIGO?: number;
  DESCRICAO: string;
}

const familiaModel = {
  async getAll(): Promise<Familia[]> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM FAMILIA_PRODUTO`;
    return result.recordset;
  },
  async getById(codigo: number): Promise<Familia | undefined> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM FAMILIA_PRODUTO WHERE CODIGO = ${codigo}`;
    return result.recordset[0];
  },
  async create(data: Familia): Promise<Familia> {
    await connectToDatabase();
    const { DESCRICAO } = data;
    const result = await sql.query`
      INSERT INTO FAMILIA_PRODUTO (DESCRICAO)
      VALUES (${DESCRICAO});
      SELECT SCOPE_IDENTITY() AS CODIGO;
    `;
    return result.recordset[0];
  },
  async update(codigo: number, data: Familia): Promise<Familia | undefined> {
    await connectToDatabase();
    const { DESCRICAO } = data;
    await sql.query`UPDATE FAMILIA_PRODUTO SET DESCRICAO = ${DESCRICAO} WHERE CODIGO = ${codigo}`;
    return this.getById(codigo);
  },
  async remove(codigo: number): Promise<{ codigo: number }> {
    await connectToDatabase();
    await sql.query`DELETE FROM FAMILIA_PRODUTO WHERE CODIGO = ${codigo}`;
    return { codigo };
  },
};

export default familiaModel;
