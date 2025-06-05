console.info('Inicio de programa');

setTimeout(() => {
    console.log('Primer timeout ejecutado');
}, timeout = 1000);

setTimeout(() => {
    console.log('Segundo timeout ejecutado');
}, 0);

setTimeout(() => {
    console.log('Tercer timeout ejecutado');
}, 0);

console.log('Fin de programa');