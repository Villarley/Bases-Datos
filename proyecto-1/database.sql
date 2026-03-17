CREATE PROCEDURE sp_list_empleados
AS
BEGIN
    SELECT id, Nombre, Salario
    FROM dbo.Empleado
    ORDER BY Nombre ASC;
END;
GO

CREATE PROCEDURE sp_insert_empleado
    @Nombre VARCHAR(128),
    @Salario MONEY,
    @Result INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM dbo.Empleado WHERE Nombre = @Nombre)
        SET @Result = -1;
    ELSE
    BEGIN
        INSERT INTO dbo.Empleado (Nombre, Salario) VALUES (@Nombre, @Salario);
        SET @Result = 0;
    END
END;
GO