require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const authenticateToken = require("./middleware/authMiddleware"); // Importar o middleware

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuração da conexão com o SQL Server
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

// Conectar ao banco de dados
sql
  .connect(config)
  .then(() => console.log("Conectado ao SQL Server"))
  .catch((err) => console.error("Erro ao conectar ao SQL Server:", err));

const jwt = require("jsonwebtoken");

// Função para gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10m" });
};

// Rota pública
app.get("/", (req, res) => {
  res.send("Bem-vindo à API!");
});

// Rota protegida com middleware
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await sql.query`SELECT * FROM Users WHERE id = ${userId}`;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuário pelo email
    const user = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    if (user.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const userData = user.recordset[0];

    // Comparar senhas
    const isMatch = await bcrypt.compare(password, userData.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gerar token JWT
    const token = generateToken(userData.id);

    res.json({
      message: "Login bem-sucedido!",
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      },
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro ao processar login." });
  }
});

// Rota para registrar um novo usuário

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Valide as credenciais do usuário
//   const user = await User.findOne({ where: { email } });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ error: "Credenciais inválidas." });
//   }

//   try {
//     console.log("Requisição recebida:", { email, password });

//     // Buscar usuário pelo email
//     // const user = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
//     // console.log("Usuário encontrado no banco de dados:", user.recordset);

//     if (user.recordset.length === 0) {
//       console.error("Erro: Usuário não encontrado para o email:", email);
//       return res.status(401).json({ error: "Credenciais inválidas." });
//     }

//     const userData = user.recordset[0];

//     // Comparar senhas
//     const isMatch = await bcrypt.compare(password, userData.password_hash);
//     console.log("Senha válida?", isMatch);

//     if (!isMatch) {
//       console.error("Erro: Senha inválida para o email:", email);
//       return res.status(401).json({ error: "Credenciais inválidas." });
//     }

//     // Gerar token JWT
//     const token = jwt.sign({ userId: userData.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     console.log("Login bem-sucedido. Token gerado:", token);

//     res.json({
//       message: "Login bem-sucedido!",
//       token,
//       user: {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//       },
//     });
//   } catch (err) {
//     console.error("Erro ao fazer login:", err);
//     res.status(500).json({ error: "Erro ao processar login." });
//   }
// });

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o email já existe
    const existingUser =
      await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: "Este email já está registrado." });
    }

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Inserir o novo usuário no banco de dados
    await sql.query`
      INSERT INTO Users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
    `;

    res.status(201).json({ message: "Conta criada com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ error: "Erro ao criar conta." });
  }
});

const crypto = require("crypto");

// Solicitar redefinição de senha
app.post("/recover", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    if (user.recordset.length === 0) {
      return res.status(404).json({ error: "Email não encontrado." });
    }

    const userData = user.recordset[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

    // Salvar token no banco de dados
    await sql.query`
      INSERT INTO PasswordResetTokens (user_id, token, expires_at)
      VALUES (${userData.id}, ${token}, ${expiresAt})
    `;

    // Simulação de envio de email (substitua por um serviço real)
    console.log(
      `Link de redefinição enviado para ${email}: http://localhost:3000/reset-password?token=${token}`
    );

    res.json({ message: "Link de redefinição enviado para o email." });
  } catch (err) {
    console.error("Erro ao solicitar redefinição de senha:", err);
    res.status(500).json({ error: "Erro ao processar solicitação." });
  }
});

// Redefinir senha
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetToken = await sql.query`
      SELECT * FROM PasswordResetTokens WHERE token = ${token} AND expires_at > GETDATE()
    `;
    if (resetToken.recordset.length === 0) {
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    const tokenData = resetToken.recordset[0];
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    await sql.query`
      UPDATE Users SET password_hash = ${passwordHash} WHERE id = ${tokenData.user_id}
    `;

    // Remover token usado
    await sql.query`DELETE FROM PasswordResetTokens WHERE id = ${tokenData.id}`;

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ error: "Erro ao processar redefinição." });
  }
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

app.get("/estoque-data", authenticateToken, async (req, res) => {
  try {
    const stockData = await sql.query`
      SELECT 
        p.DESCRICAO AS produto, 
        ep.QUANTIDADE AS quantidade
      FROM 
        ESTOQUE_PRODUTO ep
      JOIN 
        PRODUTO p ON ep.CODIGO_PRODUTO = p.CODIGO
    `;
    res.json(stockData.recordset);
  } catch (err) {
    console.error("Erro ao buscar dados de estoque:", err.message);
    res.status(500).json({ error: "Erro ao buscar dados de estoque." });
  }
});

// app.get("/produto-aggregate", async (req, res) => {
//   try {
//     const byMarca = await sql.query`
//       SELECT
//         mp.DESCRICAO AS marca,
//         COUNT(*) AS TotalProdutos,
//         SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
//       FROM PRODUTO p
//       JOIN MARCA_PRODUTO mp ON p.CODIGO_MARCA = mp.CODIGO
//       GROUP BY mp.DESCRICAO
//     `;
//     res.json({ byMarca: byMarca.recordset });
//   } catch (err) {
//     console.error("Erro ao buscar dados agregados de produtos:", err.message);
//     res
//       .status(500)
//       .json({ error: "Erro ao buscar dados agregados de produtos." });
//   }
// });

app.get("/produto-aggregate", async (req, res) => {
  try {
    // Por Família
    const byFamily = await sql.query`
      SELECT
        fp.DESCRICAO AS familia,
        COUNT(*) AS total,
        SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
      FROM
        PRODUTO p
      JOIN
        FAMILIA_PRODUTO fp ON p.CODIGO_FAMILIA = fp.CODIGO
      GROUP BY fp.DESCRICAO
    `;

    // Por Marca
    const byMarca = await sql.query`
      SELECT
        mp.DESCRICAO AS marca,
        COUNT(*) AS total,
        SUM(p.VALOR_UNITARIO*p.ESTOQUE_ATUAL) AS ValorTotalEstoque
      FROM
        PRODUTO p
      JOIN
        MARCA_PRODUTO mp ON p.CODIGO_MARCA = mp.CODIGO
      GROUP BY mp.DESCRICAO
    `;

    res.json({
      byFamily: byFamily.recordset,
      byMarca: byMarca.recordset,
    });
    console.log("🚀 ~ app.get ~ byFamily:", byFamily);
  } catch (err) {
    console.error("Erro ao buscar dados agregados de produtos:", err.message);
    res
      .status(500)
      .json({ error: "Erro ao buscar dados agregados de produtos." });
  }
});

// GET /fornecedores - Listar todos
// POST /fornecedores - Criar
// PUT /fornecedores/:codigo - Atualizar
// DELETE /fornecedores/:codigo - Excluir

// Rota GET - Listar todos os fornecedores
app.get("/fornecedores", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM FORNECEDOR`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar fornecedores:", err.message);
    res.status(500).json({ error: "Erro ao buscar fornecedores." });
  }
});

// Rota POST - Criar um novo fornecedor
app.post("/fornecedor", async (req, res) => {
  try {
    const { NOME, CNPJ, TELEFONE, EMAIL, ENDERECO } = req.body;

    // Validar campos obrigatórios
    if (!NOME || !CNPJ) {
      return res.status(400).json({ error: "Nome e CNPJ são obrigatórios." });
    }

    // Inserir fornecedor no banco de dados
    await sql.query`
      INSERT INTO FORNECEDOR (NOME, CNPJ, TELEFONE, EMAIL, ENDERECO)
      VALUES (${NOME}, ${CNPJ}, ${TELEFONE || null}, ${EMAIL || null}, ${
      ENDERECO || null
    })
    `;

    res.status(201).json({ message: "Fornecedor criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar fornecedor:", err.message);
    res.status(500).json({ error: "Erro ao criar fornecedor." });
  }
});

// Rota PUT - Atualizar um fornecedor existente
app.put("/fornecedor/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    console.log("🚀 ~ app.put ~ codigo:", codigo);
    const { NOME, CNPJ, TELEFONE, EMAIL, ENDERECO } = req.body;

    // Validar campos obrigatórios
    if (!NOME || !CNPJ) {
      return res.status(400).json({ error: "Nome e CNPJ são obrigatórios." });
    }

    // Atualizar fornecedor no banco de dados
    await sql.query`
      UPDATE FORNECEDOR
      SET 
        NOME = ${NOME},
        CNPJ = ${CNPJ},
        TELEFONE = ${TELEFONE || null},
        EMAIL = ${EMAIL || null},
        ENDERECO = ${ENDERECO || null}
      WHERE CODIGO = ${codigo}
    `;

    res.json({ message: "Fornecedor atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar fornecedor:", err.message);
    res.status(500).json({ error: "Erro ao atualizar fornecedor." });
  }
});

// Rota DELETE - Excluir um fornecedor
app.delete("/fornecedor/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    // Excluir fornecedor do banco de dados
    await sql.query`
      DELETE FROM FORNECEDOR
      WHERE CODIGO = ${codigo}
    `;

    res.json({ message: "Fornecedor excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir fornecedor:", err.message);
    res.status(500).json({ error: "Erro ao excluir fornecedor." });
  }
});

// Rota GET - Obter um fornecedor por código
app.get("/fornecedor/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    const result = await sql.query`
      SELECT * FROM FORNECEDOR
      WHERE CODIGO = ${codigo}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado." });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao buscar fornecedor:", err.message);
    res.status(500).json({ error: "Erro ao buscar fornecedor." });
  }
});

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

// Rota para dados de estoque
app.get("/produto/estoque", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT TOP (10)
        CODIGO,
        DESCRICAO,
        ESTOQUE_ATUAL,
        ESTOQUE_MINIMO 
      FROM PRODUTO            
    `;
    console.log("Dados obtidos:", result.recordset); // Log dos dados obtidos
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar dados de estoque:", err.message); // Log detalhado
    res.status(500).json({
      error: "Erro ao buscar dados de estoque.",
      details: err.message, // Inclui detalhes do erro
    });
  }
});

// // Rota para dados agregados
app.get("/produto/aggregate", async (req, res) => {
  try {
    const byFamily = await sql.query`
      SELECT 
        f.DESCRICAO AS FAMILIA,
        SUM(p.ESTOQUE_ATUAL) AS total
      FROM PRODUTO p
      INNER JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
      GROUP BY f.DESCRICAO
      ORDER BY total DESC
    `;

    const byMarca = await sql.query`
      SELECT 
        m.DESCRICAO AS MARCA,
        SUM(p.ESTOQUE_ATUAL) AS total
      FROM PRODUTO p
      INNER JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
      GROUP BY m.DESCRICAO
    `;

    const byFornecedor = await sql.query`
       SELECT 
        m.NOME AS FORNECEDOR,
        SUM(p.ESTOQUE_ATUAL) AS total
      FROM PRODUTO p
      INNER JOIN FORNECEDOR m ON p.COD_FORNECEDOR = m.CODIGO
      GROUP BY m.NOME
    `;

    res.json({
      byFamily: byFamily.recordset,
      byMarca: byMarca.recordset,
      byFornecedor: byFornecedor.recordset,
    });
  } catch (err) {
    res.status(500).send("Erro ao buscar dados agregados");
  }
});

// Rota para obter o próximo código
app.get("/produto/proximo-codigo", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT MAX(CODIGO) AS ultimoCodigo FROM PRODUTO
    `;
    const ultimoCodigo = Number(result.recordset[0].ultimoCodigo) || 0; // Retorna 0 se a tabela estiver vazia
    const proximoCodigo = ultimoCodigo + 1;
    res.json({ proximoCodigo });
  } catch (err) {
    console.error("Erro ao buscar próximo código:", err.message);
    res.status(500).json({ error: "Erro ao buscar próximo código." });
  }
});

// post para criar produto
// app.post("/produto", async (req, res) => {
//   try {
//     const {
//       CODIGO,
//       CODIGO_INTERNO,
//       DESCRICAO,
//       CODIGO_BARRAS,
//       ESTOQUE_MINIMO,
//       ESTOQUE_ATUAL,
//       CODIGO_MARCA,
//       CODIGO_FAMILIA,
//       VALOR_UNITARIO,
//       COD_FORNECEDOR,
//     } = req.body;
//     const result =
//       await sql.query`INSERT INTO PRODUTO (CODIGO, CODIGO_INTERNO, DESCRICAO, CODIGO_BARRAS, ESTOQUE_MINIMO, ESTOQUE_ATUAL, CODIGO_MARCA, CODIGO_FAMILIA, VALOR_UNITARIO, COD_FORNECEDOR) VALUES (${CODIGO}, ${CODIGO_INTERNO}, ${DESCRICAO}, ${CODIGO_BARRAS}, ${ESTOQUE_MINIMO}, ${ESTOQUE_ATUAL}, ${CODIGO_MARCA}, ${CODIGO_FAMILIA}, ${VALOR_UNITARIO}, ${COD_FORNECEDOR})`;
//     res.status(201).send("Registro inserido com sucesso");
//   } catch (err) {
//     console.log("🚀 ~ app.post ~ err:", err);
//     res.status(500).send("Erro ao inserir Produto");
//   }
// });

// Rota para buscar produto por ID

// Rota para criar um novo produto, pegando o id do ultimo registro
app.post("/produto", async (req, res) => {
  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // 1. Consultar o último código
    const codigoResult = await transaction.request().query`
      SELECT MAX(CODIGO) AS ultimoCodigo FROM PRODUTO
    `;
    const ultimoCodigo = Number(codigoResult.recordset[0].ultimoCodigo) || 0;
    const novoCodigo = ultimoCodigo + 1;

    // 2. Extrair os dados do corpo da requisição
    const {
      CODIGO_INTERNO,
      DESCRICAO,
      CODIGO_BARRAS,
      ESTOQUE_MINIMO,
      ESTOQUE_ATUAL,
      CODIGO_MARCA,
      CODIGO_FAMILIA,
      VALOR_UNITARIO,
      COD_FORNECEDOR,
    } = req.body;

    // 3. Inserir o novo produto com o código gerado
    await transaction.request().query`
      INSERT INTO PRODUTO (
        CODIGO,
        CODIGO_INTERNO,
        DESCRICAO,
        CODIGO_BARRAS,
        ESTOQUE_MINIMO,
        ESTOQUE_ATUAL,
        CODIGO_MARCA,
        CODIGO_FAMILIA,
        VALOR_UNITARIO,
        COD_FORNECEDOR
      ) VALUES (
        ${novoCodigo},
        ${CODIGO_INTERNO},
        ${DESCRICAO},
        ${CODIGO_BARRAS},
        ${ESTOQUE_MINIMO},
        ${ESTOQUE_ATUAL},
        ${CODIGO_MARCA},
        ${CODIGO_FAMILIA},
        ${VALOR_UNITARIO},
        ${COD_FORNECEDOR}
      )
    `;

    await transaction.commit();
    res
      .status(201)
      .json({ message: "Produto criado com sucesso!", CODIGO: novoCodigo });
  } catch (err) {
    await transaction.rollback();
    console.error("Erro ao criar produto:", err.message);
    res.status(500).json({ error: "Erro ao criar produto." });
  }
});

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
      COD_FORNECEDOR,
      VALOR_UNITARIO,
    } = req.body;

    // 1. Atualizar o produto
    await sql.query`UPDATE PRODUTO SET 
      CODIGO_INTERNO = ${CODIGO_INTERNO},
      DESCRICAO = ${DESCRICAO},
      CODIGO_BARRAS = ${CODIGO_BARRAS},
      ESTOQUE_MINIMO = ${ESTOQUE_MINIMO},
      ESTOQUE_ATUAL = ${ESTOQUE_ATUAL},
      CODIGO_MARCA = ${CODIGO_MARCA},
      CODIGO_FAMILIA = ${CODIGO_FAMILIA},
      COD_FORNECEDOR = ${COD_FORNECEDOR},
      VALOR_UNITARIO = ${VALOR_UNITARIO}
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

// rota-exclusao - desativada em 8-4-25
// app.delete("/produto/:id", async (req, res) => {
//   try {
//     await sql.query`DELETE FROM PRODUTO WHERE CODIGO = ${req.params.id}`;
//     res.send("Produto excluído com sucesso");
//   } catch (err) {
//     console.error("Erro ao excluir produto:", err.message);
//     res.status(500).send("Erro ao excluir produto");
//   }
// });

// rota-exclusao em cascata
app.delete("/produto/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Verifica registros relacionados na tabela ESTOQUE_PRODUTO
    const estoqueRecords = await sql.query`
      SELECT * FROM ESTOQUE_PRODUTO WHERE CODIGO_PRODUTO = ${productId}
    `;

    if (estoqueRecords.recordset.length > 0) {
      // Retorna os registros relacionados para o frontend
      return res.status(200).json({
        message: "Existem registros relacionados no estoque.",
        relatedRecords: estoqueRecords.recordset,
      });
    }

    // Se não houver registros relacionados, exclui o produto diretamente
    await sql.query`
      DELETE FROM PRODUTO WHERE CODIGO = ${productId}
    `;

    res.json({ message: "Produto excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir produto:", err.message);
    res.status(500).json({ error: "Erro ao excluir produto." });
  }
});

// Nova rota para exclusão final (com registros relacionados)
app.post("/produto/:id/excluir-tudo", async (req, res) => {
  const productId = req.params.id;

  try {
    // Exclui os registros relacionados na tabela ESTOQUE_PRODUTO
    await sql.query`
      DELETE FROM ESTOQUE_PRODUTO WHERE CODIGO_PRODUTO = ${productId}
    `;

    // Exclui o produto na tabela PRODUTO
    await sql.query`
      DELETE FROM PRODUTO WHERE CODIGO = ${productId}
    `;

    res.json({
      message: "Produto e registros relacionados excluídos com sucesso.",
    });
  } catch (err) {
    console.error(
      "Erro ao excluir produto e registros relacionados:",
      err.message
    );
    res
      .status(500)
      .json({ error: "Erro ao excluir produto e registros relacionados." });
  }
});

// back-end/app.js

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
// app.get("/produtos/busca", async (req, res) => {
//   try {
//     const termo = req.query.termo || "";
//     const searchTerm = `%${termo}%`; // Adiciona % para busca parcial

//     let query = `
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
//     `;

//     // Só adiciona WHERE se houver termo
//     if (termo) {
//       query += `
//         WHERE
//           p.CODIGO_BARRAS LIKE ${searchTerm} OR
//           p.CODIGO LIKE ${searchTerm} OR
//           p.DESCRICAO LIKE ${searchTerm}
//       `;
//     }

//     const result = await sql.query(query);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: "Erro na busca de produtos" });
//   }
// });
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

    // Converter para número
    const qtdNumerica = Number(quantidade);

    // Validar se é um número válido
    if (isNaN(qtdNumerica)) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }

    await transaction.begin();

    // 1. Buscar estoque atual
    const produto = await transaction.request().query`
      SELECT ESTOQUE_ATUAL FROM PRODUTO WHERE CODIGO = ${codigoProduto}
    `;

    if (produto.recordset.length === 0) {
      throw new Error("Produto não encontrado");
    }

    const estoqueAtual = produto.recordset[0].ESTOQUE_ATUAL;
    let novoEstoque = produto.recordset[0].ESTOQUE_ATUAL;
    // estoqueAtual;

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

    res.json({
      success: true,
      estoqueAnterior: produto.recordset[0].ESTOQUE_ATUAL,
      novoEstoque,
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: "Erro ao registrar movimentação" });
    //res.status(500).json({ error: err.message });
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

// // Nova Rota para Valor Total do Estoque
// app.get("/estoque/valor-total", async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT SUM(ESTOQUE_ATUAL * VALOR_UNITARIO) AS ValorTotal
//       FROM PRODUTO
//     `;

//     res.json({ valorTotal: result.recordset[0].ValorTotal || 0 });
//   } catch (err) {
//     res.status(500).json({ error: "Erro ao calcular valor do estoque" });
//   }
// });

// Rota para calcular o valor total do estoque
app.get("/estoque/valor-total", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT SUM(ESTOQUE_ATUAL * VALOR_UNITARIO) AS ValorTotal
      FROM PRODUTO
    `;
    const valorTotal = result.recordset[0].ValorTotal || 0; // Caso não haja produtos, retorna 0
    res.json({ valorTotal });
  } catch (err) {
    console.error("Erro ao calcular valor total do estoque:", err.message);
    res.status(500).json({ error: "Erro ao calcular valor total do estoque." });
  }
});

// Rota para calcular o valor total do estoque por marca
app.get("/estoque/valor-total-por-marca", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        m.DESCRICAO AS Marca,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotal
      FROM PRODUTO p
      INNER JOIN MARCA_PRODUTO m ON p.CODIGO_MARCA = m.CODIGO
      GROUP BY m.DESCRICAO
    `;
    res.json(result.recordset);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao calcular valor do estoque por marca" });
  }
});
// teste
// Rota para calcular o valor total do estoque por família
app.get("/estoque/valor-total-por-familia", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        f.DESCRICAO AS Familia,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotal
      FROM PRODUTO p
      INNER JOIN FAMILIA_PRODUTO f ON p.CODIGO_FAMILIA = f.CODIGO
      GROUP BY f.DESCRICAO
    `;
    // WHERE p.ESTOQUE_ATUAL > 0 and p.VALOR_UNITARIO > 0
    console.log("Resultado da consulta:", result.recordset);
    res.json(result.recordset); // Retorna JSON válido
  } catch (err) {
    console.error(
      "Erro ao calcular valor do estoque por família:",
      err.message
    );
    res
      .status(500)
      .json({ error: "Erro ao calcular valor do estoque por família" });
  }
});

// Rota para calcular o valor total do estoque por fornecedor
app.get("/estoque/valor-total-por-fornecedor", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        f.NOME AS Fornecedor,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotal
      FROM PRODUTO p
      INNER JOIN FORNECEDOR f ON p.COD_FORNECEDOR = f.CODIGO
      GROUP BY f.NOME
    `;
    res.json(result.recordset);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao calcular valor do estoque por fornecedor" });
  }
});

app.get("/totais", async (req, res) => {
  try {
    const produtos = await sql.query`SELECT COUNT(*) AS total FROM PRODUTO`;
    const movimentacoes =
      await sql.query`SELECT COUNT(*) AS total FROM ESTOQUE_PRODUTO`;
    const marcas = await sql.query`SELECT COUNT(*) AS total FROM MARCA_PRODUTO`;
    const familias =
      await sql.query`SELECT COUNT(*) AS total FROM FAMILIA_PRODUTO`;
    const Fornecedores =
      await sql.query`SELECT COUNT(*) AS total FROM FORNECEDOR`;
    const valorTotal = await sql.query`
      SELECT SUM(ESTOQUE_ATUAL * VALOR_UNITARIO) AS total FROM PRODUTO`;
    res.json({
      produtos: produtos.recordset[0].total,
      marcas: marcas.recordset[0].total,
      familias: familias.recordset[0].total,
      fornecedores: Fornecedores.recordset[0].total,
      movimentacoes: movimentacoes.recordset[0].total,
      valorTotal: valorTotal.recordset[0].total,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar totais" });
  }
});

app.get("/totais", async (req, res) => {
  try {
    console.log("Requisição recebida na rota /totais");
    const totalProdutos =
      await sql.query`SELECT COUNT(*) AS total FROM PRODUTO`;
    const totalMovimentacoes =
      await sql.query`SELECT COUNT(*) AS total FROM ESTOQUE_PRODUTO`;
    const totalMarcas =
      await sql.query`SELECT COUNT(*) AS total FROM MARCA_PRODUTO`;
    const totalFamilias =
      await sql.query`SELECT COUNT(*) AS total FROM FAMILIA_PRODUTO`;
    const totalFornecedores =
      await sql.query`SELECT COUNT(*) AS total FROM FORNECEDOR`;

    console.log("Dados obtidos:", {
      produtos: totalProdutos.recordset[0].total,
      movimentacoes: totalMovimentacoes.recordset[0].total,
      marcas: totalMarcas.recordset[0].total,
      familias: totalFamilias.recordset[0].total,
      fornecedores: totalFornecedores.recordset[0].total,
    });

    res.json({
      produtos: totalProdutos.recordset[0]?.total || 0,
      movimentacoes: totalMovimentacoes.recordset[0]?.total || 0,
      marcas: totalMarcas.recordset[0]?.total || 0,
      familias: totalFamilias.recordset[0]?.total || 0,
    });
  } catch (err) {
    console.error("Erro ao buscar totais:", err.message);
    res.status(500).json({ error: "Erro ao buscar totais." });
  }
});

// Relatórios marcas
app.get("/relatorios/marcas", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        mp.DESCRICAO AS Marca,
        COUNT(p.CODIGO) AS TotalProdutos,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotalEstoque
      FROM MARCA_PRODUTO mp
      LEFT JOIN PRODUTO p ON mp.CODIGO = p.CODIGO_MARCA
      GROUP BY mp.DESCRICAO
      ORDER BY TotalProdutos DESC;
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao gerar relatório de marcas:", err.message);
    res.status(500).json({ error: "Erro ao gerar relatório de marcas." });
  }
});

// Relatórios Familias
app.get("/relatorios/familias", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        mp.DESCRICAO AS Familia,
        COUNT(p.CODIGO) AS TotalProdutos,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotalEstoque
      FROM FAMILIA_PRODUTO mp
      LEFT JOIN PRODUTO p ON mp.CODIGO = p.CODIGO_FAMILIA
      GROUP BY mp.DESCRICAO
      ORDER BY TotalProdutos DESC;
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao gerar relatório de marcas:", err.message);
    res.status(500).json({ error: "Erro ao gerar relatório de famílias." });
  }
});

// Relatórios Familias
app.get("/relatorios/fornecedores", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        mp.NOME AS Fornecedor,
        COUNT(p.CODIGO) AS TotalProdutos,
        SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotalEstoque
      FROM FORNECEDOR mp
      LEFT JOIN PRODUTO p ON mp.CODIGO = p.COD_FORNECEDOR
      GROUP BY mp.NOME
      ORDER BY TotalProdutos DESC;
    `;

    //     SELECT
    //   f.NOME AS Fornecedor,
    //   SUM(p.ESTOQUE_ATUAL * p.VALOR_UNITARIO) AS ValorTotal
    // FROM PRODUTO p
    // INNER JOIN FORNECEDOR f ON p.COD_FORNECEDOR = f.CODIGO
    // GROUP BY f.NOME
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao gerar relatório de marcas:", err.message);
    res.status(500).json({ error: "Erro ao gerar relatório de famílias." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
