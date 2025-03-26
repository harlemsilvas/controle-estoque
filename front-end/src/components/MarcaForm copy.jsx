// // src/components/MarcaForm.jsx
import React, { useState, useEffect } from "react";
import { createMarca, updateMarca } from "../services/api";
import { toastSuccess, toastError } from "../services/toast";

const MarcaForm = ({ marca, onSave, onCancel, isEditing, initialData }) => {
  const [form, setForm] = useState({
    CODIGO: initialData?.CODIGO || "",
    DESCRICAO: initialData?.DESCRICAO || "",
  });
  const [loadingCodigo, setLoadingCodigo] = useState(!isEditing); // Só carrega código em modo novo

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMarca(form.CODIGO, { DESCRICAO: form.DESCRICAO });
        toastSuccess("Marca atualizada com sucesso!");
      } else {
        await createMarca({ DESCRICAO: form.DESCRICAO });
        toastSuccess("Marca cadastrada com sucesso!");
      }
      onSave();
    } catch (error) {
      toastError(error.message || "Erro ao salvar marca");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Editar Marca" : "Nova Marca"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo CÓDIGO (visível apenas em edição ou após carregamento) */}
        {(isEditing || form.CODIGO) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <input
              type="text"
              value={loadingCodigo ? "Carregando..." : form.CODIGO}
              readOnly
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
            />
          </div>
        )}

        {/* Campo DESCRICAO */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição *
          </label>
          <input
            type="text"
            value={form.DESCRICAO}
            onChange={(e) => setForm({ ...form, DESCRICAO: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Botões */}
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
            {isEditing ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarcaForm;

// import React, { useState, useEffect } from "react";

// const MarcaForm = ({ marca, onSave, onCancel }) => {
//   const [formData, setFormData] = useState({
//     CODIGO: "",
//     DESCRICAO: "",
//   });

//   useEffect(() => {
//     if (marca) setFormData(marca);
//   }, [marca]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">
//           {marca ? "Editar Marca" : "Nova Marca"}
//         </h2>
//         <button
//           onClick={onCancel}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           Voltar para lista
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Código
//             </label>
//             <input
//               type="number"
//               name="CODIGO"
//               value={formData.CODIGO}
//               onChange={(e) =>
//                 setFormData({ ...formData, CODIGO: e.target.value })
//               }
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               required
//               disabled={!!marca}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Descrição *
//             </label>
//             <input
//               type="text"
//               name="DESCRICAO"
//               value={formData.DESCRICAO}
//               onChange={(e) =>
//                 setFormData({ ...formData, DESCRICAO: e.target.value })
//               }
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               required
//             />
//           </div>

//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 border rounded-md hover:bg-gray-50"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Salvar
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MarcaForm;
