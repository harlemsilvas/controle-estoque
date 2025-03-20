import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getTotais } from "../services/api";
import { toastError } from "../services/toast";
import { CubeIcon, TagIcon, FolderIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const [totais, setTotais] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTotais = async () => {
      try {
        const data = await getTotais();
        setTotais(data);
      } catch (error) {
        toastError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadTotais();
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(loadTotais, 300000); // Atualiza a cada 5 minutos
  //   return () => clearInterval(interval);
  // }, []);

  const MetricCard = ({ title, value, color, link }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="flex items-baseline justify-between">
        <div>
          <span className={`text-4xl font-bold ${color}`}>
            {loading ? "--" : value}
          </span>
          <span className="text-gray-500 ml-2">registros</span>
        </div>
        <Link
          to={link}
          className={`text-sm ${color} hover:opacity-80 transition-opacity`}
        >
          Ver todos →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Visão Geral do Estoque
          </h1>

          <p className="text-xl text-gray-600">
            Dados atualizados em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"> */}
          {/* Cards existentes... */}
          <MetricCard
            title="Produtos"
            value={totais.produtos}
            color="text-blue-600"
            link="/produtos"
          />

          <MetricCard
            title="Marcas"
            value={totais.marcas}
            color="text-green-600"
            link="/marcas"
          />

          <MetricCard
            title="Famílias"
            value={totais.familias}
            color="text-purple-600"
            link="/familias"
          />

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Movimentações
              </h2>
              <div className="bg-orange-100 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 00-1 1v8a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zm11 3a1 1 0 01-1-1V5h1.5a1 1 0 01.8.4l.975 1.3a.5.5 0 01.025.6H14z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M16 5a1 1 0 00-1-1h-1.5a1 1 0 00-.8.4l-.975 1.3a.5.5 0 00-.025.6H14a1 1 0 001 1h.5v5h-.025a.5.5 0 00-.025.6l.975 1.3a1 1 0 00.8.4H15a1 1 0 001-1V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 mt-4">Controle de entradas e saídas</p>
            <Link
              to="/estoque/movimentacao"
              className="inline-block w-full mt-6 text-center bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Acessar
            </Link>
          </div>
          {/* </div> */}
        </div>

        {/* Seção de Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                to="/produto/novo"
                className="block p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                + Novo Produto
              </Link>
              <Link
                to="/marca/novo"
                className="block p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
              >
                + Nova Marca
              </Link>
              <Link
                to="/familia/novo"
                className="block p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
              >
                + Nova Família
              </Link>
              <Link
                to="/estoque/movimentacao"
                //   className="block p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                // >
                className="inline-block w-full mt-6 text-center bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                + Movimentação de estoque
              </Link>
            </div>
          </div>

          {/* Adicione mais seções aqui se necessário */}
        </div>
      </div>
    </div>
  );
};

export default Home;

// Dentro do MetricCard, antes do título:
{
  /* <div className="mb-3">
  <CubeIcon className="h-8 w-8 text-blue-500" />
</div> */
}
