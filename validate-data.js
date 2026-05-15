const fs = require('fs');

try {
  console.log('🔍 Validando archivos JSON...\n');

  // Validar users.json
  const usersRaw = fs.readFileSync('./data/users.json', 'utf-8');
  const users = JSON.parse(usersRaw);
  console.log('✅ users.json es JSON válido');
  console.log(`   - ${users.length} usuarios`);
  users.forEach((u) => {
    console.log(`     • ID ${u.id}: ${u.firstName} ${u.lastName} (${u.role}) - ${u.email}`);
  });

  // Validar products.json
  console.log();
  const productsRaw = fs.readFileSync('./data/products.json', 'utf-8');
  const products = JSON.parse(productsRaw);
  console.log('✅ products.json es JSON válido');
  console.log(`   - ${products.length} productos`);
  products.forEach((p) => {
    console.log(`     • ID ${p.id}: ${p.name} ($${p.price}) - Stock: ${p.stock}`);
  });

  console.log('\n✅ VALIDACIÓN COMPLETADA - TODOS LOS ARCHIVOS SON CORRECTOS');
} catch (error) {
  console.error('❌ ERROR:', error.message);
  process.exit(1);
}
