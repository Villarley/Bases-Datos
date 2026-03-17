import { Request, Response } from 'express';
import sql from 'mssql';
import { getConnection } from '../config/db';
import { Empleado } from '../types/empleado.interface';
import { validateEmpleado } from '../utils/validators';

interface EmpleadoRow {
  id: number;
  Nombre: string;
  Salario: number;
}

function mapRowToEmpleado(row: EmpleadoRow): Empleado {
  return {
    id: row.id,
    nombre: row.Nombre,
    salario: Number(row.Salario),
  };
}

export async function getEmpleados(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('sp_list_empleados');
    const rows = (result.recordset ?? []) as EmpleadoRow[];
    const empleados: Empleado[] = rows.map(mapRowToEmpleado);
    res.json(empleados);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al obtener empleados.';
    res.status(500).json({ error: message });
  }
}

export async function createEmpleado(req: Request, res: Response): Promise<void> {
  try {
    const validationError = validateEmpleado(req.body);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const { nombre, salario } = req.body as { nombre: string; salario: number };
    const pool = await getConnection();

    const request = pool.request();
    request.input('Nombre', sql.VarChar(128), nombre);
    request.input('Salario', sql.Decimal(18, 2), salario);
    request.output('Result', sql.Int);

    await request.execute('sp_insert_empleado');

    const resultValue = request.parameters['Result']?.value as number | undefined;

    if (resultValue === -1) {
      res.status(400).json({ message: 'Nombre de Empleado ya existe.' });
      return;
    }

    res.status(200).json({ message: 'Empleado insertado correctamente' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al insertar empleado.';
    res.status(500).json({ error: message });
  }
}
