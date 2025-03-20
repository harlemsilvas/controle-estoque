// src/components/FamiliaForm.jsx
import React, { useState, useEffect } from "react";

const FamiliaForm = ({ familia, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    CODIGO: "",
    DESCRICAO: "",
  });

  useEffect(() => {
    if (familia) {
      setFormData(familia);
    }
  }, [familia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {familia ? "Editar Família" : "Nova Família"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Voltar para lista
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <input
              type="number"
              name="CODIGO"
              value={formData.CODIGO}
              onChange={(e) =>
                setFormData({ ...formData, CODIGO: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
              disabled={!!familia}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição *
            </label>
            <input
              type="text"
              name="DESCRICAO"
              value={formData.DESCRICAO}
              onChange={(e) =>
                setFormData({ ...formData, DESCRICAO: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
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
        </div>
      </form>
    </div>
  );
};

export default FamiliaForm;
