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

/** OUTPUT params from `execute()` are on `result.output`, not on `request.parameters[].value`. */
function readOutResultCode(output: Record<string, unknown> | undefined): number | undefined {
  if (!output) return undefined;
  const raw = output.outResultCode ?? output.OutResultCode;
  if (raw == null) return undefined;
  return typeof raw === 'number' ? raw : Number(raw);
}

export async function getEmpleados(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getConnection();
    const request = pool.request();
    request.output('outResultCode', sql.Int);
    const result = await request.execute('sp_list_empleados');
    const code = readOutResultCode(result.output as Record<string, unknown>);

    if (code !== 0) {
      res.status(500).json({ error: 'Error al obtener empleados.' });
      return;
    }

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
    request.input('inNombre', sql.VarChar(128), nombre);
    request.input('inSalario', sql.Decimal(19, 4), salario);
    request.output('outResultCode', sql.Int);

    const insertResult = await request.execute('sp_insert_empleado');
    const resultValue = readOutResultCode(insertResult.output as Record<string, unknown>);

    if (resultValue === -1) {
      res.status(400).json({ message: 'Nombre de Empleado ya existe.' });
      return;
    }

    if (resultValue !== 0) {
      const errMsg =
        resultValue !== undefined && resultValue > 50000
          ? 'Error en el servidor al insertar empleado.'
          : 'Error desconocido al insertar empleado.';
      res.status(500).json({ error: errMsg });
      return;
    }

    res.status(200).json({ message: 'Empleado insertado correctamente' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al insertar empleado.';
    res.status(500).json({ error: message });
  }
}
