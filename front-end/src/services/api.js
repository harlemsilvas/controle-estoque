import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // URL do back-end
});

export const getProdutos = async () => {
  const response = await api.get("/produto");
  return response.data;
};

export const getEstoque = async () => {
  const response = await api.get("/estoque-produto");
  return response.data;
};

// Adicione outras funções conforme necessário
export const getProdutoById = async (id) => {
  const response = await api.get(`/produto/${id}`);
  return response.data[0]; // Supondo que a rota retorne um array
};

export const getMarca = async (codigoMarca) => {
  const response = await api.get(`/marca-produto/${codigoMarca}`);
  return response.data[0];
};

export const getmarca = async (codigomarca) => {
  const response = await api.get(`/marca-produto/${codigomarca}`);
  return response.data[0];
};

export const getFamilia = async (codigoFamilia) => {
  const response = await api.get(`/familia-produto/${codigoFamilia}`);
  return response.data[0];
};

// export const getMarcas = async () => {
//   const response = await api.get("/marca-produto");
//   return response.data;
// };

// export const getmarcas = async () => {
//   const response = await api.get("/marca-produto");
//   return response.data;
// };

export const createProduto = async (produto) => {
  const response = await api.post("/produto", produto);
  return response.data;
};

export const updateProduto = async (id, produto) => {
  const response = await api.put(`/produto/${id}`, produto);
  return response.data;
};

export const deleteProduto = async (id) => {
  const response = await api.delete(`/produto/${id}`);
  return response.data;
};

// src/services/api.js
export const getEstoqueData = async () => {
  const response = await api.get("/produto/estoque");
  return response.data;
};

export const getProdutoAggregate = async () => {
  const response = await api.get("/produto/aggregate");
  return response.data;
};

export const getAlertasHistorico = async () => {
  const response = await api.get("/alertas/historico");
  return response.data;
};

export const getAlertas = async () => {
  const response = await api.get("/alertas");
  return response.data;
};

// Funcoes para Familias
export const getFamilias = async () => {
  const response = await api.get("/familia-produto");
  return response.data;
};

export const createFamilia = async (familia) => {
  const response = await api.post("/familia-produto", familia);
  return response.data;
};

export const updateFamilia = async (id, familia) => {
  const response = await api.put(`/familia-produto/${id}`, familia);
  return response.data;
};

export const deleteFamilia = async (id) => {
  const response = await api.delete(`/familia-produto/${id}`);
  return response.data;
};
// fim Funções Familia

// Funcoes para marcas
export const getmarcas = async () => {
  const response = await api.get("/marca-produto");
  return response.data;
};

// export const createmarca = async (marca) => {
//   try {
//     await api.post("/marca-produto", marca);
//   } catch (error) {
//     throw new Error(error.response?.data || "Erro ao criar marca");
//   }
//   // return response.data;
// };

// export const updatemarca = async (id, marca) => {
//   const response = await api.put(`/marca-produto/${id}`, marca);
//   return response.data;
// };

// export const deletemarca = async (id) => {
//   const response = await api.delete(`/marca-produto/${id}`);
//   return response.data;
// };
// fim Funções marca

//Marcas
export const getMarcas = async () => {
  try {
    const response = await api.get("/marca-produto");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Erro ao buscar marcas");
  }
};

export const deleteMarca = async (id) => {
  try {
    await api.delete(`/marca-produto/${id}`);
  } catch (error) {
    throw new Error(error.response?.data || "Erro ao excluir marca");
  }
};

// Buscar último código
export const getUltimoCodigoMarca = async () => {
  const response = await api.get("/marca/ultimo-codigo");
  return response.data;
};

// Criar marca
// export const createMarca = async (data) => {
//   const response = await api.post("/marca", data);
//   return response.data;
// };

// // Atualizar marca
// export const updateMarca = async (codigo, data) => {
//   const response = await api.put(`/marca/${codigo}`, data);
//   return response.data;
// };

export const createMarca = async (marca) => {
  try {
    await api.post("/marca-produto", marca);
  } catch (error) {
    throw new Error(error.response?.data || "Erro ao criar marca");
  }
  // return response.data;
};

export const updateMarca = async (id, marca) => {
  const response = await api.put(`/marca-produto/${id}`, marca);
  return response.data;
};

// Totais da pagina principal
export const getTotais = async () => {
  try {
    const response = await api.get("/totais");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Erro ao carregar estatísticas"
    );
  }
};

export const getProdutosLixeira = async () => {
  const response = await api.get("/produtos/lixeira");
  return response.data;
};

export const restaurarProduto = async (id) => {
  const response = await api.post(`/produtos/restaurar/${id}`);
  return response.data;
};

export const excluirPermanentemente = async (id) => {
  const response = await api.delete(`/produtos/lixeira/${id}`);
  return response.data;
};

export const getLixeiraCount = async () => {
  try {
    const response = await api.get("/produto/lixeira/count");
    return response.data.count;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar contagem da lixeira"
    );
  }
};

// Alertas
export const resolveAlerta = async (id) => {
  try {
    await api.post(`/alertas/resolver/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao resolver alerta");
  }
};

// export const getEstoqueTemp = async () => {
//   const response = await api.get("/estoque/temp");
//   return response.data;
// };

export const addItemTemp = async (item) => {
  const response = await api.post("/estoque/temp", item);
  return response.data;
};

export const processarLoteEstoque = async () => {
  const response = await api.post("/estoque/processar");
  return response.data;
};

export const getEstoqueTemp = async () => {
  try {
    const response = await api.get("/estoque/temp");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.details || "Erro desconhecido");
  }
};

export const getProdutoPorBarcode = async (barcode) => {
  const response = await api.get(`/produto/barcode/${barcode}`);
  return response.data;
};

export const getHistoricoEstoque = async (barcode) => {
  const response = await api.get(`/estoque/historico/${barcode}`);
  return response.data;
};

// export const registrarMovimentacao = async (data) => {
//   const response = await api.post("/estoque/movimentacao", data);
//   return response.data;
// };

// export const buscarProdutos = async (termo) => {
//   const response = await api.get(`/produtos/busca/${termo}`, {
//     params: { termo },
//   });
//   return response.data;
// };

// services/api.js
export const buscarProdutos = async (termo) => {
  try {
    const response = await api.get("/produtos/busca", {
      params: {
        termo: termo || "", // Parâmetro deve ser "termo", não "search"
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Erro na busca");
  }
};

export const registrarMovimentacao = async (data) => {
  const response = await api.post("/estoque/movimentar", data);
  return response.data;
};
