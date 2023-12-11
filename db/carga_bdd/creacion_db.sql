DROP DATABASE SALAS_DB;
CREATE DATABASE IF NOT EXISTS SALAS_DB; 
USE SALAS_DB;

CREATE TABLE IF NOT EXISTS USUARIO 
(
  usuario_id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_usuario ENUM('moderador', 'mauro', 'administrador') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  nombre_completo VARCHAR(100) NOT NULL,
  nombre_usuario VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS SALA 
(
  id_Sala INT AUTO_INCREMENT PRIMARY KEY,
  Ubicacion_Fisica VARCHAR(3),
  Cupo INT
);

CREATE TABLE IF NOT EXISTS PONENCIAS(
    ID_Tra VARCHAR(5),
    Area TEXT,
    Rama JSON,
    Linea TEXT,
    Compartido VARCHAR(2),
    NoPonentes INT,
    Titulo TEXT,
    ID_Pons JSON,
    Ponentes JSON,
    Instituciones JSON,
    Investigador VARCHAR(255),
    Fecha DATE,
    Dia VARCHAR(20),
    Turno VARCHAR(20),
    Bloque TEXT,
    Identificador_Salon TEXT,
    Ubicacion TEXT,
    Sede TEXT,
    Asistencia JSON DEFAULT NULL,
    Salon TEXT
);

CREATE TABLE IF NOT EXISTS MODERADORES (
    Pais TEXT,
    Institucion TEXT,
    Tipo TEXT,
    Area_Deseada TEXT,
    Area_Alternativa TEXT,
    ID_Mod VARCHAR(5),
    Moderador TEXT,
    Sexo TEXT,
    Correo TEXT,
    Celular TEXT,
    Sala TEXT,
    Correo_Alternativo TEXT,
    Sala2 TEXT
);

CREATE VIEW Ring_Graph AS
SELECT AREA, COUNT(AREA) AS NoDeAreas 
FROM PONENCIAS GROUP BY AREA;

CREATE VIEW RG_Fechas AS
SELECT Dia, COUNT(Dia) AS NoDias
FROM PONENCIAS 
GROUP BY Dia;

CREATE VIEW TABLA_USUARIOS AS 
SELECT ID_Tra ,NoPonentes,Ponentes,ID_Pons FROM PONENCIAS;

CREATE VIEW RG_x_Sedes AS 
SELECT SEDE, COUNT(SEDE) AS NoDeSedes 
FROM PONENCIAS GROUP BY SEDE; 

CREATE VIEW USUARIOS_POR_SALAS AS 
SELECT ID_Tra, NoPonentes, Ponentes, ID_Pons, Salon FROM PONENCIAS;

CREATE VIEW TABLA_MODERADORES AS 
SELECT ID_Mod, Moderador, Institucion FROM MODERADORES;

INSERT INTO USUARIO (tipo_usuario, password_hash, email, nombre_completo, nombre_usuario)
VALUES ('moderador', '$argon2id$v=19$m=65536,t=3,p=4$kPCKj/5bo4LfdlJrNHCSHg$xOVrwxe0bYeR1dg47uJmZvOw8/gcmxP+xsnLimKaKpg', 'mauro@example.com', 'Mauro', 'mauro');

