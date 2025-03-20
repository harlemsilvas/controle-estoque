// src/pages/AlertasHistorico.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAlertasHistorico } from "../services/api";

const AlertasHistorico = () => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAlertasHistorico();
      setAlertas(data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Histórico de Alertas
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alertas.map((alerta) => (
                <tr key={alerta.ID}>
                  <td className="px-6 py-4">{alerta.PRODUTO_DESCRICAO}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alerta.STATUS === "ativo"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alerta.ESTOQUE_ATUAL} / {alerta.ESTOQUE_MINIMO}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(alerta.DATA_CRIACAO).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        alerta.STATUS === "ativo"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alerta.STATUS}
                    </span>
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

export default AlertasHistorico;
