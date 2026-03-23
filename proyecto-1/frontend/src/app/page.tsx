export default function Home() {

  const empleados = [
    { id: 1, nombre: "Test", salario: 1200 },
    { id: 2, nombre: "Test", salario: 1500 },
    { id: 3, nombre: "Probando", salario: 1800 },
  ];

  return (
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-bold text-4xl pt-10">Lista de Empleados</h1>
        {/* Tabla de empleados  */}
        <div className="my-6">
          <table className="border border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">id</th>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Salario</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td className="border px-4 py-2 text-center">{empleado.id}</td>
                  <td className="border px-4 py-2">{empleado.nombre}</td>
                  <td className="border px-4 py-2 text-right">{empleado.salario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón para insertar */}
        <a href='/insertar' className="border p-2">
          Insertar
        </a>
      </main>
  );
}
