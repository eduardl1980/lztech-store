# LZ Tech Store

Tienda e-commerce con checkout via WhatsApp.

## Setup rapido

```bash
# 1. Extraer el ZIP y entrar a la carpeta
cd lztech-store

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000       <- Tienda
# http://localhost:3000/admin <- Admin (pass: admin123)
```

## Trabajar con Claude Code

```bash
# Desde la carpeta del proyecto
claude

# Ejemplos de prompts:
# "Agrega un modal para crear/editar productos en el admin"
# "Implementa el import CSV con preview en el admin"
# "Agrega un tab de analytics con graficos de ventas"
# "Agrega un tab de stock management"
```

## Deploy a Vercel

```bash
git init
git add .
git commit -m "Initial commit"
# Crear repo en github.com, luego:
git remote add origin https://github.com/TU-USUARIO/lztech-store.git
git push -u origin main
# Ir a vercel.com, importar el repo, deploy automatico
```

## Stack
- Next.js 15 (App Router)
- Tailwind CSS 4
- API Routes con JSON file storage
- WhatsApp checkout via wa.me
