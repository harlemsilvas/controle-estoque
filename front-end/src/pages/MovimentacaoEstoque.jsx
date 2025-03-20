import React, { useState, useEffect } from "react";
import { toastSuccess, toastError } from "../services/toast";
import Header from "../components/Header";
import {
  getProdutoPorBarcode,
  getHistoricoEstoque,
  registrarMovimentacao,
} from "../services/api";

const MovimentacaoEstoque = () => {
  const [produto, setProduto] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [form, setForm] = useState({
    codigo_barras: "",
    tipo: "E",
    quantidade: "",
    usuario: "admin", // Substituir por usuário logado
  });

  const buscarProduto = async (barcode) => {
    try {
      const data = await getProdutoPorBarcode(barcode);
      setProduto(data);

      const historico = await getHistoricoEstoque(barcode);
      setHistorico(historico);
    } catch (error) {
      toastError(error.message);
      setProduto(null);
    }
    // console.log("🚀 ~ buscarProduto ~ data:", data);
    console.log("🚀 ~ buscarProduto ~ error.message:", error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarMovimentacao(form);
      await buscarProduto(form.codigo_barras);
      toastSuccess("Movimentação registrada com sucesso!");
      setForm((prev) => ({ ...prev, quantidade: "" }));
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toastError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Controle de Estoque por Código de Barras" />

      <div className="container mx-auto px-6 py-8">
        {/* Formulário de Leitura */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscarProduto(form.codigo_barras);
            }}
          >
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Digite ou escaneie o código de barras"
                className="flex-1 p-2 border rounded"
                value={form.codigo_barras}
                onChange={(e) =>
                  setForm({ ...form, codigo_barras: e.target.value })
                }
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Dados do Produto */}
        {produto && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Informações do Produto */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">{produto.DESCRICAO}</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Código:</span>{" "}
                  {produto.CODIGO}
                </p>
                <p>
                  <span className="font-semibold">Estoque Atual:</span>{" "}
                  {produto.ESTOQUE_ATUAL}
                </p>
                <p>
                  <span className="font-semibold">Marca:</span>{" "}
                  {produto.MARCA || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Família:</span>{" "}
                  {produto.FAMILIA || "N/A"}
                </p>
              </div>
            </div>

            {/* Formulário de Movimentação */}
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">
                    Tipo de Lançamento
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="E">Entrada</option>
                    <option value="S">Saída</option>
                    <option value="I">Inventário</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full p-2 border rounded"
                    value={form.quantidade}
                    onChange={(e) =>
                      setForm({ ...form, quantidade: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Registrar Movimentação
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Histórico de Movimentações */}
        {produto && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Últimos Lançamentos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuário
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historico.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        {new Date(item.DATA).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded ${
                            item.TIPO_LANCAMENTO === "E"
                              ? "bg-green-100 text-green-800"
                              : item.TIPO_LANCAMENTO === "S"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100"
                          }`}
                        >
                          {item.TIPO_LANCAMENTO === "E"
                            ? "Entrada"
                            : item.TIPO_LANCAMENTO === "S"
                            ? "Saída"
                            : "Inventário"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.QUANTIDADE}</td>
                      <td className="px-6 py-4">{item.USUARIO}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {historico.length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  Nenhum lançamento registrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovimentacaoEstoque;
