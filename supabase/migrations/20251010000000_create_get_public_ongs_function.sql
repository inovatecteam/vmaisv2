-- Create a function to fetch public ONG data
CREATE OR REPLACE FUNCTION get_public_ongs()
RETURNS TABLE (
  id uuid,
  nome text,
  tipo text[],
  descricao text,
  cidade text,
  estado text,
  necessidades text[],
  thumbnail_url text,
  short_description text,
  how_to_help text,
  doacoes text,
  endereco_fisico text,
  localizacao_tipo text,
  endereco_online text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ongs.id,
    ongs.nome,
    ongs.tipo,
    ongs.descricao,
    ongs.cidade,
    ongs.estado,
    ongs.necessidades,
    ongs.thumbnail_url,
    ongs.short_description,
    ongs.how_to_help,
    ongs.doacoes,
    ongs.endereco_fisico,
    ongs.localizacao_tipo,
    ongs.endereco_online
  FROM
    ongs
  WHERE
    ongs.admin_approved = true
  ORDER BY
    ongs.created_at DESC;
END;
$$ LANGUAGE plpgsql;