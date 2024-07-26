-- CREATE TABLE user (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE session (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
--     session_type VARCHAR(20) CHECK (
--         session_type IN ('work', 'short_break', 'long_break')
--     ),
--     start_time TIMESTAMP NOT NULL,
--     end_time TIMESTAMP,
--     status VARCHAR(20) CHECK (status IN ('active', 'paused', 'completed')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE configuration (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
--     work_interval INTEGER DEFAULT 25 NOT NULL,
--     short_break INTEGER DEFAULT 5 NOT NULL,
--     long_break INTEGER DEFAULT 15 NOT NULL,
--     long_break_interval INTEGER DEFAULT 4 NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
INSERT INTO user (
        username,
        email,
        password_hash,
        created_at,
        updated_at
    )
VALUES (
        'testuser1',
        'testuser1@example.com',
        'passwordhash1',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser2',
        'testuser2@example.com',
        'passwordhash2',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser3',
        'testuser3@example.com',
        'passwordhash3',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser4',
        'testuser4@example.com',
        'passwordhash4',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'testuser5',
        'testuser5@example.com',
        'passwordhash5',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
-- INSERT INTO configuration (
--         user_id,
--         work_interval,
--         short_break,
--         long_break,
--         long_break_interval
--     )
-- VALUES (1, 25, 5, 15, 1),
--     -- For testuser1
--     (2, 30, 5, 10, 2),
--     -- For testuser2
--     (3, 50, 10, 20, 3),
--     -- For testuser3
--     (4, 20, 5, 25, 4),
--     -- For testuser4
--     (5, 45, 15, 30, 5);
-- -- For testuser5