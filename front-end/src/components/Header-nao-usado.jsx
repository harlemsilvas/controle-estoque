import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLixeiraCount } from "../services/api";
import AlertBadge from "./AlertBadge";

const Header = ({ title, btnText, btnPath }) => {
  const [deletedCount, setDeletedCount] = useState(0);

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

  return (
    <header className="bg-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <AlertBadge />
          <div className="flex space-x-8 items-center">
            {/* Título com ícone SVG */}
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-blue-600"
            >
              {/* Ícone SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6M3 21h18M3 10h18M3 17h18"
                />
              </svg>
              {/* Texto do Título */}
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
                Mov. Estoque
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
