import fornecedorModel from '../models/Fornecedor';

const fornecedorService = {
  async listarTodos() {
    return await fornecedorModel.getAll();
  },
  async buscarPorCodigo(codigo: number) {
    const fornecedor = await fornecedorModel.getById(codigo);
    if (!fornecedor) throw new Error('Fornecedor não encontrado');
    return fornecedor;
  },
  async criar(data: any) {
    return await fornecedorModel.create(data);
  },
  async atualizar(codigo: number, data: any) {
    return await fornecedorModel.update(codigo, data);
  },
  async remover(codigo: number) {
    return await fornecedorModel.remove(codigo);
  },
};

export default fornecedorService;
