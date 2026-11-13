# Commits Rules & Branches Rules

## FRONTED_MADU-MANAGEMENT

Este documento establece las reglas de nomenclatura de commits y ramas para todos los colaboradores del repositorio. El objetivo es mantener un historial claro, consistente y fácil de revisar, así como facilitar la colaboración entre los integrantes del equipo.

## 1. Formato de los commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) con el siguiente formato obligatorio para el equipo:

```text
tipo(alcance): descripcion
```

- `tipo`: indica la naturaleza del cambio.
- `alcance`: identifica el módulo, componente o área afectada.
- `descripcion`: explica de manera breve qué se hizo.

Ejemplo:

```text
feat(auth): agregar formulario de inicio de sesion
```

## 2. Tipos permitidos

| Tipo | Uso |
| --- | --- |
| `feat` | Agregar una funcionalidad nueva. |
| `fix` | Corregir un error. |
| `docs` | Crear o actualizar documentación. |
| `style` | Ajustar el formato del código sin cambiar su comportamiento. |
| `refactor` | Reorganizar el código sin cambiar su comportamiento. |
| `test` | Agregar o modificar pruebas. |
| `perf` | Mejorar el rendimiento. |
| `build` | Modificar dependencias o configuración de compilación. |
| `ci` | Modificar la integración continua. |
| `chore` | Realizar tareas de mantenimiento. |

## 3. Alcances sugeridos

| Alcance | Área del proyecto |
| --- | --- |
| `auth` | Autenticación y acceso. |
| `ui` | Componentes e interfaz visual. |
| `routes` | Navegación y rutas. |
| `api` | Comunicación con el backend. |
| `config` | Configuración del proyecto. |
| `deps` | Dependencias. |
| `repo` | Documentación y configuración del repositorio. |

Se pueden utilizar otros alcances cuando correspondan al módulo afectado. Los anteriores son ejemplos, no un catálogo cerrado.

## 4. Reglas de escritura

1. Escribir el tipo y el alcance en minúsculas.
2. Incluir un alcance en todos los commits.
3. Separar el encabezado de la descripción con `: ` (dos puntos y un espacio).
4. Escribir la descripción en español, con un verbo en infinitivo: agregar, corregir, actualizar, eliminar, etc.
5. Procurar que la primera línea no supere 72 caracteres y no termine en punto.
6. Evitar mensajes genéricos como `cambios`, `update` o `arreglos`.
7. Realizar commits pequeños y enfocados en un cambio lógico.
8. No incluir contraseñas, tokens ni otros secretos.

## 5. Ejemplos correctos

```text
feat(auth): agregar formulario de inicio de sesion
fix(ui): corregir alineacion del menu
style(ui): ajustar indentacion de componentes
refactor(api): centralizar peticiones HTTP
docs(repo): agregar reglas de commits
test(auth): agregar pruebas de validacion
chore(deps): actualizar dependencias
```

## 6. Ejemplos incorrectos

| Incorrecto | Correcto |
| --- | --- |
| `cambios` | `feat(ui): agregar componente de navegacion` |
| `fix login` | `fix(auth): corregir validacion de credenciales` |
| `FEAT(UI): nuevo boton` | `feat(ui): agregar boton de guardar` |

## 7. Aplicación en Pull Requests

- Antes de abrir una Pull Request, revisar que los commits cumplan este documento.
- La PR hacia la rama principal debe recibir la aprobación requerida por las reglas del repositorio antes de hacer merge.
- Si se utiliza squash merge, el mensaje del commit resultante también debe seguir la nomenclatura establecida.
- No realizar cambios directamente sobre la rama `main`.
- Cada Pull Request debe contener una descripción clara de los cambios realizados.

## 8. Nomenclatura de ramas

Todas las ramas de trabajo deberán seguir el siguiente formato:

```text
tipo/descripcion
```

- `tipo`: indica la naturaleza del trabajo que se realizará.
- `descripcion`: identifica de manera breve y clara la tarea o funcionalidad.

Ejemplos:

```text
feat/login
fix/navbar-responsive
docs/commits-rules
```

### 8.1. Tipos de ramas permitidos

| Tipo | Uso | Ejemplo |
| --- | --- | --- |
| `feat/` | Desarrollo de nuevas funcionalidades. | `feat/user-management` |
| `fix/` | Corrección de errores. | `fix/login-validation` |
| `docs/` | Creación o actualización de documentación. | `docs/commits-rules` |
| `refactor/` | Reestructuración del código. | `refactor/auth-service` |
| `style/` | Cambios de formato del código. | `style/navbar` |
| `test/` | Creación o modificación de pruebas. | `test/login` |
| `perf/` | Mejoras de rendimiento. | `perf/component-rendering` |
| `build/` | Cambios de compilación o dependencias. | `build/vite-config` |
| `ci/` | Cambios en la integración continua. | `ci/github-actions` |
| `chore/` | Tareas de mantenimiento. | `chore/update-dependencies` |
| `hotfix/` | Correcciones urgentes de errores críticos. | `hotfix/auth-crash` |

### 8.2. Reglas para nombrar ramas

1. Utilizar siempre minúsculas.
2. Separar las palabras con guiones (`-`).
3. No utilizar espacios, acentos ni caracteres especiales, excepto los separadores establecidos.
4. Utilizar nombres descriptivos, cortos y en inglés.
5. Cada rama debe estar enfocada en una tarea o cambio específico.
6. Crear una nueva rama para cada funcionalidad, corrección o tarea independiente.
7. No utilizar nombres genéricos o nombres de integrantes como única descripción de la rama.
8. No trabajar directamente sobre la rama `main`.

### 8.3. Ejemplos correctos

```text
feat/user-management
feat/login-form
fix/navbar-responsive
docs/commits-rules
refactor/api-service
chore/update-dependencies
```

### 8.4. Ejemplos incorrectos

| Incorrecto | Correcto |
| --- | --- |
| `nueva-rama` | `feat/user-management` |
| `Login` | `feat/login` |
| `fix navbar` | `fix/navbar-responsive` |
| `FEAT/USERS` | `feat/user-management` |
| `cambios-daniel` | `feat/user-management` |
| `documentacion` | `docs/commits-rules` |

## 9. Flujo de trabajo

El equipo deberá seguir el siguiente proceso para realizar e integrar cambios al repositorio:

1. Actualizar la rama `main` local.
2. Crear una rama con la nomenclatura establecida.
3. Realizar los cambios correspondientes.
4. Crear commits siguiendo Conventional Commits.
5. Subir la rama al repositorio remoto.
6. Crear una Pull Request hacia `main`.
7. Solicitar la revisión y aprobación de otro colaborador.
8. Corregir las observaciones realizadas durante la revisión, si existen.
9. Realizar el merge una vez cumplidos los requisitos establecidos en el repositorio.
10. Eliminar la rama de trabajo cuando ya no sea necesaria.

### Ejemplo del flujo de trabajo

Crear una rama:

```bash
git switch main
git pull origin main
git switch -c feat/login
```

Realizar un commit:

```bash
git add .
git commit -m "feat(auth): agregar formulario de inicio de sesion"
```

Subir la rama:

```bash
git push -u origin feat/login
```

Posteriormente, crear una Pull Request en GitHub desde `feat/login` hacia `main` y solicitar la aprobación de otro integrante del equipo.

---

Estas convenciones son obligatorias para los colaboradores del repositorio y deberán verificarse durante la revisión de las Pull Requests.

Este documento no instala ni activa validaciones automáticas mediante GitHub Actions.
