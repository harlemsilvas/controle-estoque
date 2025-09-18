import marcaModel from '../models/Marca';

const marcaService = {
  async listarTodos() {
    return await marcaModel.getAll();
  },
  async buscarPorCodigo(codigo: number) {
    const marca = await marcaModel.getById(codigo);
    if (!marca) throw new Error('Marca não encontrada');
    return marca;
  },
  async criar(data: any) {
    return await marcaModel.create(data);
  },
  async atualizar(codigo: number, data: any) {
    return await marcaModel.update(codigo, data);
  },
  async remover(codigo: number) {
    return await marcaModel.remove(codigo);
  },
};

export default marcaService;
