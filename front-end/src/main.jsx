import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage"; // Importe a página de login
import Register from "./pages/RegisterPage"; // Importe a página de registro
import "./index.css";
import Produtos from "./pages/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import ProdutoForm from "./pages/ProdutoForm";
import Dashboard from "./pages/Dashboard";
import FamiliaProdutoPage from "./pages/FamiliaProdutoPage";
import MarcaProdutoPage from "./pages/MarcaProdutoPage";
import LixeiraProdutos from "./pages/LixeiraProdutos";
import AlertasHistorico from "./pages/AlertasHistorico";
import MovimentacaoEstoque from "./pages/MovimentacaoEstoque";
import NovaMovimentacaoEstoque from "./pages/NovaMovimentacaoEstoque";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import RecoverPage from "./pages/RecoverPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FornecedorProdutoPage from "./pages/FornecedorProdutoPage";
import AdminMenu from "./pages/AdminMenu";
import AdminTotalizacao from "./pages/AdminTotalizacao"; // Importe a página de totalização
import AdminTotalizacaoFamilia from "./pages/AdminTotalizacaoFamilia";
import AdminTotalizacaoMarca from "./pages/AdminTotalizacaoMarca";
import AdminTotalizacaoFornecedor from "./pages/AdminTotalizacaoFornecedor";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRelatorios from "./pages/AdminRelatorios";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminEtiquetas from "./pages/AdminEtiquetas";
import AdminConfiguracoes from "./pages/AdminConfiguracoes";

const user = { username: "admin" }; // Simulação de usuário logado

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rotas protegidas */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <Produtos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produto/:id"
          element={
            <ProtectedRoute>
              <ProdutoDetalhes />
            </ProtectedRoute>
          }
        />
        {/* // Adicionar novas rotas */}
        <Route path="/produto/novo" element={<ProdutoForm />} />
        <Route
          path="/produto/editar/:id"
          element={
            <ProtectedRoute>
              <ProdutoForm />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/familias"
          element={
            <ProtectedRoute>
              <FamiliaProdutoPage />
            </ProtectedRoute>
          }
        />
        {/* Rota para movimentação de estoque com histórico na tela*/}
        <Route
          path="/estoque/movimentacaohistorico"
          element={
            <ProtectedRoute>
              <MovimentacaoEstoque />
            </ProtectedRoute>
          }
        />
        {/* Nova rota para movimentação de estoque */}
        <Route
          path="/estoque/movimentacao"
          element={
            <ProtectedRoute>
              <NovaMovimentacaoEstoque />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marcas"
          element={
            <ProtectedRoute>
              <MarcaProdutoPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/cadastro-fornecedor"
          element={
            <ProtectedRoute>
              <CadastroFornecedor />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/produtos/lixeira" element={<LixeiraProdutos />} />
        <Route
          path="/fornecedores"
          element={
            <ProtectedRoute>
              <FornecedorProdutoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/alertas/historico" element={<AlertasHistorico />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<RecoverPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminMenu />
            </ProtectedRoute>
          }
        /> */}

        {/* Rotas administrativas */}
        <Route path="/admin" element={<AdminLayout user={user} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="totais" element={<AdminMenu />} />
          <Route path="relatorios" element={<AdminRelatorios />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="etiquetas" element={<AdminEtiquetas />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
          <Route
            path="totalizacao/familia"
            element={<AdminTotalizacaoFamilia />}
          />
          <Route path="totalizacao/marca" element={<AdminTotalizacaoMarca />} />
          <Route
            path="totalizacao/fornecedor"
            element={<AdminTotalizacaoFornecedor />}
          />
          <Route path="totalizacao" element={<AdminTotalizacao />} />
          {/* /admin/totalizacao/produto */}
          <Route path="totalizacao/produto" element={<AdminTotalizacao />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      className="toast-container"
    />
  </React.StrictMode>
);

// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
