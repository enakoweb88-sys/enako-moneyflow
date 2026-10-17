-- The application schema marker belongs to the backend migration system and
-- must never be reachable through Supabase browser roles. Flyway's own history
-- table is hardened by the Supabase deployment migration because Flyway locks
-- that table while applying this migration.

ALTER TABLE schema_history_marker ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE schema_history_marker FROM anon, authenticated;
