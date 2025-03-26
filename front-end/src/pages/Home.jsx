import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getTotais } from "../services/api";
import { toastError } from "../services/toast";

const Home = () => {
  const [totais, setTotais] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTotais = async () => {
      try {
        const data = await getTotais();
        setTotais(data);
      } catch (error) {
        toastError("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };
    loadTotais();
  }, []);

  const MetricCard = ({ title, value, color, link, icon }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>{icon}</div>
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <span className={`text-3xl font-bold ${color}`}>
            {loading ? "--" : value}
          </span>
        </div>
        <Link
          to={link}
          className={`text-sm ${color} hover:opacity-80 transition-opacity`}
        >
          Gerenciar →
        </Link>
      </div>
    </div>
  );

  // Ícones SVG
  const icons = {
    produto: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    movimentacao: (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    marca: (
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    familia: (
      <svg
        className="w-6 h-6 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sistema de Gestão de Estoque
          </h1>
          <p className="text-xl text-gray-600">
            Controle completo do seu inventário
          </p>
        </div>

        {/* Seção de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Produtos"
            value={totais.produtos}
            color="text-blue-600"
            link="/produtos"
            icon={icons.produto}
          />

          <MetricCard
            title="Movimentações"
            value={totais.movimentacoes || "--"}
            color="text-orange-600"
            link="/estoque/movimentacao"
            icon={icons.movimentacao}
          />

          <MetricCard
            title="Marcas"
            value={totais.marcas}
            color="text-green-600"
            link="/marcas"
            icon={icons.marca}
          />

          <MetricCard
            title="Famílias"
            value={totais.familias}
            color="text-purple-600"
            link="/familias"
            icon={icons.familia}
          />
        </div>

        {/* Seção de Acesso Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link
                to="/produto/novo"
                className="block p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                + Novo Produto
              </Link>
              <Link
                to="/estoque/movimentacao"
                className="block p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
              >
                Nova Movimentação
              </Link>
              <Link
                to="/relatorios"
                className="block p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Gerar Relatórios
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Últimas Atividades</h2>
            <div className="text-gray-500">
              {/* Espaço para implementar feed de atividades posteriormente */}
              <p className="p-3">Módulo em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
