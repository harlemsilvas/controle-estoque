// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLixeiraCount } from "../services/api";
import AlertBadge from "./AlertBadge";

const Header = ({ title, btnText, btnPath }) => {
  const [deletedCount, setDeletedCount] = useState(0);
  const navigate = useNavigate();

  // Carrega a contagem ao montar o componente
  useEffect(() => {
    const loadCount = async () => {
      try {
        const { count } = await getLixeiraCount();
        setDeletedCount(count);
      } catch (error) {
        console.error("Erro ao carregar contagem da lixeira:", error);
      }
    };
    loadCount();
  }, []);

  // Função para sair
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redireciona para a página de login
    //window.location.href = "/login";
  };
  // const handleLogout = () => {
  // localStorage.removeItem("token"); // Remove o token JWT
  //   navigate("/login"); // Redireciona para a página de login
  // };

  return (
    <header className="bg-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <AlertBadge />
          <div className="flex space-x-8 items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EstoqueApp
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/produtos"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
              >
                Produtos
              </Link>

              <Link
                to="/marcas"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
              >
                Marcas
              </Link>

              {/* Fornecedor */}
              {/* Novo link para Fornecedores */}
              <Link
                to="/fornecedores"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
              >
                Fornecedores
              </Link>
              <Link
                to="/familias"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
              >
                Famílias
              </Link>
              <Link
                to="/alertas/historico"
                className="px-4 py-2 text-orange-600 hover:text-orange-800 transition"
              >
                Histórico de Alertas
              </Link>
              <Link
                to="/estoque/movimentacao"
                className="px-4 py-2 text-orange-600 hover:text-orange-800 transition"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mov. Estoque
                </div>
              </Link>

              <Link
                to="/produtos/lixeira"
                className="px-4 py-2 text-red-600 hover:text-red-800 transition relative"
              >
                Lixeira
                {deletedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {deletedCount}
                  </span>
                )}
              </Link>

              <Link
                to="/Admin"
                className="px-4 py-2 text-orange-600 hover:text-orange-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                />
                Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {btnText && (
              <Link
                to={btnPath}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {btnText}
              </Link>
            )}

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
