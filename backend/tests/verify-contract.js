const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const s=fs.readFileSync(path.join(root,"server.js"),"utf8");
const expected=[
["get","/api/v1/health"],["post","/api/v1/auth/register"],["post","/api/v1/auth/login"],["post","/api/v1/auth/logout"],
["get","/api/v1/me"],["get","/api/v1/customers"],["post","/api/v1/customers"],["get","/api/v1/customers/:id"],
["put","/api/v1/customers/:id"],["delete","/api/v1/customers/:id"],["get","/api/v1/customers/:id/bookings"],
["get","/api/v1/services"],["post","/api/v1/services"],["put","/api/v1/services/:id"],["delete","/api/v1/services/:id"],
["get","/api/v1/bookings"],["post","/api/v1/bookings"],["patch","/api/v1/bookings/:id/status"],
["get","/api/v1/dashboard/summary"],["get","/api/v1/dashboard/revenue"],["get","/api/v1/dashboard/revenue/trend"],
["get","/api/v1/dashboard/today"]];
const missing=expected.filter(([m,p])=>!s.includes(`app.${m}("${p}"`));
if(missing.length){console.error("CONTRACT FAIL",missing);process.exit(1)}
console.log(`FLOWLY API CONTRACT: PASS (${expected.length} endpoints)`);
