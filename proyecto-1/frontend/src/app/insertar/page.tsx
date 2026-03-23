const InsertarEmpleados = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-bold text-4xl pt-10">Insertar Empleados</h1>
      {/* Form con nombre y salario */}
      <form className="flex flex-col gap-4 my-6">
        <div className="flex flex-col">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="border px-4 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="salario">Salario</label>
          <input
            type="number"
            id="salario"
            name="salario"
            className="border px-4 py-2"
          />
        </div>
      </form>
      {/* Botones */}
      <div className="flex gap-4">
        <button className="border p-2">Insertar</button>
        <a href="/" className="border p-2">Regresar</a>
      </div>
    </div>
  );
};

export default InsertarEmpleados;
