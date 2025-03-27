import React, { useState, useEffect } from "react";
import { toastSuccess, toastError } from "../services/toast";
import Header from "../components/Header";
import { buscarProdutos, registrarMovimentacao } from "../services/api";

const NovaMovimentacaoEstoque = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [form, setForm] = useState({
    tipo: "E",
    quantidade: "",
    usuario: "ADMIN", // Substituir por usuário logado
  });

  // const handleBusca = async () => {
  //   try {
  //     const data = await buscarProdutos(termoBusca);
  //     setResultados(data);
  //   } catch (error) {
  //     toastError(error.message || "Erro na busca de produtos");
  //   }
  // };
  // components/NovaMovimentacaoEstoque.js
  const handleBusca = async () => {
    try {
      const termoTratado = termoBusca.trim().replace(/\s+/g, " "); // Remove espaços extras
      const termoCodificado = encodeURIComponent(termoTratado); // Codifica caracteres especiais

      if (!termoTratado) {
        toastError("Digite um critério de busca");
        return;
      }

      const data = await buscarProdutos(termoCodificado);
      setResultados(data);
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registrarMovimentacao({
        codigoProduto: produtoSelecionado.CODIGO,
        ...form,
      });

      toastSuccess(`
        Movimentação registrada!
        Estoque anterior: ${response.estoqueAnterior}
        Novo estoque: ${response.novoEstoque}
      `);

      // Log no console
      console.log("Detalhes da movimentação:", {
        produto: produtoSelecionado,
        movimento: form,
        estoqueAnterior: response.estoqueAnterior,
        novoEstoque: response.novoEstoque,
      });

      // Reset form
      setForm({ tipo: "E", quantidade: "", usuario: "operador" });
      setProdutoSelecionado(null);
      setTermoBusca("");
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Nova Movimentação de Estoque" />

      <div className="container mx-auto px-6 py-8">
        {/* Busca de Produtos */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Digite EAN, código ou descrição"
              className="flex-1 p-2 border rounded"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <button
              type="button"
              onClick={handleBusca}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>

          {/* Resultados da Busca */}
          {resultados.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded">
              {resultados.map((produto) => (
                <div
                  key={produto.CODIGO}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => setProdutoSelecionado(produto)}
                >
                  <div className="font-semibold">{produto.DESCRICAO}</div>
                  <div className="text-sm text-gray-600">
                    EAN: {produto.EAN} | Código: {produto.CODIGO} | Estoque:{" "}
                    {produto.ESTOQUE_ATUAL}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário de Movimentação */}
        {produtoSelecionado && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Produto Selecionado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Descrição:</p>
                <p>{produtoSelecionado.DESCRICAO}</p>
              </div>
              <div>
                <p className="font-semibold">Estoque Atual:</p>
                <p>{produtoSelecionado.ESTOQUE_ATUAL}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block font-medium mb-2">
                  Tipo de Movimentação
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
        )}
      </div>
    </div>
  );
};

export default NovaMovimentacaoEstoque;
