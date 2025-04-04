import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.error || "Erro ao redefinir senha.");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao processar a solicitação.");
    }
  };

  return (
    <div className="form-container">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">Nova Senha</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Redefinir Senha</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
