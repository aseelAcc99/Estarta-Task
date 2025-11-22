import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const setCache=(key, value, ttl = 60)=> {
  cache.set(key, value, ttl);
}

export const getCache=(key)=> {
  return cache.get(key);
}

export const deleteCache=(key)=> {
  cache.del(key);
}
