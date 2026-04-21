-- ============================================================
-- Métricas de impacto — Voluntaria+
-- Cole no Supabase Dashboard → SQL Editor e rode individualmente.
-- Requer a migração 20260421000000_add_tipo_to_interacoes.sql aplicada.
-- ============================================================

-- 1. NÚMEROS-CHAVE últimos 30 dias (pra pitch/parceria)
SELECT
  COUNT(DISTINCT user_id)                             AS voluntarios_engajados,
  COUNT(DISTINCT ong_id)                              AS ongs_engajadas,
  COUNT(*) FILTER (WHERE tipo = 'view')               AS total_visualizacoes,
  COUNT(*) FILTER (WHERE tipo = 'whatsapp')           AS total_contatos_whatsapp,
  COUNT(*) FILTER (WHERE tipo = 'report')             AS total_reports
FROM interacoes
WHERE timestamp > now() - interval '30 days';


-- 2. Top 20 ONGs por visualização (últimos 30 dias)
SELECT o.nome, COUNT(*) AS views
FROM interacoes i JOIN ongs o ON o.id = i.ong_id
WHERE i.tipo = 'view' AND i.timestamp > now() - interval '30 days'
GROUP BY o.id, o.nome
ORDER BY views DESC
LIMIT 20;


-- 3. Top 20 ONGs por contato WhatsApp (últimos 30 dias)
SELECT o.nome, COUNT(*) AS contatos
FROM interacoes i JOIN ongs o ON o.id = i.ong_id
WHERE i.tipo = 'whatsapp' AND i.timestamp > now() - interval '30 days'
GROUP BY o.id, o.nome
ORDER BY contatos DESC
LIMIT 20;


-- 4. Taxa de conversão view → whatsapp por ONG
WITH stats AS (
  SELECT ong_id,
         COUNT(*) FILTER (WHERE tipo = 'view')     AS views,
         COUNT(*) FILTER (WHERE tipo = 'whatsapp') AS contatos
  FROM interacoes
  WHERE timestamp > now() - interval '30 days'
  GROUP BY ong_id
)
SELECT o.nome, s.views, s.contatos,
       ROUND(100.0 * s.contatos / NULLIF(s.views, 0), 1) AS taxa_conversao_pct
FROM stats s JOIN ongs o ON o.id = s.ong_id
WHERE s.views > 0
ORDER BY s.views DESC;


-- 5. Engajamento diário (para gráfico de evolução)
SELECT DATE_TRUNC('day', timestamp)::date AS dia,
       tipo,
       COUNT(*) AS n
FROM interacoes
WHERE timestamp > now() - interval '90 days'
GROUP BY dia, tipo
ORDER BY dia DESC, tipo;


-- 6. Crescimento da base de voluntários (novos por semana)
SELECT DATE_TRUNC('week', created_at)::date AS semana,
       COUNT(*) AS novos_usuarios
FROM users
GROUP BY semana
ORDER BY semana DESC
LIMIT 26;


-- 7. ONGs cadastradas vs aprovadas
SELECT COUNT(*) FILTER (WHERE admin_approved = true)  AS aprovadas,
       COUNT(*) FILTER (WHERE admin_approved = false) AS pendentes,
       COUNT(*)                                        AS total
FROM ongs;
