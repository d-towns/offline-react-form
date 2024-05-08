import {sendFormDataToServer} from './src/offlineService';
import { openDB } from 'idb';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener('install', async (event) => {
    console.log('Service Worked INstalling...');
    await openDB('formDataStore', 1, {
        upgrade(db) {
          if(!db.objectStoreNames.contains('formData')) {
            db.createObjectStore('formData', { autoIncrement: true});
            console.log('object store created!');
          }
        },
      });
    console.log('Service Worked Installed...');
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated.');
});

self.addEventListener('sync', event => {
    if (event.tag === 'sendFormData') {
        event.waitUntil(sendFormDataToServer());
    }
});

