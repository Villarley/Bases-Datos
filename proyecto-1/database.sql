-- BD I - script de la primera tarea (empresa + SPs)

IF NOT EXISTS
(
    SELECT
        1
    FROM
        sys.databases AS D
    WHERE
        (
            D.name = N'EmpresaDB'
        )
)
BEGIN
    CREATE DATABASE EmpresaDB;
END;
GO

-- Se hace uso de la base de datos antes de crear las tablas.
USE EmpresaDB;
GO

-- borro SPs primero porque sino a veces da problema al dropear la tabla (documentado en una bitácora)
IF OBJECT_ID(N'dbo.sp_list_empleados', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_list_empleados;
GO

IF OBJECT_ID(N'dbo.sp_insert_empleado', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_insert_empleado;
GO

IF OBJECT_ID(N'dbo.Empleado', N'U') IS NOT NULL
    DROP TABLE dbo.Empleado;
GO

IF OBJECT_ID(N'dbo.DBErrors', N'U') IS NOT NULL
    DROP TABLE dbo.DBErrors;
GO

-- tabla del enunciado (solo empleado)
CREATE TABLE dbo.Empleado
(
    id INT IDENTITY(1, 1) PRIMARY KEY
    , Nombre VARCHAR(128) NOT NULL
    , Salario MONEY NOT NULL
);
GO

-- errors de sql server, la inserta el catch
CREATE TABLE dbo.DBErrors
(
    id INT IDENTITY(1, 1) PRIMARY KEY
    , Fecha DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    , NumeroError INT NOT NULL
    , Severidad INT NULL
    , Estado INT NULL
    , Procedimiento NVARCHAR(128) NULL
    , Linea INT NULL
    , Mensaje NVARCHAR(4000) NOT NULL
);
GO

-- datos inventados pero son 40+ como pidió la tarea
INSERT INTO dbo.Empleado
(
    Nombre
    , Salario
)
VALUES
    (N'Adriana Solano', 265000)
    , (N'Ana Torres', 280000)
    , (N'Andres Mena', 305000)
    , (N'Beatriz Rojas', 275000)
    , (N'Camila Vega', 288000)
    , (N'Carlos Gomez', 250000)
    , (N'Carmen Izquierdo', 292000)
    , (N'Cesar Aguilar', 318000)
    , (N'Daniel Castro', 310000)
    , (N'Diego Fonseca', 322000)
    , (N'Elena Paredes', 270000)
    , (N'Esteban Arias', 334000)
    , (N'Felipe Duarte', 300000)
    , (N'Fernanda Rios', 285000)
    , (N'Gabriel Salas', 315000)
    , (N'Gloria Campos', 268000)
    , (N'Hector Mendez', 340000)
    , (N'Ingrid Chaves', 276000)
    , (N'Isabel Granados', 299000)
    , (N'Javier Orozco', 328000)
    , (N'Juan Perez', 200000)
    , (N'Julia Esquivel', 282000)
    , (N'Laura Jimenez', 290000)
    , (N'Luis Vargas', 320000)
    , (N'Manuel Brenes', 308000)
    , (N'Maria Lopez', 300000)
    , (N'Mario Piedra', 312000)
    , (N'Monica Zuniga', 277000)
    , (N'Natalia Sibaja', 286000)
    , (N'Nicolas Arias', 325000)
    , (N'Olga Calderon', 262000)
    , (N'Oscar Ulloa', 303000)
    , (N'Patricia Monge', 294000)
    , (N'Paula Cerdas', 291000)
    , (N'Pedro Ruiz', 350000)
    , (N'Ricardo Cubero', 318000)
    , (N'Rodrigo Mora', 306000)
    , (N'Sergio Alpizar', 296000)
    , (N'Sofia Ramirez', 270000)
    , (N'Valeria Mora', 330000);
GO

-- este lo usa el backend para llenar el grid
CREATE PROCEDURE dbo.sp_list_empleados
    @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            E.id
            , E.Nombre
            , E.Salario
        FROM
            dbo.Empleado AS E
        ORDER BY
            E.Nombre ASC;

        SET @outResultCode = 0;
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.DBErrors
        (
            NumeroError
            , Severidad
            , Estado
            , Procedimiento
            , Linea
            , Mensaje
        )
        VALUES
        (
            ERROR_NUMBER()
            , ERROR_SEVERITY()
            , ERROR_STATE()
            , ERROR_PROCEDURE()
            , ERROR_LINE()
            , ERROR_MESSAGE()
        );

        SET @outResultCode =
            CASE
                WHEN (ERROR_NUMBER() > 50000) THEN ERROR_NUMBER()
                ELSE (50000 + ERROR_NUMBER())
            END;
    END CATCH;
END;
GO

-- insert desde la app; -1 = nombre repetido, 0 = bien, si hay error raro cae al catch
CREATE PROCEDURE dbo.sp_insert_empleado
    @inNombre VARCHAR(128)
    , @inSalario MONEY
    , @outResultCode INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- revisar duplicado antes de la transaccion
    IF EXISTS
    (
        SELECT
            1
        FROM
            dbo.Empleado AS E
        WHERE
            (
                E.Nombre = @inNombre
            )
    )
    BEGIN
        SET @outResultCode = -1;

        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.Empleado
        (
            Nombre
            , Salario
        )
        VALUES
        (
            @inNombre
            , @inSalario
        );

        COMMIT TRANSACTION;

        SET @outResultCode = 0;
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRANSACTION;

        INSERT INTO dbo.DBErrors
        (
            NumeroError
            , Severidad
            , Estado
            , Procedimiento
            , Linea
            , Mensaje
        )
        VALUES
        (
            ERROR_NUMBER()
            , ERROR_SEVERITY()
            , ERROR_STATE()
            , ERROR_PROCEDURE()
            , ERROR_LINE()
            , ERROR_MESSAGE()
        );

        SET @outResultCode =
            CASE
                WHEN (ERROR_NUMBER() > 50000) THEN ERROR_NUMBER()
                ELSE (50000 + ERROR_NUMBER())
            END;
    END CATCH;
END;
GO
