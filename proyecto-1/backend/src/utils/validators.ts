const NOMBRE_REGEX = /^[a-zA-Z\s-]+$/;

export function validateEmpleado(data: Record<string, unknown>): string | null {
  if (!data || typeof data !== 'object') {
    return 'Datos de empleado inválidos.';
  }

  const nombre = data.nombre;
  if (nombre === undefined || nombre === null) {
    return 'El campo nombre es requerido.';
  }
  if (typeof nombre !== 'string') {
    return 'El campo nombre debe ser una cadena de texto.';
  }
  if (nombre.trim() === '') {
    return 'El campo nombre no puede estar vacío.';
  }
  if (!NOMBRE_REGEX.test(nombre)) {
    return 'El nombre debe contener únicamente caracteres alfabéticos, espacios o guiones.';
  }

  const salario = data.salario;
  if (salario === undefined || salario === null) {
    return 'El campo salario es requerido.';
  }
  if (typeof salario !== 'number') {
    return 'El campo salario debe ser un número.';
  }
  if (salario <= 0) {
    return 'El salario debe ser mayor que 0.';
  }

  return null;
}
