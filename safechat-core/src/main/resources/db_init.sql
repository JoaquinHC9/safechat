CREATE TABLE rol (
                     id_rol INT AUTO_INCREMENT PRIMARY KEY,
                     nombre VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
                         id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                         nombre VARCHAR(255),
                         apellido VARCHAR(255),
                         email VARCHAR(255) UNIQUE,
                         password VARCHAR(255),
                         telefono VARCHAR(255) UNIQUE,
                         fecha_nacimiento DATE
);

CREATE TABLE usuario_rol (
                             id_usuario INT NOT NULL,
                             id_rol INT NOT NULL,
                             PRIMARY KEY (id_usuario, id_rol),
                             FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                             FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);

CREATE TABLE mensajes (
                          id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
                          id_usuario INT NULL,
                          contenido TEXT NOT NULL,
                          tipo_mensaje VARCHAR(50) DEFAULT 'SMS',
                          fuente VARCHAR(100),
                          estado VARCHAR(50) DEFAULT 'pendiente',
                          remitente VARCHAR(150),
                          recibido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE modelos (
                         id_modelo INT AUTO_INCREMENT PRIMARY KEY,
                         nombre_modelo VARCHAR(100) NOT NULL,
                         version VARCHAR(50),
                         precision_score DECIMAL(5,2),
                         f1_score DECIMAL(5,2),
                         creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predicciones (
                              id_prediccion INT AUTO_INCREMENT PRIMARY KEY,
                              id_mensaje INT,
                              id_modelo INT,
                              etiqueta_prediccion VARCHAR(50) NOT NULL,
                              confianza DECIMAL(5,2),
                              analizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje) ON DELETE CASCADE,
                              FOREIGN KEY (id_modelo) REFERENCES modelos(id_modelo)
);

CREATE TABLE atacante (
                          id_atacante INT AUTO_INCREMENT PRIMARY KEY,
                          valor VARCHAR(150) UNIQUE NOT NULL,
                          tipo ENUM('correo', 'telefono', 'dominio') NOT NULL,
                          reputacion DECIMAL(5, 2) DEFAULT 0.0,
                          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lista_negra (
                             id_lista_negra INT AUTO_INCREMENT PRIMARY KEY,
                             id_usuario INT,
                             id_atacante INT,
                             motivo TEXT,
                             creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             UNIQUE (id_usuario, id_atacante),
                             FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                             FOREIGN KEY (id_atacante) REFERENCES atacante(id_atacante) ON DELETE CASCADE
);

CREATE TABLE datos_entrenamiento (
                                     id_muestra INT AUTO_INCREMENT PRIMARY KEY,
                                     texto_muestra TEXT NOT NULL,
                                     etiqueta VARCHAR(50) NOT NULL,
                                     conjunto_origen VARCHAR(100),
                                     idioma VARCHAR(10) DEFAULT 'es',
                                     creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ataques_detectados (
                                    id_ataque INT AUTO_INCREMENT PRIMARY KEY,
                                    id_mensaje INT,
                                    tipo_amenaza VARCHAR(50) NOT NULL,
                                    nivel_riesgo ENUM('Bajo','Medio','Alto') NOT NULL,
                                    detectado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    confirmado BOOLEAN DEFAULT FALSE,
                                    FOREIGN KEY (id_mensaje) REFERENCES mensajes(id_mensaje) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_mensajes_id_usuario ON mensajes (id_usuario);
CREATE INDEX idx_mensajes_tipo_mensaje ON mensajes (tipo_mensaje);
CREATE INDEX idx_mensajes_recibido_en ON mensajes (recibido_en);

CREATE INDEX idx_lista_negra_atacante ON lista_negra (id_atacante);

CREATE INDEX idx_ataques_tipo ON ataques_detectados (tipo_amenaza);
CREATE INDEX idx_ataques_nivel_riesgo ON ataques_detectados (nivel_riesgo);
CREATE INDEX idx_ataques_detectado_en ON ataques_detectados (detectado_en);