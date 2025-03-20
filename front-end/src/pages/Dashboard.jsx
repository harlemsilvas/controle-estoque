// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from "../components/Header";
import { getEstoqueData, getProdutoAggregate } from "../services/api";
import _ from "lodash";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [aggregateData, setAggregateData] = useState({
    byFamily: [],
    byMarca: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const stock = await getEstoqueData();
      const aggregate = await getProdutoAggregate();

      setStockData(stock);
      setAggregateData(aggregate);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center mt-8">Carregando dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard de Estoque
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico 1: Níveis de Estoque */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Estoque por Produto</h2>
            <BarChart width={500} height={300} data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="DESCRICAO" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="ESTOQUE_ATUAL"
                fill="#8884d8"
                name="Estoque Atual"
              />
              <Bar
                dataKey="ESTOQUE_MINIMO"
                fill="#82ca9d"
                name="Estoque Mínimo"
              />
            </BarChart>
          </div>

          {/* Gráfico 2: Distribuição por Família */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Distribuição por Família
            </h2>
            <PieChart width={500} height={300}>
              <Pie
                data={aggregateData.byFamily}
                dataKey="total"
                nameKey="FAMILIA"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {aggregateData.byFamily.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Gráfico 3: Alertas de Estoque */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Alertas de Estoque</h2>
          <BarChart
            width={1000}
            height={300}
            data={stockData.filter((p) => p.ESTOQUE_ATUAL < p.ESTOQUE_MINIMO)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="DESCRICAO" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ESTOQUE_ATUAL" fill="#ff7300" name="Estoque Atual" />
            <Bar
              dataKey="ESTOQUE_MINIMO"
              fill="#ff0000"
              name="Estoque Mínimo"
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
