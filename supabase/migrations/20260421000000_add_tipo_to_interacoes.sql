-- Adiciona coluna tipo em interacoes para distinguir view / whatsapp / report
-- Rows existentes são tratados como 'whatsapp' (comportamento pré-mudança)
ALTER TABLE interacoes ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'whatsapp';

-- Backfill explícito (redundante com DEFAULT mas documenta a intenção)
UPDATE interacoes SET tipo = 'whatsapp' WHERE tipo IS NULL;

-- NOT NULL sem default — força código novo a ser explícito sobre tipo
ALTER TABLE interacoes ALTER COLUMN tipo SET NOT NULL;
ALTER TABLE interacoes ALTER COLUMN tipo DROP DEFAULT;

-- CHECK para bloquear valores inválidos (mais simples de evoluir que enum)
ALTER TABLE interacoes DROP CONSTRAINT IF EXISTS interacoes_tipo_check;
ALTER TABLE interacoes ADD CONSTRAINT interacoes_tipo_check
  CHECK (tipo IN ('view', 'whatsapp', 'report'));

-- Índices pra acelerar agregações por tipo e por ONG+tipo
CREATE INDEX IF NOT EXISTS interacoes_tipo_timestamp_idx ON interacoes(tipo, timestamp DESC);
CREATE INDEX IF NOT EXISTS interacoes_ong_tipo_idx ON interacoes(ong_id, tipo);
