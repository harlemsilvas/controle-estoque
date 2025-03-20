import React, { useState, useEffect, useCallback } from "react";
import { toastSuccess, toastError } from "../services/toast";
import {
  getMarcas,
  deleteMarca,
  createMarca,
  updateMarca,
} from "../services/api";
import ConfirmationModal from "../components/ConfirmationModal";
import MarcaForm from "../components/MarcaForm";
import Header from "../components/Header";
import MarcasTable from "../components/MarcasTable";

const MODES = {
  LIST: "list",
  CREATE: "create",
  EDIT: "edit",
};

const MarcaProdutoPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [mode, setMode] = useState(MODES.LIST);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filterMarcas = useCallback(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = marcas.filter((marca) =>
      marca.DESCRICAO.toLowerCase().includes(lowerQuery)
    );
    setFilteredMarcas(filtered);
  }, [searchQuery, marcas]); // Adicione as dependências aqui

  useEffect(() => {
    loadMarcas();
  }, []);

  useEffect(() => {
    filterMarcas();
  }, [filterMarcas]);

  // useEffect(() => {
  //   filterMarcas();
  // }, [searchQuery, marcas]);

  // const loadMarcas = async () => {
  //   try {
  //     const data = await getMarcas();
  //     if (!Array.isArray(data)) {
  //       throw new Error("Formato inválido de marcas recebido");
  //     }
  //     setMarcas(data);
  //   } catch (error) {
  //     toastError(`Erro ao carregar marcas: ${error.message}`);
  //   }
  // };

  // const filterMarcas = () => {
  //   const lowerQuery = searchQuery.toLowerCase();
  //   const filtered = marcas.filter((marca) =>
  //     marca.DESCRICAO.toLowerCase().includes(lowerQuery)
  //   );
  //   setFilteredMarcas(filtered);
  // };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const loadMarcas = async () => {
    try {
      const data = await getMarcas();
      if (!Array.isArray(data)) {
        throw new Error("Formato inválido de marcas recebido");
      }
      setMarcas(data);
    } catch (error) {
      toastError(`Erro ao carregar marcas: ${error.message}`);
    }
  };

  const handleSave = async (marcaData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!marcaData.DESCRICAO?.trim()) {
        throw new Error("A descrição da marca é obrigatória");
      }

      if (mode === MODES.CREATE) {
        await createMarca(marcaData);
        toastSuccess("Marca criada com sucesso!");
      } else {
        await updateMarca(selectedMarca.CODIGO, marcaData);
        toastSuccess("Marca atualizada com sucesso!");
      }

      setMode(MODES.LIST);
      loadMarcas();
    } catch (error) {
      toastError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!marcaToDelete) return;

      await deleteMarca(marcaToDelete);
      toastSuccess("Marca excluída com sucesso!");
      loadMarcas();
    } catch (error) {
      toastError(`Erro ao excluir marca: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setMarcaToDelete(null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        {mode === MODES.LIST ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Marcas de Produtos
              </h1>
              <button
                onClick={() => setMode(MODES.CREATE)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Criar nova marca"
              >
                Nova Marca
              </button>
            </div>

            {/* Campo de busca adicionado aqui */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Campo de busca por nome da marca"
              />
            </div>

            <MarcasTable
              marcas={filteredMarcas}
              onEdit={(marca) => {
                setSelectedMarca(marca);
                setMode(MODES.EDIT);
              }}
              onDelete={(codigo) => {
                setMarcaToDelete(codigo);
                setShowDeleteModal(true);
              }}
            />
          </div>
        ) : (
          <MarcaForm
            marca={mode === MODES.EDIT ? selectedMarca : null}
            onSave={handleSave}
            onCancel={() => setMode(MODES.LIST)}
            isSubmitting={isSubmitting}
          />
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta marca?"
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </div>
    </>
  );
};

export default MarcaProdutoPage;

// import React, { useState, useEffect } from "react";
// import { toastSuccess, toastError } from "../services/toast";
// import {
//   getMarcas,
//   deleteMarca,
//   createMarca,
//   updateMarca,
// } from "../services/api";
// import ConfirmationModal from "../components/ConfirmationModal";
// import MarcaForm from "../components/MarcaForm";
// import Header from "../components/Header";
// import MarcasTable from "../components/MarcasTable";

// const MODES = {
//   LIST: "list",
//   CREATE: "create",
//   EDIT: "edit",
// };

// const MarcaProdutoPage = () => {
//   const [marcas, setMarcas] = useState([]);
//   const [selectedMarca, setSelectedMarca] = useState(null);
//   const [mode, setMode] = useState(MODES.LIST);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [marcaToDelete, setMarcaToDelete] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     loadMarcas();
//   }, []);

//   const loadMarcas = async () => {
//     try {
//       const data = await getMarcas();
//       if (!Array.isArray(data)) {
//         throw new Error("Formato inválido de marcas recebido");
//       }
//       setMarcas(data);
//     } catch (error) {
//       toastError(`Erro ao carregar marcas: ${error.message}`);
//     }
//   };

//   const handleSave = async (marcaData) => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     try {
//       if (!marcaData.DESCRICAO?.trim()) {
//         throw new Error("A descrição da marca é obrigatória");
//       }

//       if (mode === MODES.CREATE) {
//         await createMarca(marcaData);
//         toastSuccess("Marca criada com sucesso!");
//       } else {
//         await updateMarca(selectedMarca.CODIGO, marcaData);
//         toastSuccess("Marca atualizada com sucesso!");
//       }

//       setMode(MODES.LIST);
//       loadMarcas();
//     } catch (error) {
//       toastError(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       if (!marcaToDelete) return;

//       await deleteMarca(marcaToDelete);
//       toastSuccess("Marca excluída com sucesso!");
//       loadMarcas();
//     } catch (error) {
//       toastError(`Erro ao excluir marca: ${error.message}`);
//     } finally {
//       setShowDeleteModal(false);
//       setMarcaToDelete(null);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gray-50 p-6">
//         {mode === MODES.LIST ? (
//           <div className="max-w-4xl mx-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl font-bold text-gray-800">
//                 Marcas de Produtos
//               </h1>
//               <button
//                 onClick={() => setMode(MODES.CREATE)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 aria-label="Criar nova marca"
//               >
//                 Nova Marca
//               </button>
//             </div>

//             <MarcasTable
//               marcas={marcas}
//               onEdit={(marca) => {
//                 setSelectedMarca(marca);
//                 setMode(MODES.EDIT);
//               }}
//               onDelete={(codigo) => {
//                 setMarcaToDelete(codigo);
//                 setShowDeleteModal(true);
//               }}
//             />
//           </div>
//         ) : (
//           <MarcaForm
//             marca={mode === MODES.EDIT ? selectedMarca : null}
//             onSave={handleSave}
//             onCancel={() => setMode(MODES.LIST)}
//             isSubmitting={isSubmitting}
//           />
//         )}

//         <ConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onConfirm={handleDeleteConfirm}
//           title="Confirmar Exclusão"
//           message="Tem certeza que deseja excluir esta marca?"
//           confirmText="Excluir"
//           cancelText="Cancelar"
//         />
//       </div>
//     </>
//   );
// };

// export default MarcaProdutoPage;
