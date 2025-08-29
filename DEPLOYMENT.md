# Despliegue en GitHub Pages

## Configuración Automática (Recomendado)

1. **Hacer push de los cambios a GitHub:**
   ```bash
   git add .
   git commit -m "Configurar despliegue en GitHub Pages"
   git push origin main
   ```

2. **Configurar GitHub Pages en tu repositorio:**
   - Ve a tu repositorio en GitHub
   - Ve a Settings > Pages
   - En "Source", selecciona "GitHub Actions"
   - El workflow se ejecutará automáticamente en cada push a main

## Despliegue Manual

Si prefieres hacer el despliegue manualmente:

```bash
# Construir la aplicación
npm run build

# Desplegar
npm run deploy
```

## Configuración del Repositorio

- **Base URL:** La aplicación está configurada para funcionar en `/poke-app/`
- **Branch de despliegue:** `gh-pages` (se crea automáticamente)
- **Directorio de salida:** `dist/`

## Solución de Problemas

### Si las rutas no funcionan:
- Verifica que `base: '/poke-app/'` esté configurado en `vite.config.ts`
- Asegúrate de que tu repositorio se llame exactamente `poke-app`

### Si el despliegue falla:
- Verifica que tengas permisos de escritura en el repositorio
- Revisa los logs de GitHub Actions en la pestaña "Actions"

## URLs

- **Repositorio:** https://github.com/[tu-usuario]/poke-app
- **Página desplegada:** https://[tu-usuario].github.io/poke-app/
