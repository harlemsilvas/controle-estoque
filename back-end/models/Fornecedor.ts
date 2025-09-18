import sql from 'mssql';
import { connectToDatabase } from './db';

export interface Fornecedor {
  CODIGO?: number;
  NOME: string;
  CNPJ: string;
  TELEFONE?: string;
  EMAIL?: string;
  ENDERECO?: string;
}

const fornecedorModel = {
  async getAll(): Promise<Fornecedor[]> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM FORNECEDOR`;
    return result.recordset;
  },
  async getById(codigo: number): Promise<Fornecedor | undefined> {
    await connectToDatabase();
    const result = await sql.query`SELECT * FROM FORNECEDOR WHERE CODIGO = ${codigo}`;
    return result.recordset[0];
  },
  async create(data: Fornecedor): Promise<Fornecedor> {
    const { NOME, CNPJ, TELEFONE, EMAIL, ENDERECO } = data;
    await connectToDatabase();
    const result = await sql.query`
      INSERT INTO FORNECEDOR (NOME, CNPJ, TELEFONE, EMAIL, ENDERECO)
      VALUES (${NOME}, ${CNPJ}, ${TELEFONE || null}, ${EMAIL || null}, ${ENDERECO || null});
      SELECT SCOPE_IDENTITY() AS CODIGO;
    `;
    return result.recordset[0];
  },
  async update(codigo: number, data: Fornecedor): Promise<Fornecedor | undefined> {
    const { NOME, CNPJ, TELEFONE, EMAIL, ENDERECO } = data;
    await connectToDatabase();
    await sql.query`
      UPDATE FORNECEDOR SET
        NOME = ${NOME},
        CNPJ = ${CNPJ},
        TELEFONE = ${TELEFONE || null},
        EMAIL = ${EMAIL || null},
        ENDERECO = ${ENDERECO || null}
      WHERE CODIGO = ${codigo}
    `;
    return this.getById(codigo);
  },
  async remove(codigo: number): Promise<{ codigo: number }> {
    await connectToDatabase();
    await sql.query`DELETE FROM FORNECEDOR WHERE CODIGO = ${codigo}`;
    return { codigo };
  },
};

export default fornecedorModel;
