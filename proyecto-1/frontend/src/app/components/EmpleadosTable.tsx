'use client';

import { useState } from 'react';

interface Empleado {
  id: number;
  nombre: string;
  salario: number;
}

export default function EmpleadosTable({ empleados }: { empleados: Empleado[] }) {
  const [visible, setVisible] = useState(10);

  return (
    <>
      <table className="border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">id</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Salario</th>
          </tr>
        </thead>
        <tbody>
          {empleados.slice(0, visible).map((empleado) => (
            <tr key={empleado.id}>
              <td className="border px-4 py-2 text-center">{empleado.id}</td>
              <td className="border px-4 py-2">{empleado.nombre}</td>
              <td className="border px-4 py-2 text-right">{empleado.salario}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible < empleados.length && (
        <div className="mt-4 flex justify-center">
          <button
            className="border p-2 bg-gray-500 text-white"
            onClick={() => setVisible(empleados.length)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
