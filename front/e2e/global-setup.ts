import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:4200';
  const authFile = path.join(__dirname, '.auth/spectator.json');

  // Créer un spectateur de test et se connecter
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    console.log('🔐 Configuration de l\'authentification E2E pour Sportix...');
    
    // Utiliser les comptes de test existants
    const spectatorData = {
      email: 'spectateur@sport-ix.com',
      password: 'Spectateur2024!'
    };

    // Se connecter avec le compte spectateur
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('input[name="email"]', spectatorData.email);
    await page.fill('input[name="password"]', spectatorData.password);
    await page.click('button[type="submit"]');
    
    // Attendre la redirection après connexion
    await page.waitForURL(/\/(spectator\/dashboard|club\/dashboard|home)/, { timeout: 10000 });

    // Sauvegarder l'état d'authentification
    await context.storageState({ path: authFile });
    console.log('✅ État d\'authentification spectateur sauvegardé:', authFile);
  } catch (error) {
    console.error('❌ Erreur lors du setup E2E:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
