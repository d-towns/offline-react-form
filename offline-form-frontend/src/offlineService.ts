import { openDB } from "idb";
export async function sendFormDataToServer() {
    const db = await openDB('formDataStore', 1);
    const tx = db.transaction('formData', 'readonly');
    const store = tx.objectStore('formData');
    const allSavedData = await store.getAll();
    console.log('saved form data', allSavedData);
    try {
        allSavedData.forEach( async (form, index) =>  {
            const response = await fetch('http://localhost:3000/people', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                console.log('Data synced with server:', form);
                await db.transaction('formData', 'readwrite').objectStore('formData').delete(index);
                console.log(`removed form data for: ${form.firstName} ${form.lastName}` )
            }
        });
    } catch (error) {
        console.error('Failed to send form data:', error);
    }
}

