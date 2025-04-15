
/**
 * Serviço para gerenciamento de armazenamento offline
 */

/**
 * Salva dados offline para sincronização posterior
 * @param cacheName Nome do cache para armazenar os dados
 * @param key Identificador único para recuperação
 * @param data Dados a serem salvos
 */
export async function saveForSync<T>(cacheName: string, key: string, data: T): Promise<boolean> {
  if (!('caches' in window)) return false;
  
  try {
    const cache = await caches.open(cacheName);
    const request = new Request(`/__offline/${cacheName}/${key}`);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(request, response);
    
    // Registra para sincronização quando online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(`sync-${cacheName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao salvar dados para sincronização (${cacheName}):`, error);
    return false;
  }
}

/**
 * Recupera dados salvos offline
 * @param cacheName Nome do cache onde os dados foram salvos
 * @param key Identificador único dos dados
 */
export async function getOfflineData<T>(cacheName: string, key: string): Promise<T | null> {
  if (!('caches' in window)) return null;
  
  try {
    const cache = await caches.open(cacheName);
    const request = new Request(`/__offline/${cacheName}/${key}`);
    const response = await cache.match(request);
    
    if (!response) return null;
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao recuperar dados offline (${cacheName}):`, error);
    return null;
  }
}

/**
 * Recupera todos os dados pendentes de sincronização
 * @param cacheName Nome do cache a ser verificado
 */
export async function getAllPendingSyncData<T>(cacheName: string): Promise<T[]> {
  if (!('caches' in window)) return [];
  
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const results: T[] = [];
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        results.push(data);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Erro ao recuperar todos os dados pendentes (${cacheName}):`, error);
    return [];
  }
}

/**
 * Remove dados do cache após sincronização bem-sucedida
 * @param cacheName Nome do cache
 * @param key Identificador único dos dados
 */
export async function removeSyncedData(cacheName: string, key: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  
  try {
    const cache = await caches.open(cacheName);
    const request = new Request(`/__offline/${cacheName}/${key}`);
    return await cache.delete(request);
  } catch (error) {
    console.error(`Erro ao remover dados sincronizados (${cacheName}):`, error);
    return false;
  }
}

/**
 * Verifica se existem dados pendentes de sincronização
 * @param cacheNames Lista de nomes de cache para verificar
 */
export async function hasPendingSyncData(cacheNames: string[]): Promise<boolean> {
  if (!('caches' in window)) return false;
  
  try {
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      if (keys.length > 0) return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar dados pendentes:', error);
    return false;
  }
}
