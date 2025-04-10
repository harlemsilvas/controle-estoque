// src/components/admin/AdminLayout.jsx
import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isReportsOpen, setIsReportsOpen] = useState(false); // Estado para controlar o dropdown

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <nav className="flex space-x-6 items-center">
            {/* Dashboard */}
            <Link to="/admin" className="hover:text-blue-300 transition-all">
              Dashboard
            </Link>

            {/* Dropdown de Relatórios */}
            <div
              className="relative"
              onMouseEnter={() => setIsReportsOpen(true)}
              onMouseLeave={() => setIsReportsOpen(false)}
            >
              <button className="hover:text-blue-300 transition-all flex items-center">
                Relatórios ▼
              </button>

              {isReportsOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-48"
                  onMouseEnter={() => setIsReportsOpen(true)}
                  onMouseLeave={() => setIsReportsOpen(false)}
                >
                  <div className="bg-white text-gray-800 rounded-lg shadow-lg py-2">
                    <Link
                      to="/admin/relatorios/marcas"
                      className="block px-4 py-2 hover:bg-blue-50"
                    >
                      Relatório de Marcas
                    </Link>
                    <Link
                      to="/admin/relatorios/fornecedores"
                      className="block px-4 py-2 hover:bg-blue-50"
                    >
                      Relatório de Fornecedores
                    </Link>
                    <Link
                      to="/admin/relatorios/familias"
                      className="block px-4 py-2 hover:bg-blue-50"
                    >
                      Relatório de Famílias
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Demais Links */}
            <Link
              to="/admin/usuarios"
              className="hover:text-blue-300 transition-all"
            >
              Usuários
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
              Configurações
            </Link>

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="hover:text-red-300 transition-all"
            >
              Sair
            </button>
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
