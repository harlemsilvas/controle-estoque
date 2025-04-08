// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o usuário logado
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para login
  const login = async (userData) => {
    setUser(userData); // Atualiza o estado do usuário
    localStorage.setItem("user", JSON.stringify(userData)); // Salva no localStorage
  };

  // Função para logout
  const logout = () => {
    setUser(null); // Limpa o estado do usuário
    localStorage.removeItem("user"); // Remove do localStorage
  };

  // Verifica se há um usuário salvo ao carregar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Valida se o usuário está autenticado
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {!loading && children} {/* Renderiza os filhos após o carregamento */}
    </AuthContext.Provider>
  );
};
