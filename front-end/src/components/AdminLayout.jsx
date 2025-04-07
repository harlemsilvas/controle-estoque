// src/components/AdminLayout.jsx
import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { user } = useContext(AuthContext); // Acessa o usuário logado

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <nav className="space-x-4">
            <Link to="/admin" className="hover:text-blue-300 transition-all">
              Dashboard
            </Link>
            <Link
              to="/admin/relatorios"
              className="hover:text-blue-300 transition-all"
            >
              Relatórios
            </Link>
            <Link
              to="/admin/usuarios"
              className="hover:text-blue-300 transition-all"
            >
              Administração de Usuários
            </Link>
            <Link
              to="/admin/etiquetas"
              className="hover:text-blue-300 transition-all"
            >
              Etiquetas
            </Link>
            <Link
              to="/admin/totalizacao"
              className="hover:text-blue-300 transition-all"
            >
              Totais
            </Link>
            <Link
              to="/admin/configuracoes"
              className="hover:text-blue-300 transition-all"
            >
              Configuracoes
            </Link>
            <Link to="/" className="hover:text-blue-300 transition-all">
              Sair
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 container mx-auto p-6 bg-white rounded-lg shadow-md my-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          <p>
            Usuário Logado:{" "}
            <strong>{user?.username || "Não identificado"}</strong>
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Sistema de Gestão de Estoque
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
