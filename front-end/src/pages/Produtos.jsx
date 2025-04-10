import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { deleteProduto, getProdutos } from "../services/api";
import { toastSuccess, toastError } from "../services/toast";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [relatedRecords, setRelatedRecords] = useState([]); // Registros relacionados

  useEffect(() => {
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(data);
      setLoading(false);
    };
    fetchProdutos();
  }, []);

  // Filtrar produtos com base no termo de busca
  const filteredProducts = produtos.filter(
    (produto) =>
      produto.DESCRICAO.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.CODIGO_INTERNO?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      produto.CODIGO_BARRAS?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para verificar registros relacionados
  const handleDelete = async (productId) => {
    try {
      const response = await deleteProduto(productId);

      if (response.relatedRecords) {
        // Se houver registros relacionados, armazena-os e abre o modal
        setRelatedRecords(response.relatedRecords);
        setProductToDelete(productId);
        setShowDeleteModal(true);
      } else {
        // Se não houver registros relacionados, exclui diretamente
        setProdutos(produtos.filter((p) => p.CODIGO !== productId));
        toastSuccess("Produto excluído com sucesso!");
      }
    } catch (error) {
      toastError("Erro ao verificar registros relacionados." + error.message);
    }
  };

  // Função para excluir tudo (produto e registros relacionados)
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/produto/${productToDelete}/excluir-tudo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // Remove o produto da lista local
        setProdutos(produtos.filter((p) => p.CODIGO !== productToDelete));
        toastSuccess("Produto e registros relacionados excluídos com sucesso!");
      } else {
        throw new Error("Erro ao excluir produto e registros relacionados.");
      }
    } catch (error) {
      toastError(
        "Erro ao excluir produto e registros relacionados.",
        error.message
      );
    } finally {
      setShowDeleteModal(false); // Fecha o modal
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Lista de Produtos
          </h1>

          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar por nome, código ou barras..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((produto) => (
              <div
                key={produto.CODIGO}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {produto.DESCRICAO}
                  </h2>
                  <p className="text-gray-600">
                    Código: {produto.CODIGO_INTERNO || "N/A"}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/produto/${produto.CODIGO}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver detalhes
                    </Link>
                    <Link
                      to={`/produto/editar/${produto.CODIGO}`}
                      className="text-gray-600 hover:text-blue-800"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(produto.CODIGO)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Nenhum produto encontrado
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirmação de Exclusão
            </h2>
            <p className="text-gray-700 mb-4">
              Os seguintes registros relacionados serão excluídos:
            </p>

            {/* Grade de Registros Relacionados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {relatedRecords.map((record, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col justify-between"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    Registro #{index + 1}
                  </h3>
                  <ul className="text-xs text-gray-600 mt-2">
                    {Object.entries(record).map(([key, value]) => {
                      // Verifica se o valor é uma string válida e representa uma data
                      const isDate =
                        typeof value === "string" &&
                        !isNaN(new Date(value).getTime()) &&
                        value.trim() !== "";

                      // Formata o valor conforme o tipo
                      const formattedValue =
                        value === null || value === ""
                          ? "N/A" // Substitui valores vazios ou nulos por "N/A"
                          : isDate
                          ? new Date(value).toLocaleDateString("pt-BR") // Formata datas
                          : value; // Exibe números e outros tipos exatamente como estão

                      return (
                        <li key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {formattedValue}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
