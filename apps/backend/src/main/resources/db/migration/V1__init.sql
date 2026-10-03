-- Baseline migration: Create empty schema history marker table
CREATE TABLE schema_history_marker (
    id VARCHAR(50) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    initialized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_history_marker (id, description)
VALUES ('V1__init', 'E-NAKO MoneyFlow Initial Baseline Marker');
