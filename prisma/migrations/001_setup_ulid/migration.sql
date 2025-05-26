-- Enable the pgcrypto extension for random generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ULID generation function
CREATE OR REPLACE FUNCTION ulid() RETURNS TEXT AS $$
DECLARE
    -- Crockford's Base32 alphabet
    alphabet TEXT := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    timestamp BIGINT;
    randomness BIGINT;
    output TEXT := '';
    i INTEGER;
BEGIN
    -- Get current timestamp in milliseconds
    timestamp := FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000);
    
    -- Generate random part
    randomness := (random() * 9223372036854775807::BIGINT)::BIGINT;
    
    -- Encode timestamp part (10 characters)
    FOR i IN 1..10 LOOP
        output := SUBSTR(alphabet, (timestamp % 32) + 1, 1) || output;
        timestamp := timestamp / 32;
    END LOOP;
    
    -- Encode random part (16 characters)
    FOR i IN 1..16 LOOP
        output := output || SUBSTR(alphabet, (randomness % 32) + 1, 1);
        randomness := randomness / 32;
        -- Add more randomness if needed
        IF i % 4 = 0 THEN
            randomness := randomness + (random() * 1000000)::BIGINT;
        END IF;
    END LOOP;
    
    RETURN output;
END
$$ LANGUAGE plpgsql VOLATILE;
