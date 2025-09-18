// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Recupera os dados do usuário do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Finaliza o carregamento
  }, []);

  // Função para login
  const login = async (userData, token) => {
    setUser(userData); // Atualiza o estado do usuário
    localStorage.setItem("user", JSON.stringify(userData)); // Salva no localStorage
    localStorage.setItem("token", token); // Salva o token no localStorage
  };

  // Função para logout
  const logout = () => {
    setUser(null); // Limpa o estado do usuário
    localStorage.removeItem("user"); // Remove do localStorage
    localStorage.removeItem("token"); // Remove o token do localStorage
  };

  // Função para validar o token (exemplo básico)
  const validateToken = (token) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o token
      const isExpired = payload.exp * 1000 < Date.now(); // Verifica se o token expirou
      return !isExpired; // Retorna true se o token for válido
    } catch (err) {
      console.error("Erro ao validar token:", err);
      return false;
    }
  };

  // Verifica se há um usuário salvo ao carregar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      // Valida o token antes de definir o usuário
      if (validateToken(storedToken)) {
        setUser(parsedUser);
      } else {
        logout(); // Se o token for inválido, faz logout
      }
    }

    setLoading(false); // Finaliza o carregamento
  }, []);

  // Valida se o usuário está autenticado
  const isAuthenticated = !!user;

  if (loading) {
    return <div>Carregando...</div>; // Exibe um indicador de carregamento
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
