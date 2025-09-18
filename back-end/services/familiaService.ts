import familiaModel from '../models/Familia';

const familiaService = {
  async listarTodos() {
    return await familiaModel.getAll();
  },
  async buscarPorCodigo(codigo: number) {
    const familia = await familiaModel.getById(codigo);
    if (!familia) throw new Error('Família não encontrada');
    return familia;
  },
  async criar(data: any) {
    return await familiaModel.create(data);
  },
  async atualizar(codigo: number, data: any) {
    return await familiaModel.update(codigo, data);
  },
  async remover(codigo: number) {
    return await familiaModel.remove(codigo);
  },
};

export default familiaService;
