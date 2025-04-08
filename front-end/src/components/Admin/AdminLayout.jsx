// src/components/admin/AdminLayout.jsx
import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js"; // Importa o contexto de autenticação

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext); // Acessa o usuário logado e a função de logout
  const navigate = useNavigate();

  // Função para realizar logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redireciona para a página inicial após o logout
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <nav className="flex space-x-6">
            {/* Dashboard */}
            <Link
              to="/admin"
              className="flex items-center hover:text-blue-300 transition-all"
            >
              <span>Dashboard</span>
            </Link>
            {/* Relatórios */}

            <Link
              to="/admin/relatorios"
              className="hover:text-blue-300 transition-all"
            >
              Relatório
            </Link>
            <Link
              to="/admin/relatorios/marcas"
              className="hover:text-blue-300 transition-all"
            >
              Relatório de Marcas
            </Link>
            {/* Administração de Usuários */}
            <Link
              to="/admin/usuarios"
              className="flex items-center hover:text-blue-300 transition-all"
            >
              <span>Usuários</span>
            </Link>
            {/* Etiquetas */}
            <Link
              to="/admin/etiquetas"
              className="flex items-center hover:text-blue-300 transition-all"
            >
              <span>Etiquetas</span>
            </Link>
            {/* Totais */}
            <Link
              to="/admin/totalizacao"
              className="flex items-center hover:text-blue-300 transition-all"
            >
              <span>Totais</span>
            </Link>
            {/* Configurações */}
            <Link
              to="/admin/configuracoes"
              className="flex items-center hover:text-blue-300 transition-all"
            >
              <span>Configurações</span>
            </Link>
            {/* Sair */}
            <button
              onClick={handleLogout}
              className="flex items-center hover:text-red-300 transition-all"
            >
              <span>Sair</span>
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
// // src/components/AdminLayout.jsx
// import React, { useContext } from "react";
// import { Link, Outlet } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const AdminLayout = () => {
//   const { user } = useContext(AuthContext); // Acessa o usuário logado

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-blue-700 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Painel Administrativo</h1>
//           <nav className="space-x-4">
//             <Link to="/admin" className="hover:text-blue-300 transition-all">
//               Dashboard
//             </Link>
//             {/* Relatórios */}
// <Link
//   to="/admin/relatorios"
//   className="hover:text-blue-300 transition-all"
// >
//   Relatório
// </Link>
//             <Link
//               to="/admin/usuarios"
//               className="hover:text-blue-300 transition-all"
//             >
//               Administração de Usuários
//             </Link>
//             <Link
//               to="/admin/relatorios/marcas"
//               className="hover:text-blue-300 transition-all"
//             >
//               Relatório de Marcas
//             </Link>
//             <Link
//               to="/admin/totalizacao"
//               className="hover:text-blue-300 transition-all"
//             >
//               Totais
//             </Link>
//             <Link
//               to="/admin/configuracoes"
//               className="hover:text-blue-300 transition-all"
//             >
//               Configuracoes
//             </Link>
//             <Link to="/" className="hover:text-blue-300 transition-all">
//               Sair
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* Conteúdo Principal */}
//       <main className="flex-1 container mx-auto p-6 bg-white rounded-lg shadow-md my-4">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white p-4 text-center">
//         <div className="container mx-auto">
//           <p>
//             Usuário Logado:{" "}
//             <strong>{user?.username || "Não identificado"}</strong>
//           </p>
//           <p className="text-sm text-gray-400">
//             &copy; {new Date().getFullYear()} Sistema de Gestão de Estoque
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default AdminLayout;
