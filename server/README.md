# Grupo 03 - Tarea 4 - Server

Este proyecto usa Node.js, Express.js como framework, Nginx como proxy inverso para producción y Docker Compose para orquestar los contenedores de Docker.

## Cómo ejecutar el proyecto

Para ejecutar el proyecto de forma local, es necesario tener instalado Docker y Docker Compose. Luego, siga estos pasos:

1. Abra una terminal y vaya al directorio raíz del proyecto.
2. Ejecute el siguiente comando para levantar los contenedores de Docker en modo background:

```
make up
```

Este comando ejecuta el archivo docker-compose.yml y levanta los contenedores necesarios para la aplicación en segundo plano.

3. Acceda a la aplicación en su navegador web en la siguiente dirección:

```
http://localhost:3000
```

## Comandos disponibles en el archivo Makefile

El archivo Makefile proporciona varios comandos para interactuar con los contenedores de Docker y la aplicación:

- make up: Levanta los contenedores de Docker en modo background.
- make build: Levanta los contenedores de Docker en modo background y fuerza una reconstrucción de las imágenes.
- make down: Detiene y elimina los contenedores de Docker.
- make restart: Reinicia los contenedores de Docker.
- make logs: Muestra los registros de los contenedores de Docker.
- make install: Ejecuta el comando yarn install dentro del contenedor de la aplicación.
- make add dep=<nombre_del_paquete>: Ejecuta el comando yarn add dentro del contenedor de la aplicación para agregar un nuevo paquete.
- make lint: Ejecuta el comando yarn lint dentro del contenedor de la aplicación para verificar el código.
- make lint-fix: Ejecuta el comando yarn lint-fix dentro del contenedor de la aplicación para corregir los errores de formato automáticamente.
- make prod: Levanta los contenedores de Docker en modo producción.
- make prod-down: Detiene y elimina los contenedores de Docker en modo producción.
- make prod-logs: Muestra los registros de los contenedores de Docker en modo producción.