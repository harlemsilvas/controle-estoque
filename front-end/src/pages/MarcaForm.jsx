import React, { useState } from "react";
import { createMarca } from "../services/api";
import { toastSuccess, toastError } from "../services/toast";

const MarcaForm = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState({
    CODIGO: initialData?.CODIGO || "",
    DESCRICAO: initialData?.DESCRICAO || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMarca({ DESCRICAO: form.DESCRICAO }); // Envia apenas DESCRICAO
      toastSuccess("Marca cadastrada com sucesso!");
      onSave();
    } catch (error) {
      toastError(error.message || "Erro ao salvar marca");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Nova Marca</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição **
          </label>
          <input
            type="text"
            value={form.DESCRICAO}
            onChange={(e) => setForm({ DESCRICAO: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarcaForm;
