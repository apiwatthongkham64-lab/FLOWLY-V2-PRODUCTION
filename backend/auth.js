const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
function secret(){if(!process.env.SESSION_SECRET)throw new Error("SESSION_SECRET is required");return process.env.SESSION_SECRET}
async function hashPassword(p){if(typeof p!=="string"||p.length<8)throw new Error("Password must be at least 8 characters");return bcrypt.hash(p,12)}
const verifyPassword=(p,h)=>bcrypt.compare(p,h);
const signSession=p=>jwt.sign(p,secret(),{expiresIn:"8h"});
const verifySession=t=>jwt.verify(t,secret());
module.exports={hashPassword,verifyPassword,signSession,verifySession};
