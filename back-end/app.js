const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const port = 3000;

app.use(cors());
//app.use(express.json());

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuração da conexão com o SQL Server
const config = {
  user: "sa",
  password: "xlaver",
  server: "localhost", // Pode ser um endereço IP ou nome do servidor
  database: "HRM",
  options: {
    encrypt: true, // Para conexões seguras
    trustServerCertificate: true, // Se estiver usando um certificado autoassinado
  },
};

// Conectar ao banco de dados
sql
  .connect(config)
  .then(() => {
    console.log("Conectado ao SQL Server");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao SQL Server:", err);
  });

// Rotas para a tabela ESTOQUE_PRODUTO
app.get("/estoque-produto", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM ESTOQUE_PRODUTO`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar dados");
  }
});

app.post("/estoque-produto", async (req, res) => {
  try {
    const {
      CODIGO,
      CODIGO_PRODUTO,
      TIPO_LANCAMENTO,
      QUANTIDADE,
      DATA,
      TAG,
      USUARIO,
    } = req.body;
    const result =
      await sql.query`INSERT INTO ESTOQUE_PRODUTO (CODIGO, CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, DATA, TAG, USUARIO) VALUES (${CODIGO}, ${CODIGO_PRODUTO}, ${TIPO_LANCAMENTO}, ${QUANTIDADE}, ${DATA}, ${TAG}, ${USUARIO})`;
    res.status(201).send("Registro inserido com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao inserir dados");
  }
});

// Rotas para a tabela FAMILIA_PRODUTO
app.get("/familia-produto", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM FAMILIA_PRODUTO ORDER BY DESCRICAO`; // INSERIDO ORDER BY
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar dados");
  }
});

app.post("/familia-produto", async (req, res) => {
  try {
    const { CODIGO, DESCRICAO } = req.body;
    const result =
      // await sql.query`INSERT INTO FAMILIA_PRODUTO (CODIGO, DESCRICAO) VALUES (${CODIGO}, ${DESCRICAO})`;
      await sql.query`INSERT INTO FAMILIA_PRODUTO (DESCRICAO) VALUES (${DESCRICAO})`;
    res.status(201).send("Registro inserido com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao cadastrar Família");
  }
});

// Rotas para a tabela MARCA_PRODUTO
app.get("/marca-produto", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM MARCA_PRODUTO ORDER BY DESCRICAO`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar Marcas");
  }
});

app.post("/marca-produto", async (req, res) => {
  try {
    const { CODIGO, DESCRICAO } = req.body;
    const result =
      await sql.query`INSERT INTO MARCA_PRODUTO (DESCRICAO) VALUES (${DESCRICAO})`;
    // await sql.query`INSERT INTO MARCA_PRODUTO (CODIGO, DESCRICAO) VALUES (${CODIGO}, ${DESCRICAO})`;
    res.status(201).send("Registro inserido com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao inserir Marca");
  }
});

// Rotas para a tabela PRODUTO
app.get("/produto", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM PRODUTO`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar produtos");
  }
});

app.post("/produto", async (req, res) => {
  try {
    const {
      CODIGO,
      CODIGO_INTERNO,
      DESCRICAO,
      CODIGO_BARRAS,
      ESTOQUE_MINIMO,
      ESTOQUE_ATUAL,
      CODIGO_MARCA,
      CODIGO_FAMILIA,
    } = req.body;
    const result =
      await sql.query`INSERT INTO PRODUTO (CODIGO, CODIGO_INTERNO, DESCRICAO, CODIGO_BARRAS, ESTOQUE_MINIMO, ESTOQUE_ATUAL, CODIGO_MARCA, CODIGO_FAMILIA) VALUES (${CODIGO}, ${CODIGO_INTERNO}, ${DESCRICAO}, ${CODIGO_BARRAS}, ${ESTOQUE_MINIMO}, ${ESTOQUE_ATUAL}, ${CODIGO_MARCA}, ${CODIGO_FAMILIA})`;
    res.status(201).send("Registro inserido com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao inserir Produto");
  }
});

// Rota para buscar produto por ID
app.get("/produto/:id", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM PRODUTO WHERE CODIGO = ${req.params.id}`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar produto");
  }
});

// Rota para buscar marca por ID
app.get("/marca-produto/:id", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM MARCA_PRODUTO WHERE CODIGO = ${req.params.id}`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar marca");
  }
});

// Rota para buscar família por ID
app.get("/familia-produto/:id", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM FAMILIA_PRODUTO WHERE CODIGO = ${req.params.id}`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar família");
  }
});

// Rota PUT para atualizar produto
app.put("/produto/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      CODIGO_INTERNO,
      DESCRICAO,
      CODIGO_BARRAS,
      ESTOQUE_MINIMO,
      ESTOQUE_ATUAL,
      CODIGO_MARCA,
      CODIGO_FAMILIA,
    } = req.body;

    // 1. Atualizar o produto
    await sql.query`UPDATE PRODUTO SET 
      CODIGO_INTERNO = ${CODIGO_INTERNO},
      DESCRICAO = ${DESCRICAO},
      CODIGO_BARRAS = ${CODIGO_BARRAS},
      ESTOQUE_MINIMO = ${ESTOQUE_MINIMO},
      ESTOQUE_ATUAL = ${ESTOQUE_ATUAL},
      CODIGO_MARCA = ${CODIGO_MARCA},
      CODIGO_FAMILIA = ${CODIGO_FAMILIA}
      WHERE CODIGO = ${id}`;

    // 2. Gerenciar alertas de estoque
    if (ESTOQUE_ATUAL < ESTOQUE_MINIMO) {
      await sql.query`
        MERGE INTO ALERTAS_ESTOQUE AS target
        USING (VALUES (${id})) AS source (CODIGO_PRODUTO)
        ON target.CODIGO_PRODUTO = source.CODIGO_PRODUTO AND target.STATUS = 'ativo'
        WHEN NOT MATCHED THEN
          INSERT (CODIGO_PRODUTO, TIPO_ALERTA, STATUS, DATA_CRIACAO)
          VALUES (${id}, 'estoque_minimo', 'ativo', GETDATE());`;
    } else {
      await sql.query`
        UPDATE ALERTAS_ESTOQUE 
        SET STATUS = 'resolvido', 
            DATA_RESOLUCAO = GETDATE(),
            USUARIO_NOTIFICADO = SYSTEM_USER
        WHERE CODIGO_PRODUTO = ${id} AND STATUS = 'ativo'`;
    }

    res.send("Produto atualizado com sucesso");
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    res.status(500).send("Erro ao atualizar produto");
  }
});
// app.put("/produto/:id", async (req, res) => {
//   try {
//     const {
//       CODIGO_INTERNO,
//       DESCRICAO,
//       CODIGO_BARRAS,
//       ESTOQUE_MINIMO,
//       ESTOQUE_ATUAL,
//       CODIGO_MARCA,
//       CODIGO_FAMILIA,
//     } = req.body;
//     await sql.query`UPDATE PRODUTO SET
//       CODIGO_INTERNO = ${CODIGO_INTERNO},
//       DESCRICAO = ${DESCRICAO},
//       CODIGO_BARRAS = ${CODIGO_BARRAS},
//       ESTOQUE_MINIMO = ${ESTOQUE_MINIMO},
//       ESTOQUE_ATUAL = ${ESTOQUE_ATUAL},
//       CODIGO_MARCA = ${CODIGO_MARCA},
//       CODIGO_FAMILIA = ${CODIGO_FAMILIA}
//       WHERE CODIGO = ${req.params.id}`;
//     res.send("Produto atualizado com sucesso");
//   } catch (err) {
//     res.status(500).send("Erro ao atualizar produto");
//   }
//   try {
//     const {
//       CODIGO_INTERNO,
//       DESCRICAO,
//       CODIGO_BARRAS,
//       ESTOQUE_MINIMO,
//       ESTOQUE_ATUAL,
//       CODIGO_MARCA,
//       CODIGO_FAMILIA,
//     } = req.body;
//     // --
//     // Verificar e criar alerta
//     if (estoqueAtual < estoqueMinimo) {
//       await sql.query`
//         IF NOT EXISTS (
//           SELECT 1 FROM ALERTAS_ESTOQUE
//           WHERE CODIGO_PRODUTO = ${id} AND STATUS = 'ativo'
//         )
//         INSERT INTO ALERTAS_ESTOQUE
//           (CODIGO_PRODUTO, TIPO_ALERTA, STATUS, DATA_CRIACAO)
//         VALUES
//           (${id}, 'estoque_minimo', 'ativo', GETDATE())
//       `;
//     } else {
//       await sql.query`
//         UPDATE ALERTAS_ESTOQUE
//         SET STATUS = 'resolvido', DATA_RESOLUCAO = GETDATE()
//         WHERE CODIGO_PRODUTO = ${id} AND STATUS = 'ativo'
//       `;
//     }
//     // --
//     res.send("Produto atualizado com sucesso");
//   } catch (err) {
//     res.status(500).send("Erro ao atualizar produto");
//   }
// });

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// rota-exclusao
app.delete("/produto/:id", async (req, res) => {
  try {
    await sql.query`DELETE FROM PRODUTO WHERE CODIGO = ${req.params.id}`;
    res.send("Produto excluído com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao excluir produto");
  }
});

// back-end/app.js

// Rota para dados de estoque
app.get("/produto/estoque", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        CODIGO,
        DESCRICAO,
        ESTOQUE_ATUAL,
        ESTOQUE_MINIMO 
      FROM PRODUTO
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar dados de estoque");
  }
});

// Rota para dados agregados
app.get("/produto/aggregate", async (req, res) => {
  try {
    const byFamily = await sql.query`
      SELECT 
        f.DESCRICAO AS FAMILIA,
        SUM(p.ESTOQUE_ATUAL) AS total
      FROM PRODUTO p
      INNER JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
      GROUP BY f.DESCRICAO
    `;

    const byMarca = await sql.query`
      SELECT 
        m.DESCRICAO AS MARCA,
        SUM(p.ESTOQUE_ATUAL) AS total
      FROM PRODUTO p
      INNER JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
      GROUP BY m.DESCRICAO
    `;

    res.json({
      byFamily: byFamily.recordset,
      byMarca: byMarca.recordset,
    });
  } catch (err) {
    res.status(500).send("Erro ao buscar dados agregados");
  }
});

// Rotas para alertas
app.get("/alertas", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        a.*,
        p.DESCRICAO as PRODUTO_DESCRICAO,
        p.ESTOQUE_ATUAL,
        p.ESTOQUE_MINIMO
      FROM ALERTAS_ESTOQUE a
      INNER JOIN PRODUTO p ON a.CODIGO_PRODUTO = p.CODIGO
      WHERE a.STATUS = 'ativo'
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar alertas");
  }
});

app.post("/alertas/resolver/:id", async (req, res) => {
  try {
    await sql.query`
      UPDATE ALERTAS_ESTOQUE 
      SET 
        STATUS = 'resolvido',
        DATA_RESOLUCAO = GETDATE(),
        USUARIO_NOTIFICADO = ${req.body.usuario}
      WHERE ID = ${req.params.id}
    `;
    res.send("Alerta resolvido com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao resolver alerta");
  }
});

// Rota para histórico completo de alertas
app.get("/alertas/historico", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        a.*,
        p.DESCRICAO as PRODUTO_DESCRICAO,
        p.ESTOQUE_ATUAL,
        p.ESTOQUE_MINIMO
      FROM ALERTAS_ESTOQUE a
      INNER JOIN PRODUTO p ON a.CODIGO_PRODUTO = p.CODIGO
      ORDER BY a.DATA_CRIACAO DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar histórico de alertas");
  }
});

// Rotas Familia
app.get("/familia-produto", async (req, res) => {
  try {
    const result =
      await sql.query`SELECT * FROM FAMILIA_PRODUTO ORDER BY DESCRICAO`; //ALTERACAO ORDER BY
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar famílias");
  }
});

// app.post("/familia-produto", async (req, res) => {
//   try {
//     const { CODIGO, DESCRICAO } = req.body;
//     await sql.query`INSERT INTO FAMILIA_PRODUTO (CODIGO, DESCRICAO) VALUES (${CODIGO}, ${DESCRICAO})`;
//     res.send("Família criada com sucesso");
//   } catch (err) {
//     res.status(500).send("Erro ao criar família");
//   }
// });

app.post("/familia-produto", async (req, res) => {
  try {
    const { DESCRICAO } = req.body;

    await sql.query`
      INSERT INTO FAMILIA_PRODUTO (DESCRICAO)
      VALUES (${DESCRICAO})
    `;

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar família" });
  }
});

app.put("/familia-produto/:id", async (req, res) => {
  try {
    const { DESCRICAO } = req.body;
    await sql.query`UPDATE FAMILIA_PRODUTO SET DESCRICAO = ${DESCRICAO} WHERE CODIGO = ${req.params.id}`;
    res.send("Família atualizada com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao atualizar família");
  }
});

app.delete("/familia-produto/:id", async (req, res) => {
  try {
    await sql.query`DELETE FROM FAMILIA_PRODUTO WHERE CODIGO = ${req.params.id}`;
    res.send("Família excluída com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao excluir família");
  }
});

// Rota GET (Listar todas)
app.get("/marca-produto", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM MARCA_PRODUTO`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar marcas");
  }
});

// Rota POST (Criar)
app.post("/marca-produto", async (req, res) => {
  try {
    const { DESCRICAO } = req.body;
    await sql.query`
      INSERT INTO MARCA_PRODUTO (DESCRICAO)
      VALUES (${DESCRICAO})
      `;
    res.status(201).send("Marca criada com sucesso");
  } catch (err) {
    res
      .status(500)
      .send(err.number === 2627 ? "Código já existe" : "Erro ao criar marca");
  }
});
// INSERT INTO MARCA_PRODUTO (CODIGO, DESCRICAO)
// VALUES (${CODIGO}, ${DESCRICAO})

// Rota PUT (Atualizar)
app.put("/marca-produto/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { DESCRICAO } = req.body;

    await sql.query`
      UPDATE MARCA_PRODUTO
      SET DESCRICAO = ${DESCRICAO}
      WHERE CODIGO = ${id}
    `;

    res.send("Marca atualizada com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao atualizar marca");
  }
});

// Rota DELETE (Excluir)
app.delete("/marca-produto/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await sql.query`
      DELETE FROM MARCA_PRODUTO 
      WHERE CODIGO = ${id}
    `;

    res.send("Marca excluída com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao excluir marca");
  }
});

// Nova Rota para Totais
app.get("/totais", async (req, res) => {
  try {
    const produtos = await sql.query`SELECT COUNT(*) AS total FROM PRODUTO`;
    const movimentacoes =
      await sql.query`SELECT COUNT(*) AS total FROM ESTOQUE_PRODUTO`;
    const marcas = await sql.query`SELECT COUNT(*) AS total FROM MARCA_PRODUTO`;
    const familias =
      await sql.query`SELECT COUNT(*) AS total FROM FAMILIA_PRODUTO`;

    res.json({
      produtos: produtos.recordset[0].total,
      marcas: marcas.recordset[0].total,
      familias: familias.recordset[0].total,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar totais" });
  }
});

// Rota GET /produto (exclui os deletados)
app.get("/produto", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM PRODUTO
      WHERE DELETADO_EM IS NULL
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar produtos");
  }
});

// Rota DELETE (soft delete)
app.delete("/produto/:id", async (req, res) => {
  try {
    await sql.query`
      UPDATE PRODUTO
      SET DELETADO_EM = GETDATE()
      WHERE CODIGO = ${req.params.id}
    `;
    res.send("Produto marcado como excluído");
  } catch (err) {
    res.status(500).send("Erro ao excluir produto");
  }
});

// Rota POST para restaurar
app.post("/produtos/restaurar/:id", async (req, res) => {
  try {
    await sql.query`
      UPDATE PRODUTO
      SET DELETADO_EM = NULL
      WHERE CODIGO = ${req.params.id}
    `;
    res.send("Produto restaurado com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao restaurar produto");
  }
});

// Rota GET para lixeira
app.get("/produtos/lixeira", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM PRODUTO
      WHERE DELETADO_EM IS NOT NULL
      ORDER BY DELETADO_EM DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Erro ao buscar lixeira");
  }
});

// Nova Rota para Contagem
app.get("/produto/lixeira/count", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT COUNT(*) AS total FROM PRODUTO
      WHERE DELETADO_EM IS NOT NULL
    `;
    res.json({ count: result.recordset[0].total });
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar produtos deletados" });
  }
});

// Rota DELETE permanente
app.delete("/produtos/lixeira/:id", async (req, res) => {
  try {
    await sql.query`
      DELETE FROM PRODUTO
      WHERE CODIGO = ${req.params.id}
      AND DELETADO_EM IS NOT NULL
    `;
    res.send("Produto excluído permanentemente");
  } catch (err) {
    res.status(500).send("Erro ao excluir permanentemente");
  }
});

// Rota para resolver alerta
app.post("/alertas/resolver/:id", async (req, res) => {
  try {
    await sql.query`
      UPDATE ALERTAS_ESTOQUE
      SET STATUS = 'resolvido', 
          DATA_RESOLUCAO = GETDATE(),
          USUARIO_NOTIFICADO = SYSTEM_USER
      WHERE ID = ${req.params.id}
    `;
    res.json({ message: "Alerta resolvido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao resolver alerta" });
  }
});

//
// Back-end - variação percentual em relação ao último mês
// app.get('/totais', async (req, res) => {
//   try {
//     // ... consultas existentes
//     const produtosMesPassado = await sql.query`
//       SELECT COUNT(*) AS total FROM PRODUTO
//       WHERE DATA_CADASTRO >= DATEADD(MONTH, -1, GETDATE())
//     `;

//     res.json({
//       // ... dados existentes
//       variacaoProdutos: ((produtos - produtosMesPassado.recordset[0].total) / produtosMesPassado.recordset[0].total) * 100
//     });
//   } catch (err) {
//     // ...
//   }
// });

// Rota GET - Listar itens temporários
// app.get("/estoque/temp", async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT t.*, p.DESCRICAO
//       FROM ESTOQUE_PRODUTO_TMP t
//       INNER JOIN PRODUTO p ON t.CODIGO_PRODUTO = p.CODIGO
//     `;
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send("Erro ao buscar lançamentos temporários");
//   }
// });

app.get("/estoque/temp", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        t.*, 
        p.DESCRICAO 
      FROM ESTOQUE_PRODUTO_TMP t
      INNER JOIN PRODUTO p ON t.CODIGO_PRODUTO = p.CODIGO
    `;

    console.log("Query executada com sucesso:", result);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro na query:", err.message); // Log detalhado
    res.status(500).json({
      error: "Erro ao buscar lançamentos temporários",
      details: err.message, // Envia o erro real para o front
    });
  }
});

// Rota POST - Adicionar item temporário
app.post("/estoque/temp", async (req, res) => {
  try {
    const { CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, TAG, USUARIO } =
      req.body;

    await sql.query`
      INSERT INTO ESTOQUE_PRODUTO_TMP (
        CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, TAG, USUARIO
      ) VALUES (
        ${CODIGO_PRODUTO}, ${TIPO_LANCAMENTO}, ${QUANTIDADE}, ${TAG}, ${USUARIO}
      )
    `;

    res.status(201).send("Item adicionado ao lote");
  } catch (err) {
    res.status(500).send("Erro ao adicionar item temporário");
  }
});

// Rota POST - Processar lote
app.post("/estoque/processar", async (req, res) => {
  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    // 1. Agrupar itens temporários
    const lotes = await transaction.request().query(`
      SELECT 
        CODIGO_PRODUTO,
        TIPO_LANCAMENTO,
        SUM(QUANTIDADE) AS QUANTIDADE,
        MAX(TAG) AS TAG,
        MAX(USUARIO) AS USUARIO
      FROM ESTOQUE_PRODUTO_TMP
      GROUP BY CODIGO_PRODUTO, TIPO_LANCAMENTO
    `);

    // 2. Processar cada lote
    for (const lote of lotes.recordset) {
      // Atualizar estoque principal
      await transaction.request().query(`
        UPDATE PRODUTO SET
          ESTOQUE_ATUAL = ESTOQUE_ATUAL ${
            lote.TIPO_LANCAMENTO === "E" ? "+" : "-"
          } ${lote.QUANTIDADE}
        WHERE CODIGO = ${lote.CODIGO_PRODUTO}
      `);

      // Inserir no histórico
      await transaction.request().query(`
        INSERT INTO ESTOQUE_PRODUTO (
          CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, DATA, TAG, USUARIO
        ) VALUES (
          ${lote.CODIGO_PRODUTO}, ${lote.TIPO_LANCAMENTO}, 
          ${lote.QUANTIDADE}, GETDATE(), ${lote.TAG}, ${lote.USUARIO}
        )
      `);
    }

    // 3. Limpar temporários
    await transaction.request().query(`DELETE FROM ESTOQUE_PRODUTO_TMP`);

    await transaction.commit();
    res.send("Lote processado com sucesso");
  } catch (err) {
    await transaction.rollback();
    res.status(500).send("Erro ao processar lote");
  }
});

// Buscar produto por código de barras
app.get("/produto/barcode/:codigo", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        p.*,
        m.DESCRICAO AS MARCA,
        f.DESCRICAO AS FAMILIA
      FROM PRODUTO p
      LEFT JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
      LEFT JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
      WHERE p.CODIGO_BARRAS = ${req.params.codigo}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// Buscar últimos lançamentos
app.get("/estoque/historico/:codigo", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT TOP 5 * FROM ESTOQUE_PRODUTO
      WHERE CODIGO_PRODUTO = (
        SELECT CODIGO FROM PRODUTO WHERE CODIGO_BARRAS = ${req.params.codigo}
      )
      ORDER BY DATA DESC
    `;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

// Registrar movimentação
app.post("/estoque/movimentacao", async (req, res) => {
  const transaction = new sql.Transaction();

  try {
    const { codigo_barras, tipo, quantidade, usuario } = req.body;

    await transaction.begin();

    // 1. Buscar código do produto
    const produto = await transaction.request().query`
      SELECT CODIGO, ESTOQUE_ATUAL FROM PRODUTO
      WHERE CODIGO_BARRAS = ${codigo_barras}
    `;

    if (produto.recordset.length === 0) {
      throw new Error("Produto não encontrado");
    }

    const codigoProduto = produto.recordset[0].CODIGO;
    const estoqueAtual = produto.recordset[0].ESTOQUE_ATUAL;

    // 2. Atualizar estoque
    let novoEstoque = estoqueAtual;

    if (tipo === "E") novoEstoque += quantidade;
    if (tipo === "S") novoEstoque -= quantidade;
    if (tipo === "I") novoEstoque = quantidade;

    await transaction.request().query`
      UPDATE PRODUTO SET
        ESTOQUE_ATUAL = ${novoEstoque}
      WHERE CODIGO = ${codigoProduto}
    `;

    // 3. Registrar histórico
    await transaction.request().query`
      INSERT INTO ESTOQUE_PRODUTO (
        CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, DATA, USUARIO
      ) VALUES (
        ${codigoProduto}, ${tipo}, ${quantidade}, GETDATE(), ${usuario}
      )
    `;

    await transaction.commit();
    res.json({ success: true, novoEstoque });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

// // Buscar produtos por vários critérios
// app.get("/produtos/busca", async (req, res) => {
//   try {
//     const termo = req.query.termo;
//     const result = await sql.query`
//       SELECT
//         p.CODIGO,
//         p.CODIGO_BARRAS AS EAN,
//         p.DESCRICAO,
//         p.ESTOQUE_ATUAL,
//         m.DESCRICAO AS MARCA,
//         f.DESCRICAO AS FAMILIA
//       FROM PRODUTO p
//       LEFT JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
//       LEFT JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
//       WHERE
//         p.CODIGO_BARRAS LIKE '%${termo}%' OR
//         p.CODIGO LIKE '%${termo}%' OR
//         p.DESCRICAO LIKE '%${termo}%'
//     `;

//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: "Erro na busca de produtos" });
//   }
// });

// Backend (Node.js)
app.get("/produtos/busca", async (req, res) => {
  try {
    const termo = req.query.termo || "";
    const searchTerm = `%${termo}%`; // Adiciona % para busca parcial

    const result = await sql.query`
      SELECT 
        p.CODIGO,
        p.CODIGO_BARRAS AS EAN,
        p.DESCRICAO,
        p.ESTOQUE_ATUAL,
        m.DESCRICAO AS MARCA,
        f.DESCRICAO AS FAMILIA
      FROM PRODUTO p
      LEFT JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
      LEFT JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
      WHERE 
        p.CODIGO_BARRAS LIKE ${searchTerm} OR
        p.CODIGO LIKE ${searchTerm} OR
        p.DESCRICAO LIKE ${searchTerm}
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro na busca:", err); // Log detalhado
    res.status(500).json({ error: "Erro na busca de produtos" });
  }
});

// Registrar movimentação com log
app.post("/estoque/movimentar", async (req, res) => {
  const transaction = new sql.Transaction();

  try {
    const { codigoProduto, tipo, quantidade, usuario } = req.body;

    await transaction.begin();

    // 1. Buscar estoque atual
    const produto = await transaction.request().query`
      SELECT ESTOQUE_ATUAL FROM PRODUTO WHERE CODIGO = ${codigoProduto}
    `;

    if (produto.recordset.length === 0) {
      throw new Error("Produto não encontrado");
    }

    const estoqueAtual = produto.recordset[0].ESTOQUE_ATUAL;
    let novoEstoque = estoqueAtual;

    // 2. Calcular novo estoque
    switch (tipo) {
      case "E":
        novoEstoque += quantidade;
        break;
      case "S":
        novoEstoque -= quantidade;
        break;
      case "I":
        novoEstoque = quantidade;
        break;
      default:
        throw new Error("Tipo de movimentação inválido");
    }

    // 3. Atualizar estoque
    await transaction.request().query`
      UPDATE PRODUTO SET
        ESTOQUE_ATUAL = ${novoEstoque}
      WHERE CODIGO = ${codigoProduto}
    `;

    // 4. Registrar histórico
    await transaction.request().query`
      INSERT INTO ESTOQUE_PRODUTO (
        CODIGO_PRODUTO, TIPO_LANCAMENTO, QUANTIDADE, DATA, USUARIO
      ) VALUES (
        ${codigoProduto}, ${tipo}, ${quantidade}, GETDATE(), ${usuario}
      )
    `;

    await transaction.commit();

    // Log detalhado
    console.log(`
      Movimentação registrada:
      Produto: ${codigoProduto}
      Tipo: ${tipo}
      Quantidade: ${quantidade}
      Estoque Anterior: ${estoqueAtual}
      Novo Estoque: ${novoEstoque}
      Usuário: ${usuario}
    `);

    res.json({ success: true, estoqueAnterior: estoqueAtual, novoEstoque });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

// app.get("/familia-produto/ultimo-codigo", async (req, res) => {
//   try {
//     const result = await sql.query`
//         SELECT MAX(CAST(CODIGO AS INT)) AS ultimoCodigo FROM FAMILIA_PRODUTO
//     `;

//     // Corrigindo conversão para número
//     const ultimoCodigo = Number(result.recordset[0].ultimoCodigo) || 0;

//     //res.json({ proximoCodigo: ultimoCodigo + 1 });
//     const proximoCodigo = ultimoCodigo + 1;

//     console.log("Último código do banco:", result.recordset[0].ultimoCodigo);
//     console.log("Próximo código calculado:", ultimoCodigo + 1);
//     console.log("Próximo código gerado:", proximoCodigo); // Para depuração
//     res.json({ proximoCodigo });
//   } catch (err) {
//     res.status(500).json({ error: "Erro ao buscar último código" });
//   }
// });

// app.get("/familia-produto/ultimo-codigo", async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT MAX(CODIGO) AS ultimoCodigo FROM FAMILIA_PRODUTO
//     `;

//     const ultimoCodigo = result.recordset[0].ultimoCodigo || 0;
//     // console.log("🚀 ~ app.get ~ ultimoCodigo:", ultimoCodigo);
//     res.json({ proximoCodigo: ultimoCodigo + 1 });
//   } catch (err) {
//     res.status(500).json({ error: "Erro ao buscar último código" });
//   }
// });

// Rota para obter último código
app.get("/marca/ultimo-codigo", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT MAX(CODIGO) AS ultimoCodigo FROM MARCA
    `;
    const ultimoCodigo = Number(result.recordset[0].ultimoCodigo) || 0;
    res.json({ proximoCodigo: ultimoCodigo + 1 });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar último código" });
  }
});

// Rota para criar/atualizar
app.post("/marca", async (req, res) => {
  try {
    const { DESCRICAO } = req.body;
    await sql.query`
      INSERT INTO MARCA (DESCRICAO)
      VALUES (${DESCRICAO})
    `;
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar marca" });
  }
});

app.put("/marca/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { DESCRICAO } = req.body;
    await sql.query`
      UPDATE MARCA
      SET DESCRICAO = ${DESCRICAO}
      WHERE CODIGO = ${codigo}
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar marca" });
  }
});
