// src/pages/AdminRelatorioMarcas.jsx
import React, { useEffect, useState } from "react";

const AdminRelatorioMarcas = () => {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    fetch("/relatorios/marcas")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMarcas(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar relatório de marcas:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Relatório de Marcas
        </h1>
        <p className="text-gray-600 mt-2">
          Resumo das marcas cadastradas e seus produtos.
        </p>
      </header>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left font-medium">Marca</th>
              <th className="py-2 px-4 text-left font-medium">
                Total de Produtos
              </th>
              <th className="py-2 px-4 text-left font-medium">
                Valor Total em Estoque
              </th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="py-2 px-4">{marca.Marca}</td>
                <td className="py-2 px-4">{marca.TotalProdutos}</td>
                <td className="py-2 px-4">
                  R$ {parseFloat(marca.ValorTotalEstoque || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRelatorioMarcas;
