# MADU Inventario

## Inicio de sesión en desarrollo

1. Arranca Laravel con `php artisan serve` en `http://127.0.0.1:8000`.
2. En el frontend instala las dependencias y ejecuta `npm run dev`.
3. Entra con el nombre y la contraseña de un usuario activo de la tabla `usuarios`.

Vite dirige las solicitudes `/api` al backend local. Si el API vive en otro origen, define `VITE_API_URL` con su URL base, incluyendo `/api`, y habilita el origen del frontend en Laravel. En producción también puedes servir `/api` en el mismo dominio.

La sesión del frontend vive en memoria. Al recargar la página se vuelve a pedir el acceso. **Cerrar sesión** revoca el token actual en Laravel.

## Plantilla React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
