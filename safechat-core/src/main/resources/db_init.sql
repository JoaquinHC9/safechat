CREATE TABLE rol (
                     id_rol SERIAL PRIMARY KEY,
                     nombre VARCHAR(255) NOT NULL
);
CREATE TABLE usuario (
                         id_usuario SERIAL PRIMARY KEY,
                         nombre VARCHAR(255),
                         apellido VARCHAR(255),
                         email VARCHAR(255) UNIQUE,
                         password VARCHAR(255),
                         telefono VARCHAR(255) UNIQUE,
                         fecha_nacimiento DATE
);
CREATE TABLE usuario_rol (
                             id_usuario INTEGER NOT NULL,
                             id_rol INTEGER NOT NULL,
                             PRIMARY KEY (id_usuario, id_rol),
                             FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                             FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);
