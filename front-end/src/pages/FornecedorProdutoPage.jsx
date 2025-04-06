import React, { useState, useEffect, useCallback } from "react";
import { toastSuccess, toastError } from "../services/toast";
import FornecedorForm from "../components/FornecedorForm";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import {
  getFornecedor,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
} from "../services/api";

const MODES = {
  LIST: "list",
  CREATE: "create",
  EDIT: "edit",
};

const FornecedorProdutoPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [mode, setMode] = useState(MODES.LIST);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fornecedorToDelete, setFornecedorToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      const data = await getFornecedor();
      if (!Array.isArray(data)) {
        throw new Error("Formato inválido de fornecedores recebido");
      }
      setFornecedores(data);
    } catch (error) {
      toastError(`Erro ao carregar fornecedores: ${error.message}`);
    }
  };

  const filterFornecedores = useCallback(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = fornecedores.filter((fornecedor) =>
      fornecedor.NOME.toLowerCase().includes(lowerQuery)
    );
    setFilteredFornecedores(filtered);
  }, [searchQuery, fornecedores]);

  useEffect(() => {
    filterFornecedores();
  }, [filterFornecedores]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSave = async (fornecedorData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!fornecedorData.NOME?.trim()) {
        throw new Error("O nome do fornecedor é obrigatório");
      }

      if (mode === MODES.CREATE) {
        await createFornecedor(fornecedorData);
        toastSuccess("Fornecedor criado com sucesso!");
      } else {
        await updateFornecedor(selectedFornecedor.CODIGO, fornecedorData);
        toastSuccess("Fornecedor atualizado com sucesso!");
      }

      setMode(MODES.LIST);
      loadFornecedores();
    } catch (error) {
      toastError(error.message || "Erro ao salvar fornecedor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!fornecedorToDelete) return;

      await deleteFornecedor(fornecedorToDelete);
      toastSuccess("Fornecedor excluído com sucesso!");
      loadFornecedores();
    } catch (error) {
      toastError(`Erro ao excluir fornecedor: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setFornecedorToDelete(null);
    }
  };

  return (
    <>
      <Header title={"Cadastro de fornecedores"} />
      <div className="min-h-screen bg-gray-50 p-6">
        {mode === MODES.LIST ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Fornecedores de Produtos
              </h1>
              <button
                onClick={() => setMode(MODES.CREATE)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Criar novo fornecedor"
              >
                Novo Fornecedor
              </button>
            </div>

            {/* Campo de busca adicionado */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Campo de busca por nome do fornecedor"
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFornecedores.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Nenhum fornecedor encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredFornecedores.map((fornecedor) => (
                      <tr key={fornecedor.CODIGO}>
                        <td className="px-6 py-4">{fornecedor.CODIGO}</td>
                        <td className="px-6 py-4">{fornecedor.NOME}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFornecedor(fornecedor);
                              setMode(MODES.EDIT);
                            }}
                            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Editar família ${fornecedor.NOME}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setFornecedorToDelete(fornecedor.CODIGO);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Excluir família ${fornecedor.NOME}`}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <FornecedorForm
            fornecedor={mode === MODES.EDIT ? selectedFornecedor : null}
            onSave={handleSave}
            onCancel={() => setMode(MODES.LIST)}
            isSubmitting={isSubmitting}
            isEditing={false}
          />
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este fornecedor permanentemente?"
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </div>
    </>
  );
};

export default FornecedorProdutoPage;
