// src/pages/AdminTotalizacao.jsx
import React, { useEffect, useState } from "react";

const AdminTotalizacao = () => {
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalPorFamilia, setTotalPorFamilia] = useState([]);
  const [totalPorMarca, setTotalPorMarca] = useState([]);
  const [totalPorFornecedor, setTotalPorFornecedor] = useState([]);

  // Função para buscar o total geral
  useEffect(() => {
    fetch("http://localhost:3000/estoque/valor-total")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTotalGeral(data.valorTotal || 0);
      })
      .catch((error) => {
        console.error("Erro ao buscar total geral:", error);
      });
  }, []);

  // Função para buscar totais por família
  useEffect(() => {
    fetch("http://localhost:3000/estoque/valor-total-por-familia")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((dataf) => {
        setTotalPorFamilia(dataf || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar total por família:", error);
      });
  }, []);

  // Função para buscar totais por marca
  useEffect(() => {
    fetch("http://localhost:3000/estoque/valor-total-por-marca")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((datam) => {
        setTotalPorMarca(datam || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar total por marca:", error);
      });
  }, []);

  // Função para buscar totais por fornecedor
  useEffect(() => {
    fetch("http://localhost:3000/estoque/valor-total-por-fornecedor")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((datafo) => {
        setTotalPorFornecedor(datafo || []);
      })
      .catch((error) => {
        console.error("Erro ao buscar total por fornecedor:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Totalização do Estoque
        </h1>
        <p className="text-gray-600 mt-2">
          Resumo dos valores totais do estoque.
        </p>
      </header>

      {/* Seção de Total Geral */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Total Geral
        </h2>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
          <span className="text-gray-700 font-medium">Valor Total:</span>
          <span className="text-green-600 font-bold text-lg">
            R$ {typeof totalGeral === "number" ? totalGeral.toFixed(2) : "0.00"}
          </span>
        </div>
      </section>

      {/* Outras Seções (por Marca, Família, Fornecedor) */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card para Total por Marca */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Total por Marca
          </h3>
          <ul className="space-y-2">
            {totalPorMarca.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.Marca}</span>
                <span className="text-blue-600 font-medium">
                  R${" "}
                  {typeof totalPorMarca === "number"
                    ? totalPorMarca.toFixed(2)
                    : "0.00"}
                  {/* R$ {item.ValorTotal.toFixed(2)} */}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card para Total por Família */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Total por Família
          </h3>
          <ul className="space-y-2">
            {totalPorFamilia.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.Familia}</span>
                <span className="text-blue-600 font-medium">
                  R${" "}
                  {typeof totalPorFamilia === "number"
                    ? totalPorFamilia.toFixed(2)
                    : "0.00"}
                  {/* R$ {item.ValorTotal.toFixed} */}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card para Total por Fornecedor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Total por Fornecedor
          </h3>
          <ul className="space-y-2">
            {totalPorFornecedor.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.Fornecedor}</span>
                <span className="text-blue-600 font-medium">
                  R${" "}
                  {typeof totalPorFornecedor === "number"
                    ? totalPorFornecedor.toFixed(2)
                    : "0.00"}
                  {/* R$ {item.ValorTotal.toFixed(2)} */}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminTotalizacao;
