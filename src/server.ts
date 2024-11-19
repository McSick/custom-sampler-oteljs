import express, { Express, Request, Response } from 'express';
import { trace, Span } from '@opentelemetry/api';
const app: Express = express();
const port = 4005;
const tracer = trace.getTracer('manual-tracer');
// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  tracer.startSpan('SomeCoolEvent', { attributes: { "SampleRate": 1, "SomeOtherAttribute": "SomeOtherValue" } } ).end(); 
  res.json({ message: 'Hello from TypeScript Express!' });
});

// Example POST route
app.post('/api/data', (req: Request, res: Response) => {
  const data = req.body;
  res.json({
    message: 'Data received',
    data: data
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 