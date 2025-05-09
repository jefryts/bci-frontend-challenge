# BCI FRONTEND CHALLENGE

Esta es una aplicación con gestión de tareas, implementando una autenticación de usuarios muy simple y un CRUD completo de tareas.
Se utilizó Material para el diseño y se siguieron buenas prácticas como arquitectura modular, principios SOLID, optimización de rendimiento y seguridad.
Se usó una API propia que está desplegada en Firebase, y con esto no perder tiempo en encontrar una API con la que pueda interactuar. Esta API admite el CRUD completo,
pero en esta oportunidad y según uno de los puntos del challenge a cumplir, se realizó usando localStorage (y a su vez se usó signals de Angular para gestionar el
estado de forma reactiva y eficiente).

## Tecnologías Utilizadas

Angular 19.2.4

TypeScript (Lenguaje de desarrollo)

Material (Diseño responsivo y minimalista)

Angular Router con Guards (Protección de rutas y lazy loading)

Angular Signals (Optimización del estado y reactividad)

Angular Services (Gestión de lógica de negocio)

## Despliegue

Para empezar a desplegar el proyecto:

1. Instalamos las dependencias de node

```bash
npm i
```

2. Tenemos que hacer una copia del archivo .env.copy con nombre .env

3. Hecho esto podemos usar "ng serve" o "npm run start" en una ventana de terminal

```bash
npm run start
```

## Características

Inicialmente veremos un formulario para ingresar un email correcto, con esto se crea un usuario sin tareas, en la que se podrán crear tareas de manera local. El API usada 
admite poder agregar, actualizar, eliminar tareas para el usuario (con email) ingresado pero en esta oportunidad este CRUD funcionará con signals y localStorage.