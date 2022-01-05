export const databaseExists = async (name: string) =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(name);
        let existed = true;
        request.onupgradeneeded = function () {
            existed = false;
        };
        request.onsuccess = function () {
            request.result.close();
            if (!existed) indexedDB.deleteDatabase(name);
            resolve(existed);
        };
        request.onerror = function () {
            reject(request.error);
        };
    });
