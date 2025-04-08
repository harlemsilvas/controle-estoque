// src/pages/ProdutoDetalhes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import {
  getProdutoById,
  getMarca,
  getFamilia,
  deleteProduto,
} from "../services/api";
import ConfirmationModal from "../components/ConfirmationModal";

const ProdutoDetalhes = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [marca, setMarca] = useState("");
  const [familia, setFamilia] = useState("");
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduto(id);
      navigate("/produtos");
    } catch (error) {
      alert(error.message || "Erro ao excluir produto");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const produtoData = await getProdutoById(id);
      setProduto(produtoData);

      if (produtoData.CODIGO_MARCA) {
        const marcaData = await getMarca(produtoData.CODIGO_MARCA);
        setMarca(marcaData.DESCRICAO);
      }

      if (produtoData.CODIGO_FAMILIA) {
        const familiaData = await getFamilia(produtoData.CODIGO_FAMILIA);
        setFamilia(familiaData.DESCRICAO);
      }
    };
    fetchData();
  }, [id]);

  if (!produto) return <div className="text-center mt-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {produto.DESCRICAO}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-gray-600 font-semibold">
                Código Interno:
              </label>
              <p className="text-gray-800">{produto.CODIGO_INTERNO}</p>
            </div>

            <div>
              <label className="text-gray-600 font-semibold">
                Código de Barras:
              </label>
              <p className="text-gray-800">{produto.CODIGO_BARRAS}</p>
            </div>

            <div>
              <label className="text-gray-600 font-semibold">Marca:</label>
              <p className="text-gray-800">{marca || "N/A"}</p>
            </div>

            <div>
              <label className="text-gray-600 font-semibold">Família:</label>
              <p className="text-gray-800">{familia || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 font-semibold">
                  Estoque Atual:
                </label>
                <p className="text-2xl text-blue-600">
                  {produto.ESTOQUE_ATUAL}
                </p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Estoque Mínimo:
                </label>
                <p className="text-2xl text-red-600">
                  {produto.ESTOQUE_MINIMO}
                </p>
              </div>

              {/* Inserção novo botão */}
              <div className="mt-8 flex space-x-4">
                <Link
                  to={`/produto/editar/${produto.CODIGO}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>

              <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este produto permanentemente?"
              />

              {/* fim_insercao */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhes;
