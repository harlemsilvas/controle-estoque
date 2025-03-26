import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Produtos from "./pages/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import ProdutoForm from "./pages/ProdutoForm";
import Dashboard from "./pages/Dashboard";
import FamiliaProdutoPage from "./pages/FamiliaProdutoPage";
import MarcaProdutoPage from "./pages/MarcaProdutoPage";
import LixeiraProdutos from "./pages/LixeiraProdutos";
import AlertasHistorico from "./pages/AlertasHistorico";
import NovaMovimentacaoEstoque from "./pages/NovaMovimentacaoEstoque";
import NotFound from "./components/NotFound";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produto/:id" element={<ProdutoDetalhes />} />
        // Adicionar novas rotas
        <Route path="/produto/novo" element={<ProdutoForm />} />
        <Route path="/produto/editar/:id" element={<ProdutoForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/familias" element={<FamiliaProdutoPage />} />
        {/* Nova rota para movimentação de estoque */}
        <Route
          path="/estoque/movimentacao"
          element={<NovaMovimentacaoEstoque />}
        />
        <Route path="/marcas" element={<MarcaProdutoPage />} />
        <Route path="/produtos/lixeira" element={<LixeiraProdutos />} />
        <Route path="/alertas/historico" element={<AlertasHistorico />} />
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
