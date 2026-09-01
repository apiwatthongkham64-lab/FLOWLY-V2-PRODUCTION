// Requires a running FLOWLY API + PostgreSQL.
// Run: FLOWLY_API=http://localhost:3000 node tests/smoke-auth.js
const base=process.env.FLOWLY_API||"http://localhost:3000";
let cookie="";
async function req(path,o={}){
  const h={...(o.headers||{})};
  if(cookie) h.cookie=cookie;
  const r=await fetch(base+path,{...o,headers:h});
  const sc=r.headers.get("set-cookie"); if(sc) cookie=sc.split(";")[0];
  const body=await r.json().catch(()=>null);
  return {r,body};
}
function json(body){return {"content-type":"application/json"},JSON.stringify(body)}
function assert(ok,msg){if(!ok) throw Error(msg)}

(async()=>{
  let x=await req("/api/v1/health");
  assert(x.r.status===200,"health "+x.r.status);

  const email=`smoke-${Date.now()}@flowly.local`;
  x=await req("/api/v1/auth/register",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({name:"Smoke",email,password:"SmokeTest!123",businessName:"Smoke Business"})});
  assert(x.r.status===201,"register "+x.r.status);

  // Explicit login coverage; logout first to verify the login path independently.
  x=await req("/api/v1/auth/logout",{method:"POST"});
  assert(x.r.status===200,"pre-login logout "+x.r.status);
  cookie="";
  x=await req("/api/v1/auth/login",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({email,password:"SmokeTest!123"})});
  assert(x.r.status===200,"login "+x.r.status);

  x=await req("/api/v1/me"); assert(x.r.status===200,"me "+x.r.status);
  assert(!("password_hash" in (x.body?.data||{})),"password hash leaked");

  x=await req("/api/v1/customers",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({name:"Smoke Customer"})});
  assert(x.r.status===201,"customer create "+x.r.status);
  const customerId=x.body.data.id;

  x=await req("/api/v1/customers"); assert(x.r.status===200,"customer list "+x.r.status);
  x=await req("/api/v1/customers/"+customerId); assert(x.r.status===200,"customer get "+x.r.status);
  x=await req("/api/v1/customers/"+customerId+"/bookings"); assert(x.r.status===200,"customer bookings "+x.r.status);

  x=await req("/api/v1/services",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({name:"Smoke Service",duration_minutes:30,price:100})});
  assert(x.r.status===201,"service create "+x.r.status);
  const serviceId=x.body.data.id;
  x=await req("/api/v1/services"); assert(x.r.status===200,"service list "+x.r.status);

  const d=new Date(Date.now()+86400000).toISOString().slice(0,10);
  x=await req("/api/v1/bookings",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({customer_id:customerId,service_id:serviceId,booking_date:d,booking_time:"10:00"})});
  assert(x.r.status===201,"booking create "+x.r.status);
  const bookingId=x.body.data.id;

  x=await req("/api/v1/bookings"); assert(x.r.status===200,"booking list "+x.r.status);
  x=await req("/api/v1/bookings/"+bookingId+"/status",{method:"PATCH",headers:{"content-type":"application/json"},
    body:JSON.stringify({status:"confirmed"})});
  assert(x.r.status===200,"status confirmed "+x.r.status);

  x=await req("/api/v1/bookings",{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({customer_id:customerId,service_id:serviceId,booking_date:d,booking_time:"10:10"})});
  assert(x.r.status===409,"overlap conflict "+x.r.status);

  for(const p of ["/api/v1/dashboard/summary","/api/v1/dashboard/revenue","/api/v1/dashboard/revenue/trend","/api/v1/dashboard/today"]){
    x=await req(p); assert(x.r.status===200,p+" "+x.r.status);
  }

  x=await req("/api/v1/bookings/"+bookingId+"/status",{method:"PATCH",headers:{"content-type":"application/json"},
    body:JSON.stringify({status:"pending"})});
  assert(x.r.status===409,"invalid transition "+x.r.status);

  x=await req("/api/v1/auth/logout",{method:"POST"}); assert(x.r.status===200,"logout "+x.r.status);
  x=await req("/api/v1/me"); assert(x.r.status===401,"protected endpoint after logout "+x.r.status);

  console.log("FLOWLY E2E SMOKE: PASS");
})().catch(e=>{console.error("FLOWLY E2E SMOKE: FAIL",e.message);process.exit(1)});
