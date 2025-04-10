--  Alterar a Restrição Existente
-- Primeiro, verifique qual é a restrição atual na tabela ESTOQUE_PRODUTO:
SELECT 
    name AS ConstraintName,
    OBJECT_NAME(parent_object_id) AS TableName,
    COL_NAME(parent_object_id, parent_column_id) AS ColumnName
FROM sys.foreign_keys
WHERE referenced_object_id = OBJECT_ID('dbo.PRODUTO');

b) Remover a Restrição Existente
Remova a restrição existente:

ALTER TABLE dbo.ESTOQUE_PRODUTO
DROP CONSTRAINT FK_ESTOQUE_PRODUTO;

c) Adicionar a Nova Restrição com ON DELETE CASCADE
Adicione a nova restrição com a opção ON DELETE CASCADE:

ALTER TABLE dbo.ESTOQUE_PRODUTO
ADD CONSTRAINT FK_ESTOQUE_PRODUTO
FOREIGN KEY (CODIGO_PRODUTO)
REFERENCES dbo.PRODUTO(CODIGO)
ON DELETE CASCADE;

