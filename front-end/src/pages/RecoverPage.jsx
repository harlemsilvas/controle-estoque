import React, { useState } from "react";
import { toast } from "react-toastify";

const RecoverPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Erro ao solicitar redefinição.");
      }
    } catch (error) {
      toast.error("Erro ao processar a solicitação.");
    }
  };

  return (
    <div className="form-container">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar Link de Recuperação</button>
      </form>
    </div>
  );
};

export default RecoverPage;
