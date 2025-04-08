// src/components/AdminMenu.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Menu de Navegação */}
      <nav className="space-y-4">
        {/* Totalização do Estoque */}
        <Link
          to="/admin/totalizacao"
          className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
        >
          <span className="mr-3 text-blue-500">📊</span>
          <span className="text-gray-800 font-medium">
            Totalização do Estoque
          </span>
        </Link>

        {/* Totalização por Marca */}
        <Link
          to="/admin/totalizacao/marca"
          className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
        >
          <span className="mr-3 text-green-500">🏷️</span>
          <span className="text-gray-800 font-medium">
            Totalização por Marca
          </span>
        </Link>

        {/* Totalização por Família */}
        <Link
          to="/admin/totalizacao/familia"
          className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
        >
          <span className="mr-3 text-purple-500">🌿</span>
          <span className="text-gray-800 font-medium">
            Totalização por Família
          </span>
        </Link>

        {/* Totalização por Fornecedor */}
        <Link
          to="/admin/totalizacao/fornecedor"
          className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
        >
          <span className="mr-3 text-orange-500">🚛</span>
          <span className="text-gray-800 font-medium">
            Totalização por Fornecedor
          </span>
        </Link>

        {/* Totalização por Produto (Exemplo) */}
        <Link
          to="/admin/totalizacao/produto"
          className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
        >
          <span className="mr-3 text-red-500">🛒</span>
          <span className="text-gray-800 font-medium">
            Totalização por Produto
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminMenu;
