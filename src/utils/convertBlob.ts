export function blobToJson(blob: Blob) {
    return new Response(new Blob([blob], { type: "application/json" })).text();
}

export function blobToText(blob: Blob) {
    return new Response(blob).text();
}

export function blobToBase64(blob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}
