SELECT *  FROM FORNECEDOR; --faz a consulta na tabela fornecedor

SELECT * FROM MARCA_PRODUTO WHERE DESCRICAO LIKE '%ALCOM%'; --faz a consulta na tabela marca_produto

SELECT * FROM FAMILIA_PRODUTO WHERE DESCRICAO LIKE '%FITA%';  --faz a consulta na tabela familia_produto

SELECT * FROM PRODUTO WHERE DESCRICAO LIKE '%FITA %'; --faz a consulta na tabela produto

UPDATE PRODUTO
SET CODIGO_MARCA = 13
WHERE DESCRICAO LIKE '%FITA %';   -- Atualiza o campo CODIGO_MARCA para 13 (Alcom) onde a descrição contém 'FITA '

UPDATE PRODUTO
SET CODIGO_FAMILIA = 11
WHERE DESCRICAO LIKE '%FITA %'; -- Atualiza o campo CODIGO_FAMILIA para 11 (Fita Adesiva) onde a descrição contém 'FITA '

UPDATE PRODUTO
SET COD_FORNECEDOR = 2
WHERE DESCRICAO LIKE '%FITA %'; --  Atualiza o campo COD_FORNECEDOR para 2 (Kalunga) onde a descrição contém 'FITA ' 