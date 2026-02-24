type CacheEntry<T> = {
  v: T;
  exp: number;
};

export function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    
    if (!entry || typeof entry.exp !== "number" || entry.v === undefined) {
      console.warn(`Cache entry for key ${key} has invalid structure`);
      localStorage.removeItem(key);
      return null;
    }

    if (Date.now() > entry.exp) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.v;
  } catch (error) {
    console.warn(`Erro ao ler cache para chave ${key}:`, error);
    try {
      localStorage.removeItem(key);
    } catch {
    }
    return null;
  }
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  try {
    if (!key || value === undefined) {
      console.warn('Tentativa de cache com chave ou valor inválido');
      return;
    }

    const entry: CacheEntry<T> = { 
      v: value, 
      exp: Date.now() + ttlMs 
    };
    
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn(`Erro ao salvar cache para chave ${key}:`, error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        clearOldCache();
        const entry: CacheEntry<T> = { 
          v: value, 
          exp: Date.now() + ttlMs 
        };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch {
      }
    }
  }
}

export function cacheRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Erro ao remover cache para chave ${key}:`, error);
  }
}

export function cacheRemoveByPrefix(prefix: string): void {
  try {
    const toRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        toRemove.push(key);
      }
    }
    
    toRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    });
    
    if (toRemove.length > 0) {
      console.log(`Removidos ${toRemove.length} itens do cache com prefixo "${prefix}"`);
    }
  } catch (error) {
    console.warn(`Erro ao remover cache por prefixo ${prefix}:`, error);
  }
}

export function clearAllCache(): void {
  try {
    const toRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pokedex:')) {
        toRemove.push(key);
      }
    }
    
    toRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    });
    
    console.log(`Cache limpo: ${toRemove.length} itens removidos`);
  } catch (error) {
    console.warn('Erro ao limpar cache:', error);
  }
}

export function clearExpiredCache(): number {
  let removedCount = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('pokedex:')) continue;
      
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        
        const entry = JSON.parse(raw) as CacheEntry<unknown>;
        if (entry && typeof entry.exp === 'number' && Date.now() > entry.exp) {
          localStorage.removeItem(key);
          removedCount++;
        }
      } catch {
        localStorage.removeItem(key);
        removedCount++;
      }
    }
  } catch (error) {
    console.warn('Erro ao limpar cache expirado:', error);
  }
  
  return removedCount;
}

function clearOldCache(): void {
  try {
    const items: Array<{ key: string; exp: number }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('pokedex:')) continue;
      
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        
        const entry = JSON.parse(raw) as CacheEntry<unknown>;
        if (entry && typeof entry.exp === 'number') {
          items.push({ key, exp: entry.exp });
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
    
    items.sort((a, b) => a.exp - b.exp);
    
    const removeCount = Math.ceil(items.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      try {
        localStorage.removeItem(items[i].key);
      } catch {
      }
    }
  } catch (error) {
    console.warn('Erro ao limpar cache antigo:', error);
  }
}

export function getCacheStats(): { total: number; valid: number; expired: number } {
  let total = 0;
  let valid = 0;
  let expired = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('pokedex:')) continue;
      
      total++;
      
      try {
        const raw = localStorage.getItem(key);
        if (!raw) {
          expired++;
          continue;
        }
        
        const entry = JSON.parse(raw) as CacheEntry<unknown>;
        if (entry && typeof entry.exp === 'number') {
          if (Date.now() > entry.exp) {
            expired++;
          } else {
            valid++;
          }
        } else {
          expired++;
        }
      } catch {
        expired++;
      }
    }
  } catch (error) {
    console.warn('Erro ao obter estatísticas do cache:', error);
  }
  
  return { total, valid, expired };
}