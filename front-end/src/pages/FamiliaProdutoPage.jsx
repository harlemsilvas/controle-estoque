import React, { useState, useEffect, useCallback } from "react";
import { toastSuccess, toastError } from "../services/toast";
import FamiliaForm from "../components/FamiliaForm";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import {
  getFamilias,
  createFamilia,
  updateFamilia,
  deleteFamilia,
} from "../services/api";

const MODES = {
  LIST: "list",
  CREATE: "create",
  EDIT: "edit",
};

const FamiliaProdutoPage = () => {
  const [familias, setFamilias] = useState([]);
  const [filteredFamilias, setFilteredFamilias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [mode, setMode] = useState(MODES.LIST);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [familiaToDelete, setFamiliaToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFamilias();
  }, []);

  const loadFamilias = async () => {
    try {
      const data = await getFamilias();
      if (!Array.isArray(data)) {
        throw new Error("Formato inválido de famílias recebido");
      }
      setFamilias(data);
    } catch (error) {
      toastError(`Erro ao carregar famílias: ${error.message}`);
    }
  };

  const filterFamilias = useCallback(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = familias.filter((familia) =>
      familia.DESCRICAO.toLowerCase().includes(lowerQuery)
    );
    setFilteredFamilias(filtered);
  }, [searchQuery, familias]);

  useEffect(() => {
    filterFamilias();
  }, [filterFamilias]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSave = async (familiaData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!familiaData.DESCRICAO?.trim()) {
        throw new Error("A descrição da família é obrigatória");
      }

      if (mode === MODES.CREATE) {
        await createFamilia(familiaData);
        toastSuccess("Família criada com sucesso!");
      } else {
        await updateFamilia(selectedFamilia.CODIGO, familiaData);
        toastSuccess("Família atualizada com sucesso!");
      }

      setMode(MODES.LIST);
      loadFamilias();
    } catch (error) {
      toastError(error.message || "Erro ao salvar família");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!familiaToDelete) return;

      await deleteFamilia(familiaToDelete);
      toastSuccess("Família excluída com sucesso!");
      loadFamilias();
    } catch (error) {
      toastError(`Erro ao excluir família: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setFamiliaToDelete(null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        {mode === MODES.LIST ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Famílias de Produtos
              </h1>
              <button
                onClick={() => setMode(MODES.CREATE)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Criar nova família"
              >
                Nova Família
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
                aria-label="Campo de busca por nome da família"
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
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFamilias.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Nenhuma família encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredFamilias.map((familia) => (
                      <tr key={familia.CODIGO}>
                        <td className="px-6 py-4">{familia.CODIGO}</td>
                        <td className="px-6 py-4">{familia.DESCRICAO}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFamilia(familia);
                              setMode(MODES.EDIT);
                            }}
                            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Editar família ${familia.DESCRICAO}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setFamiliaToDelete(familia.CODIGO);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Excluir família ${familia.DESCRICAO}`}
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
          <FamiliaForm
            familia={mode === MODES.EDIT ? selectedFamilia : null}
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
          message="Tem certeza que deseja excluir esta família permanentemente?"
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </div>
    </>
  );
};

export default FamiliaProdutoPage;
