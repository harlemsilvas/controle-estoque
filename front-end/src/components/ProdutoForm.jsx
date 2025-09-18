// Formulário de produto extraído de pages para components
import React from "react";

const ProdutoForm = ({
  formData,
  marcas = [],
  familias = [],
  fornecedores = [],
  loading = false,
  onChange,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  if (loading) return <div className="text-center mt-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {isEdit ? "Editar Produto" : "Novo Produto"}
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Descrição *</label>
              <input
                type="text"
                name="DESCRICAO"
                value={formData.DESCRICAO}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Código Interno
                </label>
                <input
                  type="text"
                  name="CODIGO_INTERNO"
                  value={formData.CODIGO_INTERNO}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Código de Barras
                </label>
                <input
                  type="text"
                  name="CODIGO_BARRAS"
                  value={formData.CODIGO_BARRAS}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Marca</label>
                <select
                  name="CODIGO_MARCA"
                  value={formData.CODIGO_MARCA}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione uma marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.CODIGO} value={marca.CODIGO}>
                      {marca.DESCRICAO}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Família</label>
                <select
                  name="CODIGO_FAMILIA"
                  value={formData.CODIGO_FAMILIA}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione uma família</option>
                  {familias.map((familia) => (
                    <option key={familia.CODIGO} value={familia.CODIGO}>
                      {familia.DESCRICAO}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  name="ESTOQUE_MINIMO"
                  value={formData.ESTOQUE_MINIMO}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Valor Unitário (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="VALOR_UNITARIO"
                  value={formData.VALOR_UNITARIO}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Fornecedor</label>
                <select
                  name="COD_FORNECEDOR"
                  value={formData.COD_FORNECEDOR}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.CODIGO} value={fornecedor.CODIGO}>
                      {fornecedor.NOME}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Estoque Atual
                </label>
                <input
                  type="number"
                  name="ESTOQUE_ATUAL"
                  value={formData.ESTOQUE_ATUAL}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEdit ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProdutoForm;
