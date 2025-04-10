// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recupera os dados do usuário do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <h1>Painel do Usuário</h1>
      {user ? (
        <p>Usuário Logado: {user.name}</p>
      ) : (
        <p>Usuário Logado: Não identificado</p>
      )}
    </div>
  );
};

export default AdminDashboard;
