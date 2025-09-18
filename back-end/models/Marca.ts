import sql from 'mssql';
import { connectToDatabase } from './db';

export interface Marca {
  CODIGO?: number;
  DESCRICAO: string;
}

const marcaModel = {
  async getAll(): Promise<Marca[]> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM MARCA_PRODUTO`;
    return result.recordset;
  },
  async getById(codigo: number): Promise<Marca | undefined> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM MARCA_PRODUTO WHERE CODIGO = ${codigo}`;
    return result.recordset[0];
  },
  async create(data: Marca): Promise<Marca> {
    await connectToDatabase();
    const { DESCRICAO } = data;
    const result = await sql.query`
      INSERT INTO MARCA_PRODUTO (DESCRICAO)
      VALUES (${DESCRICAO});
      SELECT SCOPE_IDENTITY() AS CODIGO;
    `;
    return result.recordset[0];
  },
  async update(codigo: number, data: Marca): Promise<Marca | undefined> {
    await connectToDatabase();
    const { DESCRICAO } = data;
    await sql.query`UPDATE MARCA_PRODUTO SET DESCRICAO = ${DESCRICAO} WHERE CODIGO = ${codigo}`;
    return this.getById(codigo);
  },
  async remove(codigo: number): Promise<{ codigo: number }> {
    await connectToDatabase();
    await sql.query`DELETE FROM MARCA_PRODUTO WHERE CODIGO = ${codigo}`;
    return { codigo };
  },
};

export default marcaModel;
