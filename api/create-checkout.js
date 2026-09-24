import {readFile} from 'node:fs/promises';
import {SITE_CONFIG} from '../assets/js/config.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const items=Array.isArray(req.body?.items)?req.body.items:[];
 if(!items.length)return res.status(400).json({error:'Cart is empty.'});
 let catalog;
 try{catalog=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'))}catch{return res.status(503).json({error:'Catalog temporarily unavailable.'})}
 let total=0;
 for(const item of items){
  const product=catalog.find(p=>p.id===item.id),qty=Number(item.qty);
  if(!product||product.startingPrice!=null||product.salePrice==null&&product.regularPrice==null)return res.status(400).json({error:'Product price is not confirmed for checkout.'});
  if(!Number.isInteger(qty)||qty<1||qty>99)return res.status(400).json({error:'Invalid quantity.'});
  total+=(product.salePrice??product.regularPrice)*qty;
 }
 return res.status(503).json({error:'Secure payment provider is not configured yet.',validatedTotal:total+SITE_CONFIG.flatShippingRate});
}
