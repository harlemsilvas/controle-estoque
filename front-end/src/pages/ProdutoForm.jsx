import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  getProdutoById,
  getMarcas,
  getFamilias,
  createProduto,
  updateProduto,
} from "../services/api";
import { toastSuccess, toastError } from "../services/toast";

const ProdutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CODIGO_INTERNO: "",
    DESCRICAO: "",
    CODIGO_BARRAS: "",
    ESTOQUE_MINIMO: 0,
    ESTOQUE_ATUAL: 0,
    CODIGO_MARCA: "",
    CODIGO_FAMILIA: "",
  });
  const [marcas, setMarcas] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchData = async () => {
      // Carregar marcas e famílias
      const marcasData = await getMarcas();
      const familiasData = await getFamilias();
      setMarcas(marcasData);
      setFamilias(familiasData);

      // Se for edição, carregar dados do produto
      if (id) {
        const produtoData = await getProdutoById(id);
        setFormData(produtoData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduto(id, formData);
        toastSuccess("Produto atualizado com sucesso!");
      } else {
        await createProduto(formData);
        toastSuccess("Produto criado com sucesso!");
      }
      navigate("/produtos");
    } catch (error) {
      toastError(error.response?.data || "Erro ao salvar produto");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <div className="text-center mt-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {id ? "Editar Produto" : "Novo Produto"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Descrição *</label>
              <input
                type="text"
                name="DESCRICAO"
                value={formData.DESCRICAO}
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Estoque Atual
                </label>
                <input
                  type="number"
                  name="ESTOQUE_ATUAL"
                  value={formData.ESTOQUE_ATUAL}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/produtos")}
                className="px-6 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {id ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProdutoForm;
