// src/pages/AdminUsuarios.jsx
import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [senhaAtualizada, setSenhaAtualizada] = useState({
    userId: "",
    newPassword: "",
  });
  const [mensagem, setMensagem] = useState("");

  // Carregar lista de usuários
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("http://localhost:3000/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  // Criar novo usuário
  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:3000/usuarios", novoUsuario);
      setMensagem("Usuário criado com sucesso!");
      fetchUsuarios(); // Atualiza a lista de usuários
      setNovoUsuario({ username: "", email: "", password: "" }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setMensagem("Erro ao criar usuário.");
    }
  };

  // Alterar senha
  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `http://localhost:3000//usuarios/${senhaAtualizada.userId}/senha`,
        {
          newPassword: senhaAtualizada.newPassword,
        }
      );
      setMensagem("Senha alterada com sucesso!");
      setSenhaAtualizada({ userId: "", newPassword: "" }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMensagem("Erro ao alterar senha.");
    }
  };

  // Desativar/Reativar usuário
  const handleStatusUsuario = async (id, isActive) => {
    try {
      await api.put(`http://localhost:3000/usuarios/${id}/status`, {
        isActive,
      });
      api;
      fetchUsuarios(); // Atualiza a lista de usuários
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Manutenção de Usuários
      </h1>

      {/* Mensagem de Feedback */}
      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

      {/* Criação de Usuário */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Usuário</h2>
        <form onSubmit={handleCriarUsuario} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome de Usuário</label>
            <input
              type="text"
              value={novoUsuario.username}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={novoUsuario.email}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={novoUsuario.password}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Criar Usuário
          </button>
        </form>
      </div>

      {/* Alteração de Senha */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
        <form onSubmit={handleAlterarSenha} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ID do Usuário</label>
            <input
              type="text"
              value={senhaAtualizada.userId}
              onChange={(e) =>
                setSenhaAtualizada({
                  ...senhaAtualizada,
                  userId: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nova Senha</label>
            <input
              type="password"
              value={senhaAtualizada.newPassword}
              onChange={(e) =>
                setSenhaAtualizada({
                  ...senhaAtualizada,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Alterar Senha
          </button>
        </form>
      </div>

      {/* Lista de Usuários */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nome de Usuário</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-gray-300">
                <td className="py-2 px-4">{usuario.id}</td>
                <td className="py-2 px-4">{usuario.username}</td>
                <td className="py-2 px-4">{usuario.email}</td>
                <td className="py-2 px-4">
                  {usuario.is_active ? "Ativo" : "Inativo"}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() =>
                      handleStatusUsuario(usuario.id, !usuario.is_active)
                    }
                    className={`px-3 py-1 rounded-md ${
                      usuario.is_active ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  >
                    {usuario.is_active ? "Desativar" : "Reativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
