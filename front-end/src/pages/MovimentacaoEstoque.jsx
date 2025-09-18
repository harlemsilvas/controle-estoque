import React, { useState } from "react";
import { toastSuccess, toastError } from "../services/toast";
import Header from "../components/Header";
import {
  movimentarEstoquePorCodigo,
  movimentarEstoquePorBarcode,
} from "../services/api";

const MovimentacaoEstoque = () => {
  const [tipoForm, setTipoForm] = useState("codigo");
  const [formCodigo, setFormCodigo] = useState({
    codigoProduto: "",
    tipo: "E",
    quantidade: "",
    usuario: "",
  });
  const [formBarcode, setFormBarcode] = useState({
    codigo_barras: "",
    tipo: "E",
    quantidade: "",
    usuario: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChangeCodigo = (e) => {
    setFormCodigo({ ...formCodigo, [e.target.name]: e.target.value });
  };
  const handleChangeBarcode = (e) => {
    setFormBarcode({ ...formBarcode, [e.target.name]: e.target.value });
  };

  const handleSubmitCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formCodigo,
        quantidade: Number(formCodigo.quantidade),
      };
      await movimentarEstoquePorCodigo(payload);
      toastSuccess("Movimentação registrada com sucesso!");
      setFormCodigo({
        codigoProduto: "",
        tipo: "E",
        quantidade: "",
        usuario: "",
      });
    } catch (err) {
      toastError(err.message || "Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBarcode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formBarcode,
        quantidade: Number(formBarcode.quantidade),
      };
      await movimentarEstoquePorBarcode(payload);
      toastSuccess("Movimentação registrada com sucesso!");
      setFormBarcode({
        codigo_barras: "",
        tipo: "E",
        quantidade: "",
        usuario: "",
      });
    } catch (err) {
      toastError(err.message || "Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <Header title="Movimentação de Estoque" />
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Movimentação de Estoque
        </h1>
        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${tipoForm === "codigo" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setTipoForm("codigo")}
          >
            Por Código do Produto
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${tipoForm === "barcode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setTipoForm("barcode")}
          >
            Por Código de Barras
          </button>
        </div>
        {tipoForm === "codigo" ? (
          <form onSubmit={handleSubmitCodigo} className="space-y-4">
            <div>
              <label className="block font-medium">Código do Produto</label>
              <input
                type="text"
                name="codigoProduto"
                value={formCodigo.codigoProduto}
                onChange={handleChangeCodigo}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Tipo de Movimentação</label>
              <select
                name="tipo"
                value={formCodigo.tipo}
                onChange={handleChangeCodigo}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="E">Entrada</option>
                <option value="S">Saída</option>
                <option value="I">Inventário</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formCodigo.quantidade}
                onChange={handleChangeCodigo}
                className="w-full border rounded px-3 py-2"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block font-medium">Usuário</label>
              <input
                type="text"
                name="usuario"
                value={formCodigo.usuario}
                onChange={handleChangeCodigo}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Processando..." : "Registrar Movimentação"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitBarcode} className="space-y-4">
            <div>
              <label className="block font-medium">Código de Barras</label>
              <input
                type="text"
                name="codigo_barras"
                value={formBarcode.codigo_barras}
                onChange={handleChangeBarcode}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Tipo de Movimentação</label>
              <select
                name="tipo"
                value={formBarcode.tipo}
                onChange={handleChangeBarcode}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="E">Entrada</option>
                <option value="S">Saída</option>
                <option value="I">Inventário</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formBarcode.quantidade}
                onChange={handleChangeBarcode}
                className="w-full border rounded px-3 py-2"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block font-medium">Usuário</label>
              <input
                type="text"
                name="usuario"
                value={formBarcode.usuario}
                onChange={handleChangeBarcode}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Processando..." : "Registrar Movimentação"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MovimentacaoEstoque;
