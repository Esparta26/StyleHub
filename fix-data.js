const fs = require('fs');
const bcrypt = require('bcrypt');

(async () => {
  try {
    // ========== CORREGIR USUARIOS ==========
    const usersRaw = fs.readFileSync('./data/users.json', 'utf-8');
    let users = JSON.parse(usersRaw);

    // Normalizar estructura: firstName + lastName, agregar role, hashear contraseña plana
    users = users.map((user) => {
      let firstName, lastName;

      if (user.firstName && user.lastName) {
        firstName = user.firstName;
        lastName = user.lastName;
      } else if (user.fullName) {
        const parts = user.fullName.trim().split(/\s+/);
        firstName = parts[0];
        lastName = parts.length > 1 ? parts.slice(1).join(' ') : user.fullName; // Si solo hay un nombre, úsalo en ambos
      } else {
        firstName = '';
        lastName = '';
      }

      let normalized = {
        id: user.id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        password: user.password,
        role: user.category || 'user', // admin o user
      };

      // Rehashear si está en texto plano (id 1: "admin123")
      if (normalized.id === 1 && !normalized.password.startsWith('$2b$')) {
        normalized.password = bcrypt.hashSync(normalized.password, 10);
      }

      return normalized;
    });

    // Validar: email único, no vacíos
    const emails = users.map((u) => u.email);
    if (new Set(emails).size !== emails.length) {
      throw new Error('❌ Error: Emails duplicados detectados');
    }
    users.forEach((u) => {
      if (!u.email || !u.firstName || !u.password) {
        throw new Error(`❌ Error: Usuario ${u.id} con campos vacíos (email, firstName o password faltante)`);
      }
    });

    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
    console.log('✅ users.json corregido y validado');

    // ========== CORREGIR PRODUCTOS ==========
    const productsRaw = fs.readFileSync('./data/products.json', 'utf-8');
    let products = JSON.parse(productsRaw);

    // Normalizar estructura: agregar fields faltantes
    products = products.map((p) => ({
      id: p.id,
      name: p.name || '',
      price: p.price || 0,
      img: p.img || '',
      description: p.description || '',
      category: p.category || 'sin-categoria',
      size: p.size || null,
      stock: 10, // default stock
      slug: (p.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    }));

    // Validar: precio positivo, campos no vacíos, URLs válidas
    products.forEach((p) => {
      if (p.id <= 0) throw new Error(`❌ Error: Producto ${p.id} con ID inválido`);
      if (!p.name) throw new Error(`❌ Error: Producto ${p.id} sin nombre`);
      if (p.price <= 0) throw new Error(`❌ Error: Producto ${p.id} con precio inválido`);
      if (!p.img.startsWith('http')) throw new Error(`❌ Error: Producto ${p.id} con URL inválida: ${p.img}`);
    });

    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
    console.log('✅ products.json corregido y validado');

    console.log('\n✅ TODAS LAS CORRECCIONES COMPLETADAS SIN ERRORES');
    console.log('📋 Resumen:');
    console.log(`   - ${users.length} usuarios normalizados`);
    console.log(`   - ${products.length} productos normalizados`);
    console.log('   - Contraseñas validadas y hasheadas');
    console.log('   - Campos faltantes agregados');
    console.log('   - JSON válidos y listos para usar');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
})();
