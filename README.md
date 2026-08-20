# AgendaConecta

Directorio digital de contactos hecho con React + Vite + Tailwind.

## Rama `server-json`

En esta rama la app dejó de guardar los contactos en `localStorage` y ahora
se conecta a una API REST servida con **JSON Server**, usando los métodos
HTTP `GET`, `POST`, `PUT` y `DELETE` (ver `src/components/formulario.jsx`).

### Requisitos

- Node.js
- JSON Server (ya está en `devDependencies`; también puedes instalarlo
  globalmente con `npm install -g json-server`)

### Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Levantar el servidor de la API (puerto 3001) y el front (puerto 5173)
   al mismo tiempo:

   ```bash
   npm run dev:full
   ```

   O por separado, en dos terminales:

   ```bash
   npm run server   # json-server --watch db.json --port 3001
   npm run dev      # vite
   ```

3. Verificar que la API responde en:

   ```
   http://localhost:3001/contactos
   ```

### Endpoints usados

| Método | Acción                    | URL                        |
| ------ | -------------------------- | --------------------------- |
| GET    | Leer todos los contactos   | `GET /contactos`            |
| POST   | Agregar un contacto nuevo  | `POST /contactos`           |
| PUT    | Editar un contacto         | `PUT /contactos/:id`        |
| DELETE | Borrar un contacto         | `DELETE /contactos/:id`     |

Los datos viven en `db.json`, en la raíz del proyecto, y JSON Server los
persiste ahí automáticamente en cada cambio.
