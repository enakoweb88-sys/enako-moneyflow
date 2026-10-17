-- Schema history belongs to the backend migration system and must never be
-- reachable through Supabase browser roles.

ALTER TABLE flyway_schema_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_history_marker ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE flyway_schema_history, schema_history_marker FROM anon, authenticated;
