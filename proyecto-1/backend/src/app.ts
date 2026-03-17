import express from 'express';
import cors from 'cors';
import empleadoRoutes from './routes/empleado.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/empleados', empleadoRoutes);

export default app;
