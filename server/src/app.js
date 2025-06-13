import express from 'express';
const app=express()
import { Userouter } from './routes/userroutes.js';

app.use(express.json()); // to parse JSON body
app.use('/api/users', Userouter);

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
