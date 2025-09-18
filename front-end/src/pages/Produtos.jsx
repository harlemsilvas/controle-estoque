import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Header from "../components/Header";
import {
  deleteProduto,
  getProdutos,
  getFornecedor,
  getMarcas,
  getFamilias,
} from "../services/api";
import { toastSuccess, toastError } from "../services/toast";
import ProdutosGrid from "../components/ProdutosGrid";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSimpleDeleteModal, setShowSimpleDeleteModal] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState([]);
  // Novos estados para paginação/filtros/ordenação
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [fornecedor, setFornecedor] = useState("");
  const [marca, setMarca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [marcasLoading, setMarcasLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [familia, setFamilia] = useState("");
  const [familias, setFamilias] = useState([]);
  const [familiasLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("CODIGO");
  const [orderDir, setOrderDir] = useState("asc");

  // Carregar fornecedores e famílias ao montar
  useEffect(() => {
    const fetchFornecedoresEFamilias = async () => {
      try {
        const [forn, fam] = await Promise.all([
          getFornecedor(),
          getFamilias ? getFamilias() : Promise.resolve([]),
        ]);
        setFornecedores(Array.isArray(forn) ? forn : []);
        setFamilias(Array.isArray(fam) ? fam : []);
      } catch {
        setFornecedores([]);
        setFamilias([]);
      }
    };
    fetchFornecedoresEFamilias();
  }, []);

  // Carregar todas as marcas ao montar
  useEffect(() => {
    const fetchMarcas = async () => {
      setMarcasLoading(true);
      try {
        const marc = await getMarcas({
          limit: 100,
          search: "",
          orderBy: "DESCRICAO",
          orderDir: "asc",
        });
        setMarcas(Array.isArray(marc?.data) ? marc.data : []);
      } catch {
        setMarcas([]);
      }
      setMarcasLoading(false);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const data = await getProdutos({
          page,
          limit,
          search: searchTerm || undefined,
          fornecedor: fornecedor || undefined,
          marca: marca || undefined,
          familia: familia || undefined,
          orderBy,
          orderDir,
        });
        setProdutos(data.data);
        setTotalPages(data.totalPages);
      } catch {
        toastError("Erro ao buscar produtos");
      }
      setLoading(false);
    };
    fetchProdutos();
  }, [page, limit, fornecedor, marca, familia, orderBy, orderDir, searchTerm]);

  // Função para verificar registros relacionados
  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setShowSimpleDeleteModal(true);
  };

  const confirmSimpleDelete = async () => {
    try {
      const response = await deleteProduto(productToDelete);
      if (response.relatedRecords) {
        setRelatedRecords(response.relatedRecords);
        setShowDeleteModal(true);
      } else {
        setProdutos(produtos.filter((p) => p.CODIGO !== productToDelete));
        toastSuccess("Produto excluído com sucesso!");
      }
    } catch (error) {
      toastError("Erro ao excluir produto: " + error.message);
    } finally {
      setShowSimpleDeleteModal(false);
      setProductToDelete(null);
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome, código ou barras..."
            className="px-2 py-1 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ minWidth: 220 }}>
            <Autocomplete
              options={fornecedores}
              getOptionLabel={(option) => option.NOME || option.nome || ""}
              isOptionEqualToValue={(option, value) =>
                (option.CODIGO || option.id || option.codigo) ===
                (value.CODIGO || value.id || value.codigo)
              }
              value={
                fornecedores.find(
                  (f) => (f.CODIGO || f.id || f.codigo) === fornecedor
                ) || null
              }
              onChange={(_, newValue) => {
                setFornecedor(
                  newValue
                    ? newValue.CODIGO || newValue.id || newValue.codigo
                    : ""
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fornecedor"
                  placeholder="Buscar fornecedor..."
                  size="small"
                />
              )}
              clearOnEscape
              noOptionsText="Nenhum fornecedor encontrado"
            />
          </div>
          <div style={{ minWidth: 220 }}>
            <Autocomplete
              options={marcas}
              loading={marcasLoading}
              getOptionLabel={(option) => option.DESCRICAO || option.nome || ""}
              isOptionEqualToValue={(option, value) =>
                (option.CODIGO || option.id || option.codigo) ===
                (value.CODIGO || value.id || value.codigo)
              }
              value={
                marcas.find((m) => (m.CODIGO || m.id || m.codigo) === marca) ||
                null
              }
              onChange={(_, newValue) => {
                setMarca(
                  newValue
                    ? newValue.CODIGO || newValue.id || newValue.codigo
                    : ""
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marca"
                  placeholder="Buscar marca..."
                  size="small"
                />
              )}
              clearOnEscape
              noOptionsText="Nenhuma marca encontrada"
            />
          </div>
          <div style={{ minWidth: 220 }}>
            <Autocomplete
              options={familias}
              getOptionLabel={(option) => option.DESCRICAO || option.nome || ""}
              isOptionEqualToValue={(option, value) =>
                (option.CODIGO || option.id || option.codigo) ===
                (value.CODIGO || value.id || value.codigo)
              }
              value={
                familias.find(
                  (f) => (f.CODIGO || f.id || f.codigo) === familia
                ) || null
              }
              onChange={(_, newValue) => {
                setFamilia(
                  newValue
                    ? newValue.CODIGO || newValue.id || newValue.codigo
                    : ""
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Família"
                  placeholder="Buscar família..."
                  size="small"
                />
              )}
              clearOnEscape
              noOptionsText="Nenhuma família encontrada"
            />
          </div>
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="CODIGO">Código</option>
            <option value="DESCRICAO">Nome</option>
          </select>
          <select
            value={orderDir}
            onChange={(e) => setOrderDir(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <ProdutosGrid
          produtos={Array.isArray(produtos) ? produtos : []}
          onEdit={(codigo) =>
            (window.location.href = `/produto/editar/${codigo}`)
          }
          onDelete={handleDelete}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {/* Modal de confirmação simples para qualquer exclusão */}
        {showSimpleDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirmar Exclusão
              </h2>
              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir este produto?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowSimpleDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSimpleDelete}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}
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
                      const isDate =
                        typeof value === "string" &&
                        !isNaN(new Date(value).getTime()) &&
                        value.trim() !== "";
                      const formattedValue =
                        value === null || value === ""
                          ? "N/A"
                          : isDate
                          ? new Date(value).toLocaleDateString("pt-BR")
                          : value;
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
