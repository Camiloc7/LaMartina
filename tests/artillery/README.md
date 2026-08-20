# Pruebas de carga

`smoke.yml` no escribe datos: verifica salud y que una ruta protegida rechace peticiones sin sesión.

```powershell
pnpm test:load:smoke
```

`load-test.yml` crea PQR y debe ejecutarse únicamente contra staging con cuentas y conjunto de prueba. No lo ejecutes contra producción. La carga está deliberadamente por debajo del límite global de 300 solicitudes por IP cada 15 minutos.

```powershell
$env:ARTILLERY_TARGET = "https://staging-api.ejemplo.com"
$env:ARTILLERY_ADMIN_TOKEN = "jwt-de-la-cuenta-admin-de-prueba"
$env:ARTILLERY_CLIENT_TOKEN = "jwt-de-la-cuenta-cliente-de-prueba"
$env:ARTILLERY_CONJUNTO_ID = "uuid-del-conjunto-de-prueba"
pnpm test:load:staging
```

Los tokens no se guardan en el repositorio. Para conservar un informe, añade `--output reports/artillery.json` al comando; no publiques ese archivo si contiene URLs o datos operativos.
