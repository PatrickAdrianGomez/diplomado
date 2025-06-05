const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('¡Hola Mundo Express!');
});
app.get('/about', (req, res) => {
  res.send('Esta es la página de información.');
});
app.get('/contact', (req, res) => {
  res.send('Esta es la página de contacto.');
});
app.get('/contact', (req, res) => {
  res.send('Esta es la página de contacto. pero aquí nunca llegará por que ya hay un manejador para /contact');
});

// EJEMPLOS CON GET por convención, debería de usarse plural y nombres en inglés y en minúsculas y entendibles
app.get('/users', (req, res) => {
  //res.send('Lista de usuarios');
  res.json([
    { id: 1, name: 'Juan' },
    { id: 2, name: 'Ana' },
    { id: 3, name: 'Pedro' }
  ]);
});
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Información del usuario con ID: ${userId}`);
});
//ejemplo de get con varios parámetros
app.get('/users/:userId/profile/:profileId', (req, res) => {
    const userId = req.params.userId;
    const profileId = req.params.profileId;
    res.send(`Perfil del usuario con ID: ${userId} y perfil ID: ${profileId}`);
});

app.post('/submit', (req, res) => {
  res.send('Formulario enviado correctamente.');
});
app.put('/update', (req, res) => {
  res.send('Datos actualizados correctamente.');
});
app.delete('/delete', (req, res) => {
    res.send('Datos eliminados correctamente.');
});
app.patch('/modify', (req, res) => {
  res.send('Datos modificados correctamente.');
});
app.use(express.json());

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});