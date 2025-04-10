import React, { useEffect, useState } from "react";

const AdminRelatorioFornecedores = () => {
  const [data, setData] = useState(null); // Estado para armazenar os dados da API
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para capturar erros

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/produto-aggregate",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Se houver autenticação via token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados da API");
        }

        const result = await response.json();
        setData(result); // Armazena os dados no estado
      } catch (err) {
        setError(err.message); // Captura o erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchData(); // Chama a função para buscar os dados
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Dados Agregados dos Produtos - Fornecedores
      </h1>

      {/* Exibição dos dados por Família */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Por Fornecedor
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Fornecedor</th>
                <th className="py-2 px-4 border-b">Qtde Total</th>
                <th className="py-2 px-4 border-b">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {data.byFornecedor.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.fornecedor}</td>
                  <td className="py-2 px-4 border-b">{item.total}</td>
                  <td className="py-2 px-4 border-b">
                    {item.ValorTotalEstoque.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRelatorioFornecedores;
