interface Empleado {
  id: number;
  nombre: string;
  salario: number;
}

async function getEmpleados(): Promise<Empleado[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleados`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener empleados');
  return res.json();
}

export default async function Home() {
  let empleados: Empleado[] = [];
  let error: string | null = null;

  try {
    empleados = await getEmpleados();
  } catch {
    error = 'No se pudo conectar con el servidor.';
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-bold text-4xl pt-10">Lista de Empleados</h1>
      {/* Tabla de empleados */}
      <div className="my-6">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="border border-collapse">
            <thead>
              <tr className="bg-gray-200">
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
        )}
      </div>

      {/* Botón para insertar */}
      <a href="/insertar" className="border p-2 bg-green-500 text-white">
        Insertar
      </a>
    </main>
  );
}
