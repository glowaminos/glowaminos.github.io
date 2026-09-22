const PRICE = {"bac-water": 19.0, "bpc-157": 33.0, "bpc-157-tb-500-10mg": 54.0, "cjc-1295-no-dac-ipamorelin-10mg": 60.0, "ghk-cu": 44.0, "glow": 85.0, "klow": 100.0, "melanotan": 38.0, "mots-c": 43.0, "nad-plus": 60.0, "retatrutide": 85.0, "tb-500": 39.0, "tesamorelin": 74.0};
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 const items=Array.isArray(req.body?.items)?req.body.items:[];
 if(!items.length) return res.status(400).json({error:'Cart is empty.'});
 let total=0;
 for(const item of items){
  if(!(item.id in PRICE)) return res.status(400).json({error:'Invalid product.'});
  const qty=Number(item.qty);
  if(!Number.isInteger(qty)||qty<1||qty>99) return res.status(400).json({error:'Invalid quantity.'});
  total += PRICE[item.id]*qty;
 }
 return res.status(503).json({error:'Secure payment provider is not configured yet.',validatedTotal:total});
}
