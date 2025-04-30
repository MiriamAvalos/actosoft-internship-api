const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

// Lee la clave privada desde el archivo (NO subas este archivo al repositorio)
const privateKey = fs.readFileSync('C:/Users/recepcion/Downloads/mi-par-de-claves.pem', 'utf8');

ssh.connect({
  host: '18.224.48.132', // Dirección pública de tu instancia EC2
  username: 'ec2-user',
  privateKey: privateKey, // Pasas la clave directamente como string
}).then(() => {
  console.log('✅ Conexión SSH exitosa');

  // Puedes ejecutar comandos aquí, por ejemplo:
  return ssh.execCommand('uptime');
}).then(result => {
  console.log('🖥️ Resultado del comando:', result.stdout);
  ssh.dispose(); // Cierra la conexión
}).catch((error) => {
  console.error('❌ Error al conectar SSH:', error);
});
