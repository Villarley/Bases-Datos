# Primera tarea programada – Base de Datos 1

## 1. Objetivo del proyecto

El objetivo de esta prueba de concepto es implementar una aplicación web sencilla que se conecte a una base de datos MS SQL Server y permita realizar operaciones básicas de consulta e inserción sobre una tabla de empleados.

Además, se busca ejecutar procedimientos almacenados desde la aplicación, mostrar los resultados en una interfaz tipo *grid* y manejar adecuadamente mensajes de éxito y error hacia el usuario final.

## 2. Modelo de datos

La base de datos contiene una única tabla llamada `Empleado` con la siguiente estructura lógica:

- `id`: Identificador numérico autoincremental, llave primaria.
- `Nombre`: Cadena de texto (hasta 128 caracteres), obligatorio.
- `Salario`: Campo monetario, obligatorio.

Script base de creación (adaptado del enunciado):

```sql
CREATE TABLE dbo.Empleado
(
    id INT IDENTITY (1, 1) PRIMARY KEY,
    Nombre VARCHAR(128) NOT NULL,
    Salario MONEY NOT NULL
);
```

Se cargan al menos 40 filas de prueba usando el comando INSERT, por ejemplo:

```sql
INSERT dbo.Empleado (Nombre, Salario)
VALUES ('Juan Perez', 200000.00);
```

## 3. Funcionalidad de la aplicación web

La aplicación corre en un navegador web y se conecta a un servidor de base de datos MS SQL Server (versión 2014 o superior).

### 3.1 Interfaz principal (lista de empleados)

Al iniciar la aplicación se muestra un grid con la lista de empleados almacenados en la tabla Empleado, ordenados alfabéticamente de manera ascendente por el campo Nombre.

Desde esta misma pantalla se dispone de un botón **Insertar Empleado** que permite acceder al formulario de inserción.

### 3.2 Interfaz "Insertar Empleado"

La interfaz de inserción permite capturar:

- Nombre del empleado.
- Salario del empleado.

**Validaciones en la capa de presentación:**

- El campo Nombre no puede estar vacío.
- El Nombre debe contener únicamente caracteres alfabéticos o un guion.
- El campo Salario no puede estar vacío.
- El Salario debe ser un valor monetario bien formado.

La interfaz incluye dos botones:

- **Insertar**: Ejecuta las validaciones y, si son correctas, invoca el procedimiento almacenado de inserción.
- **Regresar**: Vuelve a la interfaz principal con el grid de empleados.

### 3.3 Flujo de inserción y mensajes

El usuario llena los campos y presiona Insertar.

- Si alguna validación falla, se muestra un mensaje de error específico y no se llama al procedimiento almacenado.
- Si las validaciones son correctas, se invoca un procedimiento almacenado encargado de:
  - Verificar manualmente si ya existe un empleado con el mismo nombre y apellidos en la tabla.
  - Si ya existe, retornar un código de error.
  - Si no existe, insertar el nuevo registro con el nombre y salario indicados.
- Si la inserción es exitosa, se muestra un mensaje de inserción exitosa, se regresa a la interfaz principal y se refresca el grid para mostrar la nueva fila.
- Si el procedimiento almacenado indica un conflicto (empleado duplicado), se muestra el mensaje "Nombre de Empleado ya existe." y se regresa al formulario de inserción.

## 4. Procedimientos almacenados

Todo el acceso a datos se realiza mediante procedimientos almacenados, sin SQL incrustado directamente en la capa lógica.

Se implementan al menos dos procedimientos:

### SP de listado de empleados

- Devuelve el conjunto de registros de la tabla Empleado, ordenados alfabéticamente por Nombre.
- El resultado se "sube" a la aplicación como un dataset/recordset y se muestra en el grid de la interfaz principal.

### SP de inserción de empleado

- Recibe como parámetros `@Nombre` y `@Salario`.
- Verifica si ya existe un empleado con el mismo nombre y apellidos.
- En caso de duplicado, devuelve un código de error.
- En caso contrario, inserta el nuevo registro en la tabla Empleado y devuelve un indicador de éxito.

La aplicación debe ser capaz de interpretar el resultado de ejecución del procedimiento almacenado para determinar si la operación fue correcta o si hubo algún error.

## 5. Ambiente de desarrollo y restricciones

- **Motor de base de datos**: MS SQL Server, versión 2014 o superior.
- **Código en capa lógica**: lenguaje o framework a elección del equipo (por ejemplo, Node.js, .NET, Java, etc.).
- **Grupos de trabajo**: máximo de 2 personas.
- Todo el código que interactúa con la base de datos debe hacerlo únicamente a través de procedimientos almacenados.

## 6. Documentación requerida

Además de la implementación, se requieren dos documentos: una bitácora y un análisis de resultados.

### 6.1 Bitácora de desarrollo

**Esta es la bitácora del proyecto:** [https://www.blogger.com/blog/posts/6469658142296125468](https://www.blogger.com/blog/posts/6469658142296125468)

La bitácora se lleva en una herramienta de blogs (por ejemplo, Blogger) y debe incluir, por cada sesión de trabajo:

- Hora de inicio y hora de fin.
- Cantidad de horas trabajadas.
- Descripción de avances, problemas encontrados y cómo fueron resueltos.
- Dudas, divergencias de criterio y forma de trabajo del equipo.
- Problemas de instalación de software, aprendizaje del framework, investigaciones y pruebas de concepto.
- Mensajes de error relevantes y la forma en que se solucionaron, incluyendo versiones del código con error y la versión corregida.

La bitácora debe evidenciar un trabajo constante e incremental, demostrando que la tarea no se realizó de forma apresurada ni fue copiada.

### 6.2 Análisis de resultados

El análisis de resultados es un documento formal y profesional, cuyo objetivo es indicar qué requerimientos funcionan y cuáles no, junto con las métricas del proyecto.

Debe contener:

- Portada.
- Índice de contenido.
- Índice de figuras.
- Introducción.
- Descripción del ambiente de desarrollo, que incluya:
  - Diagrama de la arquitectura de red (ubicación del servidor de BD, IDE utilizado, etc.).
  - Diagrama de arquitectura de la aplicación, explicando el patrón de diseño, capas y tecnologías usadas.
- Análisis de resultados mediante una tabla, donde para cada elemento de la rúbrica se indique:
  - Nombre del elemento (requerimiento, artefacto, etc.).
  - Estado (implementado exitosamente o no).
  - Porcentaje de implementación.
  - Comentario sobre qué falta para llegar a 100 %, si aplica.
- Métricas del proyecto en una tabla, por ejemplo:
  - Horas trabajadas.
  - Cantidad de sesiones.
  - Líneas de código.
  - Número de commits en GitHub.
  - Cantidad de datos de prueba procesados.
  - Número de pruebas realizadas y su duración.
  - Cantidad de tablas, procedimientos almacenados, funciones, etc.

Se pueden incluir gráficos generados por GitHub u otras herramientas para enriquecer el documento, siempre referenciándolos desde el texto.

El uso de GitHub es obligatorio como evidencia de trabajo constante y colaborativo; si no se aporta evidencia de evolución del código ni de la bitácora, la calificación se basará únicamente en la documentación.

## 7. Entrega

- Entrega del sistema web funcional conectado a la base de datos SQL Server.
- Entrega de la base de datos (scripts de creación, datos de prueba y procedimientos almacenados).
- Entrega de la bitácora y el análisis de resultados conforme a los lineamientos indicados.
- **Fecha de entrega**: 25 de marzo.
