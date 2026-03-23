# Historial de Prompts — LZ Tech Store

Registro de todas las interacciones realizadas durante el desarrollo del proyecto.
Formato: **Prompt** → Acción realizada.

---

## #01 — Instalación de dependencias
**Prompt:** `npm install`
**Acción:** Se ejecutó `npm install` en el directorio raíz. El `package.json` no estaba en la raíz sino en la subcarpeta `lztech-store/`. Se detectó y se ejecutó correctamente en la ruta correcta. 42 paquetes instalados, 0 vulnerabilidades.

---

## #02 — Encender servidor de desarrollo
**Prompt:** `npm run dev`
**Acción:** Se inició el servidor Next.js 16.2.1 con Turbopack en segundo plano. Disponible en `localhost:3000` y `192.168.0.10:3000`.

---

## #03 — Error de build: módulo no encontrado
**Prompt:** *(screenshot)* `Module not found: Can't resolve '@/components/CartDrawer'`
**Acción:** Se detectó que faltaba el archivo `jsconfig.json` que define el alias `@/` → `./src/`. Se creó `jsconfig.json` con la configuración de paths. El alias `@/*` quedó mapeado a `./src/*`.

---

## #04 — Diagrama de arquitectura
**Prompt:** `dibujame la arquitectura de la app Lz tech`
**Acción:** Se generó un diagrama ASCII completo mostrando:
- Componentes de cliente (StorePage, ProductCard, CartDrawer, CheckoutForm, ProductDetail, ProductImage)
- Rutas API del servidor (/api/products, /api/orders, /api/config)
- Capa de persistencia (db.js + archivos JSON en public/data/)
- Utilidades (fmt, uid, parseCSV)
- Flujo de checkout vía WhatsApp (wa.me)

---

## #05 — Reiniciar servidor
**Prompt:** `encender el server`
**Acción:** Se detectó que el proceso anterior había terminado. Se reinició `npm run dev` en background. Servidor listo en 2.4s.

---

## #06 — Productos vacíos desde red
**Prompt:** `desde localhost veo mis productos y desde network lo veo vacio, por que es?`
**Acción:** Se diagnosticó que Windows Firewall bloqueaba el puerto 3000 para conexiones entrantes. Los fetch a `/api/products` fallaban silenciosamente desde otros dispositivos. Se ejecutó regla de firewall para abrir el puerto 3000 (TCP, todos los perfiles). Se agregó `allowedDevOrigins: ["192.168.0.10"]` en `next.config.js` para permitir HMR desde la red.

---

## #07 — Formato CSV e importación
**Prompt:** `indicame el formato del archivo csv para subir productos a la tienda. creame un file de ejemplo para 5 productos para mujeres, con 3 imagenes cada uno`
**Acción:** Se leyó `parseCSV` en `utils.js` para confirmar el formato. Se explicaron las columnas: `nombre;descripcion;grupo;precio;stock;foto1;foto2;foto3`. Se creó `public/data/ejemplo-productos-mujer.csv` con 5 productos (Smartwatch Rosa, Auriculares Bluetooth, Secador Iónico, Selfie Ring, Parlante Waterproof) usando imágenes de Unsplash.

---

## #08 — Botón importar CSV faltante
**Prompt:** `no veo el boton "importar csv" revisar y corregirlo`
**Acción:** Se verificó que el admin (`src/app/admin/page.js`) no tenía implementada la funcionalidad de importación. Se agregó:
- Estado `importing`
- Función `handleCSV` que lee el archivo, parsea con `parseCSV`, mapea columnas al modelo de producto y hace POST a `/api/products` con `action: "bulk"`
- Botón "Importar CSV" con `<label>` + `<input type="file" className="hidden">`

---

## #09 — Corrección de comillas en CSV
**Prompt:** `Asegurar que el archivo csv generado tenga "" en el campo descripcion para todos los registros asi no rompe el formato`
**Acción:** Se actualizó `ejemplo-productos-mujer.csv` envolviendo todos los campos de descripción en comillas dobles. Las líneas 2, 3 y 5 no tenían comillas y podían romper el parser si la descripción contenía comas.

---

## #10 — Pre-validación de CSV con modal
**Prompt:** `agregar a la importacion de csv una pre validacion para mostrar como quedará el formato final de cada registro con la posibilidad de anular alguna linea si fue mal cargada y luego el boton "aceptar"`
**Acción:** Se reemplazó la importación directa por un flujo de 2 pasos:
1. Al seleccionar el archivo se parsea y se abre un modal `CSVPreviewModal`
2. El modal muestra una tabla con todos los campos (nombre, descripción, grupo, precio, stock, miniaturas de imágenes)
3. Cada fila tiene checkbox para habilitar/deshabilitar
4. Botón "Aceptar · importar N productos" solo activo si hay filas seleccionadas
5. Campos inválidos (vacíos, precio $0) se marcan en rojo

---

## #11 — Segundo archivo de prueba CSV
**Prompt:** `crear otro archivo de prueba con 3 productos nuevos`
**Acción:** Se creó `public/data/ejemplo-productos-2.csv` con 3 productos de periféricos: Teclado Mecánico RGB ($35.000), Mouse Inalámbrico Silencioso ($18.900), Monitor LED 24" Full HD ($89.000).

---

## #12 — Múltiples mejoras al panel admin
**Prompt:** *(screenshot del admin)* `realizar las siguientes modificaciones 1) agregar una columna interna fecha... 2) buscar, ordenar y filtrar productos... 3) analítica de ventas... 4) crear carpeta con historial de prompts`
**Acción:**

### 1. Campo `createdAt` en productos
- Se agrega `createdAt: new Date().toISOString()` al importar via CSV
- Se muestra columna "Subido" en la tabla de productos (formato: "23 mar. 2026")
- Productos sin fecha muestran "—"

### 2. Búsqueda, orden y filtro en tab Productos
- Barra de búsqueda por nombre, descripción y categoría
- Selector de filtro por categoría (dropdown dinámico)
- Click en cabecera de columna ordena asc/desc (↑↓)
- Columnas ordenables: Producto, Categoría, Precio, Stock, Subido
- Contador "X de Y en catálogo"

### 3. Tab Analítica
- 4 KPI cards: Ingresos totales, Ticket promedio, Unidades vendidas, Catálogo activo
- Top 5 productos por unidades vendidas (barra proporcional)
- Ingresos por categoría (barra proporcional)
- Gráfico de barras: pedidos de los últimos 7 días

### 4. Historial de prompts
- Creada carpeta `docs/`
- Archivo `docs/historial-prompts.md` con todos los prompts y acciones realizadas

---

*Última actualización: 23/03/2026*
