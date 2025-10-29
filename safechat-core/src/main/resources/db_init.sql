CREATE TABLE rol
(
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

CREATE TABLE usuario
(
    id_usuario       SERIAL PRIMARY KEY,
    nombre           VARCHAR(255),
    apellido         VARCHAR(255),
    email            VARCHAR(255) UNIQUE,
    password         VARCHAR(255),
    telefono         VARCHAR(255) UNIQUE,
    fecha_nacimiento DATE
);

CREATE TABLE usuario_rol
(
    id_usuario INTEGER NOT NULL,
    id_rol     INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES rol (id_rol) ON DELETE CASCADE
);

CREATE TABLE mensajes
(
    id_mensaje   SERIAL PRIMARY KEY,
    id_usuario   INT  REFERENCES usuario (id_usuario) ON DELETE SET NULL,
    contenido    TEXT NOT NULL,
    tipo_mensaje VARCHAR(50) DEFAULT 'SMS', -- SMS, CORREO, URL
    fuente       VARCHAR(100),              -- ejemplo: app, navegador, etc.
    estado       VARCHAR(50) DEFAULT 'pendiente',
    remitente    VARCHAR(150),
    recibido_en  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE modelos
(
    id_modelo     SERIAL PRIMARY KEY,
    nombre_modelo VARCHAR(100) NOT NULL, -- ejemplo: BERT_GPT3_ensemble
    version       VARCHAR(50),
    precision     NUMERIC(5, 2),
    f1_score      NUMERIC(5, 2),
    creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predicciones
(
    id_prediccion       SERIAL PRIMARY KEY,
    id_mensaje          INT REFERENCES mensajes (id_mensaje) ON DELETE CASCADE,
    id_modelo           INT REFERENCES modelos (id_modelo),
    etiqueta_prediccion VARCHAR(50) NOT NULL, -- "phishing", "legitimo", "sospechoso"
    confianza           NUMERIC(5, 2),        -- porcentaje de confianza
    analizado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE atacante
(
    id_atacante SERIAL PRIMARY KEY,
    valor       VARCHAR(150) UNIQUE NOT NULL, -- correo, número o dominio
    tipo        VARCHAR(20) CHECK (tipo IN ('correo', 'telefono', 'dominio')),
    reputacion  NUMERIC(5, 2) DEFAULT 0.0,    -- score de riesgo o reputación
    creado_en   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lista_negra
(
    id_lista_negra SERIAL PRIMARY KEY,
    id_usuario     INT REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    id_atacante    INT REFERENCES atacante (id_atacante) ON DELETE CASCADE,
    motivo         TEXT,
    creado_en      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_usuario, id_atacante)
);

CREATE TABLE datos_entrenamiento
(
    id_muestra      SERIAL PRIMARY KEY,
    texto_muestra   TEXT        NOT NULL,
    etiqueta        VARCHAR(50) NOT NULL, -- phishing, legitimo
    conjunto_origen VARCHAR(100),
    idioma          VARCHAR(10) DEFAULT 'es',
    creado_en       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ataques_detectados
(
    id_ataque    SERIAL PRIMARY KEY,
    id_mensaje   INT REFERENCES mensajes (id_mensaje) ON DELETE CASCADE,
    tipo_amenaza VARCHAR(50) NOT NULL, -- phishing, malware, suplantacion...
    nivel_riesgo VARCHAR(20) CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto')),
    detectado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmado   BOOLEAN   DEFAULT FALSE
);

-- Búsquedas por usuario (para mostrar mensajes de un usuario)
CREATE INDEX idx_mensajes_id_usuario ON mensajes (id_usuario);

-- Filtros o estadísticas por tipo de mensaje (SMS, correo, URL)
CREATE INDEX idx_mensajes_tipo_mensaje ON mensajes (tipo_mensaje);

-- Consultas por fecha de recepción
CREATE INDEX idx_mensajes_recibido_en ON mensajes (recibido_en DESC);

CREATE INDEX idx_lista_negra_valor_tipo ON lista_negra (valor, tipo);

CREATE INDEX idx_ataques_tipo ON ataques_detectados (tipo_amenaza);
CREATE INDEX idx_ataques_nivel_riesgo ON ataques_detectados (nivel_riesgo);
CREATE INDEX idx_ataques_detectado_en ON ataques_detectados (detectado_en DESC);
