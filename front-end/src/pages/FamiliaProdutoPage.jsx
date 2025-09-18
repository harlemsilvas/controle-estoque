import React, { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState("DESCRICAO");
  const [orderDir, setOrderDir] = useState("asc");
  const [selectedFamilia, setSelectedFamilia] = useState(null);
  const [mode, setMode] = useState(MODES.LIST);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [familiaToDelete, setFamiliaToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [familiaForceDelete, setFamiliaForceDelete] = useState(null);

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const params = {
          page,
          limit,
          search: searchQuery || undefined,
          orderBy,
          orderDir,
        };
        // console.log("Parâmetros getFamilias:", params);
        const data = await getFamilias(params);
        // console.log("Retorno getFamilias:", data);
        setFamilias(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        setFamilias([]);
        setTotalPages(1);
        toastError(`Erro ao carregar famílias: ${error.message}`);
        console.error("Erro inesperado em fetchFamilias:", error);
      }
    };
    fetchFamilias().catch((err) => {
      console.error("Erro global em fetchFamilias:", err);
    });
  }, [page, limit, searchQuery, orderBy, orderDir]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
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
      setPage(1); // volta para a primeira página após salvar
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
      setPage(1); // volta para a primeira página após exclusão
    } catch (error) {
      // Se erro 400 e código FK_PRODUTO_FAMILIA, mostrar modal de exclusão forçada
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.code === "FK_PRODUTO_FAMILIA"
      ) {
        setShowDeleteModal(false);
        setFamiliaForceDelete(familiaToDelete);
        setShowForceDeleteModal(true);
        return;
      }
      toastError(`Erro ao excluir família: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setFamiliaToDelete(null);
    }
  };

  const handleForceDeleteConfirm = async () => {
    try {
      if (!familiaForceDelete) return;
      await deleteFamilia(familiaForceDelete, true);
      toastSuccess(
        "Família excluída e produtos atualizados para família padrão!"
      );
      setPage(1);
    } catch (error) {
      toastError(`Erro ao excluir família (forçado): ${error.message}`);
    } finally {
      setShowForceDeleteModal(false);
      setFamiliaForceDelete(null);
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

            <div className="flex flex-wrap gap-2 mb-4">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Campo de busca por nome da família"
              />
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="DESCRICAO">Descrição</option>
                <option value="CODIGO">Código</option>
              </select>
              <select
                value={orderDir}
                onChange={(e) => setOrderDir(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border rounded"
                aria-label="Itens por página"
                style={{ minWidth: 80 }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-gray-500 self-center">
                por página
              </span>
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
                  {familias.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Nenhuma família encontrada
                      </td>
                    </tr>
                  ) : (
                    familias.map((familia, idx) => {
                      const codigo =
                        familia.CODIGO ?? familia.codigo ?? familia.id;
                      const descricao =
                        familia.DESCRICAO ?? familia.descricao ?? familia.nome;
                      // console.log("Renderizando familia:", familia);
                      return (
                        <tr key={codigo || idx}>
                          <td className="px-6 py-4">{codigo}</td>
                          <td className="px-6 py-4">{descricao}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedFamilia(familia);
                                setMode(MODES.EDIT);
                              }}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label={`Editar família ${descricao}`}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                setFamiliaToDelete(codigo);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label={`Excluir família ${descricao}`}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Próxima
              </button>
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
        <ConfirmationModal
          isOpen={showForceDeleteModal}
          onClose={() => setShowForceDeleteModal(false)}
          onConfirm={handleForceDeleteConfirm}
          title="Excluir Família com Produtos Vinculados"
          message="Existem produtos vinculados a esta família. Deseja excluir mesmo assim? Todos os produtos dessa família serão movidos para a família padrão (código 1)."
          confirmText="Excluir Forçado"
          cancelText="Cancelar"
        />
      </div>
    </>
  );
};

export default FamiliaProdutoPage;
