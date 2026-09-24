// Load once from the catalog JSON so prices and category data have one source.
export let catalogError=null;
export const PRODUCTS=Object.freeze(await fetch(new URL('../../data/products.json',import.meta.url)).then(response=>{
 if(!response.ok)throw Error('Catalog unavailable');
 return response.json();
}).then(rows=>{
 if(!Array.isArray(rows))throw Error('Invalid catalog');
 return rows;
}).catch(error=>{catalogError=error;return []}));
