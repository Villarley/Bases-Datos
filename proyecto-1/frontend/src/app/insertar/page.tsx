'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const InsertarEmpleados = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [salario, setSalario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, salario: Number(salario) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Error al insertar empleado.');
        return;
      }

      router.push('/');
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-bold text-4xl pt-10">Insertar Empleados</h1>
      {/* Form con nombre y salario */}
      <form className="flex flex-col gap-4 my-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="border px-4 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="salario">Salario</label>
          <input
            type="number"
            id="salario"
            name="salario"
            className="border px-4 py-2"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {/* Botones */}
        <div className="flex gap-4 items-center justify-center">
          <button type="submit" className="border p-2 bg-green-500 text-white disabled:opacity-50" disabled={loading}>
            {loading ? 'Insertando...' : 'Insertar'}
          </button>
          <a href="/" className="border p-2 bg-red-500 text-white">Regresar</a>
        </div>
      </form>
    </div>
  );
};

export default InsertarEmpleados;
