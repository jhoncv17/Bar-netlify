# 🍺 Beer Store - Sistema de Gestión de Ventas

Sistema web moderno para gestión de inventario y ventas de cerveza Pilsen y Heineken. Desarrollado con HTML5, CSS3 (Tailwind CSS) y JavaScript vanilla con persistencia de datos mediante localStorage.

![Beer Store Banner](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🚀 Características

### Gestión de Inventario
- ✅ Control de stock de Pilsen y Heineken
- ✅ Registro por unidades individuales
- ✅ Registro por cajas (12 unidades cada una)
- ✅ Actualización en tiempo real del inventario
- ✅ Interfaz intuitiva con tarjetas diferenciadas por color

### Sistema de Ventas
- 💰 Registro de ventas por unidad o por caja
- 💰 Cálculo automático del total
- 💰 Preview en tiempo real del monto a cobrar
- 💰 Validación de stock disponible
- 💰 Confirmación visual de ventas exitosas

### Historial y Reportes
- 📊 Historial completo de todas las ventas
- 📊 Totales de ventas del día actual
- 📊 Total general de ventas acumuladas
- 📊 Contador de ventas realizadas
- 📊 Exportación a formato CSV
- 📊 Función de limpieza de historial

### Persistencia de Datos
- 💾 Almacenamiento local con localStorage
- 💾 Los datos persisten al recargar la página
- 💾 No requiere base de datos externa
- 💾 Compatible con cualquier hosting estático

## 🎨 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con efectos glass morphism
- **Tailwind CSS** - Framework de utilidades CSS
- **JavaScript (ES6+)** - Lógica de negocio
- **LocalStorage API** - Persistencia de datos

## 📁 Estructura del Proyecto

```
beer-store/
│
├── index.html          # Estructura principal de la aplicación
├── style.css           # Estilos personalizados y efectos visuales
├── script.js           # Lógica de negocio y manejo de datos
└── README.md           # Documentación del proyecto
```

## 🔧 Instalación y Uso

### Opción 1: Uso Local

1. **Clona o descarga el repositorio**
   ```bash
   git clone https://github.com/tuusuario/beer-store.git
   cd beer-store
   ```

2. **Abre el archivo index.html**
   - Doble clic en el archivo `index.html`
   - O abre con tu navegador favorito
   - ¡Listo para usar!

### Opción 2: Despliegue en Netlify

1. **Desde el sitio web de Netlify:**
   - Ve a [netlify.com](https://www.netlify.com/)
   - Arrastra la carpeta del proyecto a la zona de drop
   - ¡Tu sitio estará en línea en segundos!

2. **Desde GitHub:**
   - Sube el proyecto a un repositorio de GitHub
   - Conecta tu repositorio con Netlify
   - Netlify desplegará automáticamente

### Opción 3: Otros Hostings

Compatible con cualquier servicio de hosting estático:
- GitHub Pages
- Vercel
- Firebase Hosting
- Surge.sh

## 📖 Guía de Uso

### 1️⃣ Gestionar Inventario

1. Ve a la pestaña **"Inventario"**
2. Selecciona el producto (Pilsen o Heineken)
3. Ingresa la cantidad de unidades o cajas
4. Haz clic en **"Agregar Stock"**

### 2️⃣ Registrar Ventas

1. Ve a la pestaña **"Ventas"**
2. Selecciona el producto
3. Elige el tipo de venta (Por Unidad o Por Caja)
4. Ingresa la cantidad
5. Ingresa el precio
6. Observa el preview del total
7. Haz clic en **"Registrar Venta"**

### 3️⃣ Ver Historial

1. Ve a la pestaña **"Historial"**
2. Visualiza todas las ventas registradas
3. Revisa los totales del día y general
4. Exporta a CSV si lo necesitas
5. Limpia el historial cuando sea necesario

## 🎯 Características Técnicas

### Diseño Responsivo
- Mobile-first design
- Adaptable a tablets y escritorio
- Breakpoints optimizados

### Efectos Visuales
- Glass morphism effect
- Gradientes modernos
- Animaciones suaves
- Transiciones fluidas
- Hover effects interactivos

### Validaciones
- ✓ Stock insuficiente
- ✓ Campos vacíos
- ✓ Valores negativos
- ✓ Cantidades inválidas

### Notificaciones
- Toast notifications
- Feedback visual inmediato
- Diferentes tipos (éxito, error, advertencia)

## 🔐 Seguridad y Privacidad

- Los datos se almacenan únicamente en el navegador del usuario
- No hay transmisión de datos a servidores externos
- Compatible con modo offline
- Respaldo manual mediante exportación CSV

## 🌐 Navegadores Compatibles

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📊 Limitaciones

- Almacenamiento limitado a ~5-10MB (límite de localStorage)
- Los datos se pierden si se limpia la caché del navegador
- No hay sincronización entre dispositivos
- Un solo usuario por navegador

## 🛠️ Personalización

### Cambiar Colores

Edita las variables en `style.css`:

```css
/* Ejemplo: Cambiar color del gradiente principal */
background: linear-gradient(135deg, #tu-color-1 0%, #tu-color-2 100%);
```

### Agregar Más Productos

1. Actualiza el objeto `inventory` en `script.js`
2. Agrega las tarjetas correspondientes en `index.html`
3. Actualiza los selectores de productos

### Modificar Capacidad de Cajas

Cambia la constante en `script.js`:

```javascript
const BEERS_PER_BOX = 12; // Cambia este valor
```

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que localStorage esté habilitado en tu navegador
- Comprueba que no estés en modo incógnito/privado

### La exportación CSV no funciona
- Asegúrate de que el navegador permita descargas
- Verifica que tengas ventas registradas

### La interfaz no se ve bien
- Limpia la caché del navegador
- Verifica que Tailwind CSS se cargue correctamente

## 📝 Changelog

### v1.0.0 (2025)
- ✨ Lanzamiento inicial
- 🎨 Interfaz moderna con glass morphism
- 💾 Sistema de persistencia con localStorage
- 📊 Sistema de reportes y exportación
- 🔔 Sistema de notificaciones

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Jhosmar Cuzco**

- GitHub: [@jhoncv17](https://github.com/jhoncv17)

## 🙏 Agradecimientos

- Tailwind CSS por el framework de utilidades
- Comunidad de desarrolladores web
- Todos los que contribuyen al proyecto

---

### 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:
- Abrir un issue en GitHub
- Contactar al autor

### ⭐ ¿Te gusta el proyecto?

Si este proyecto te ha sido útil, considera darle una estrella ⭐ en GitHub.

---

**© 2025 Jhosmar Cuzco. Todos los derechos reservados.**