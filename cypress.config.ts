import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200', // Asegúrate de que esta URL sea correcta para tu aplicación
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Patrón para encontrar archivos de prueba
  },
});
