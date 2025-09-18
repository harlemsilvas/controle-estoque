import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // URL do backend
  headers: { "Content-Type": "application/json" },
});

// const api = axios.create({
//   baseURL: "http://localhost:3000", // URL do back-end
// });

// Função para obter totais
export const getTotais = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado.");

    const response = await api.get("/totais", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar totais.");
  }
};
// export const getTotais = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await api.get("/totais", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Erro ao buscar totais.");
//   }
// };

// Função para obter totais
// export const getTotais = async () => {
//   try {
//     const response = await api.get("/totais");
//     return response.data;
//   } catch (error) {
//     throw new Error("Erro ao buscar totais.");
//   }
// };

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
  return response.data;
};

export const getMarca = async (codigoMarca) => {
  const response = await api.get(`/marca/${codigoMarca}`);
  return response.data[0];
};

export const getmarca = async (codigomarca) => {
  const response = await api.get(`/marca/${codigomarca}`);
  return response.data[0];
};

export const getFamilia = async (codigoFamilia) => {
  const response = await api.get(`/familia/${codigoFamilia}`);
  return response.data[0];
};

export const getFamilias = async () => {
  const response = await api.get("/familia");
  return response.data;
};

export const getMarcas = async () => {
  const response = await api.get("/marca");
  return response.data;
};

// export const getmarcas = async () => {
//   const response = await api.get("/marca");
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

export const createMarca = async (marca) => {
  try {
    await api.post("/marca", marca);
  } catch (error) {
    throw new Error(error.response?.data || "Erro ao criar marca");
  }
  // return response.data;
};

export const updateMarca = async (id, marca) => {
  const response = await api.put(`/marca/${id}`, marca);
  return response.data;
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

export const getAlertas = async () => {
  const response = await api.get("/alertas");
  return response.data;
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

//Fornecedores
export const getFornecedor = async () => {
  const response = await api.get("/fornecedor");
  return response.data;
};

export const createFornecedor = async (fornecedor) => {
  const response = await api.post("/fornecedor", fornecedor);
  return response.data;
};

export const updateFornecedor = async (codigo, fornecedor) => {
  const response = await api.put(`/fornecedor/${codigo}`, fornecedor);
  return response.data;
};

export const deleteFornecedor = async (codigo) => {
  const response = await api.delete(`/fornecedor/${codigo}`);
  return response.data;
};

export const getProdutoAggregate = async () => {
  try {
    const response = await api.get("/produto-aggregate");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Erro na busca de produtos/marcas"
    );
  }
};

export const updateFamilia = async (codigo, familia) => {
  const response = await api.put(`/familia/${codigo}`, familia);
  return response.data;
};
// Compatibilidade: getEstoqueData (usado no Dashboard)
export const getEstoqueData = async () => {
  return getEstoque();
};

export const getAlertasHistorico = async () => {
  const response = await api.get("/alertas/historico");
  return response.data;
};
export const deleteMarca = async (codigo) => {
  const response = await api.delete(`/marca/${codigo}`);
  return response.data;
};
export const deleteFamilia = async (codigo) => {
  const response = await api.delete(`/familia/${codigo}`);
  return response.data;
};
export const createFamilia = async (familia) => {
  const response = await api.post("/familia", familia);
  return response.data;
};

// Movimentação por código do produto
export const movimentarEstoquePorCodigo = async ({
  codigoProduto,
  tipo,
  quantidade,
  usuario,
}) => {
  const response = await api.post("/estoque/movimentar", {
    codigoProduto,
    tipo,
    quantidade,
    usuario,
  });
  return response.data;
};

// Movimentação por código de barras
export const movimentarEstoquePorBarcode = async ({
  codigo_barras,
  tipo,
  quantidade,
  usuario,
}) => {
  const response = await api.post("/estoque/movimentacao", {
    codigo_barras,
    tipo,
    quantidade,
    usuario,
  });
  return response.data;
};
