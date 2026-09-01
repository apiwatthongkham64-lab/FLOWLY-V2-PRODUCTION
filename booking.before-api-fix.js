<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Booking — FLOWLY</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#080808;color:#f5f2ec;font-family:Inter,"Noto Sans Thai",Arial,sans-serif}.app{min-height:100vh;display:flex}
.side{width:235px;background:#0d0d0d;border-right:1px solid #202020;padding:25px 16px;flex-shrink:0}.logo{font-size:23px;letter-spacing:.2em;font-weight:800;padding:0 12px 28px;display:block}.logo i{font-style:normal;color:#c89c58}.section{font-size:10px;color:#555;letter-spacing:.15em;padding:18px 12px 8px}.nav{display:block;padding:11px 12px;border-radius:9px;color:#888;font-size:13px;margin:2px 0}.nav.active,.nav:hover{background:#19150f;color:#d4aa67}.main{flex:1;min-width:0}.top{height:72px;border-bottom:1px solid #202020;display:flex;align-items:center;justify-content:space-between;padding:0 32px}.crumb{color:#777;font-size:13px}.user{display:flex;align-items:center;gap:11px;font-size:13px}.avatar{width:34px;height:34px;border-radius:50%;background:#1e1e1e;border:1px solid #333;display:grid;place-items:center;color:#c89c58;font-weight:800}.content{max-width:1250px;margin:auto;padding:36px 32px 70px}.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:25px}.kicker{font-size:11px;letter-spacing:.18em;color:#c89c58;font-weight:800}.head h1{font-size:34px;margin:8px 0 0}.date{color:#666;font-size:12px}.btn{border:0;border-radius:10px;padding:12px 17px;background:#c89c58;color:#111;font-weight:800;cursor:pointer}.toolbar{display:flex;justify-content:space-between;gap:12px;margin-bottom:15px}.filters{display:flex;gap:8px}.filter{background:#101010;border:1px solid #252525;border-radius:9px;color:#aaa;padding:10px 12px;font-size:12px}.calendar{background:#101010;border:1px solid #242424;border-radius:15px;overflow:hidden}.week{display:grid;grid-template-columns:80px repeat(7,1fr);border-bottom:1px solid #242424}.day{padding:13px 7px;text-align:center;color:#777;font-size:11px;border-left:1px solid #202020}.day strong{display:block;color:#eee;font-size:14px;margin-top:3px}.rows{position:relative;min-height:590px}.row{height:118px;display:grid;grid-template-columns:80px repeat(7,1fr);border-bottom:1px solid #1d1d1d}.hour{padding:12px;color:#555;font-size:11px}.cell{border-left:1px solid #1d1d1d}.event{position:absolute;border:1px solid #4a3925;background:#19140d;border-radius:9px;padding:9px 11px;overflow:hidden;cursor:pointer}.event b{font-size:12px;display:block}.event small{font-size:10px;color:#8d806f}.e1{left:calc(80px + (100% - 80px)/7 * 0 + 7px);top:42px;width:calc((100% - 80px)/7 - 14px);height:70px}.e2{left:calc(80px + (100% - 80px)/7 * 1 + 7px);top:160px;width:calc((100% - 80px)/7 - 14px);height:70px}.e3{left:calc(80px + (100% - 80px)/7 * 2 + 7px);top:278px;width:calc((100% - 80px)/7 - 14px);height:70px}.e4{left:calc(80px + (100% - 80px)/7 * 4 + 7px);top:42px;width:calc((100% - 80px)/7 - 14px);height:70px}.e5{left:calc(80px + (100% - 80px)/7 * 5 + 7px);top:396px;width:calc((100% - 80px)/7 - 14px);height:70px}.legend{display:flex;gap:18px;color:#666;font-size:11px;margin-top:15px}.legend span:before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#c89c58;margin-right:6px}
.modal{display:none;position:fixed;inset:0;background:#000b;align-items:center;justify-content:center;padding:20px}.modal.open{display:flex}.modalbox{width:min(470px,100%);background:#111;border:1px solid #2b2b2b;border-radius:16px;padding:25px}.modalbox h2{margin:0 0 6px}.muted{color:#777;font-size:13px;margin:0 0 22px}label{display:block;color:#aaa;font-size:12px;margin:13px 0 6px}input,select{width:100%;padding:12px;border:1px solid #292929;border-radius:9px;background:#0b0b0b;color:#eee}.actions{display:flex;gap:8px}.cancel{background:#1b1b1b;color:#aaa}.actions button{flex:1;margin-top:20px}
@media(max-width:900px){.side{width:190px}.week,.row{grid-template-columns:60px repeat(7,1fr)}.e1,.e2,.e3,.e4,.e5{left:calc(60px + (100% - 60px)/7 * var(--d,0) + 5px);width:calc((100% - 60px)/7 - 10px)}}
@media(max-width:650px){.side{display:none}.top{padding:0 18px}.content{padding:25px 15px}.head{display:block}.toolbar{display:block}.filters{margin-top:12px}.calendar{overflow-x:auto}.week,.rows{min-width:720px}}
</style>
<link rel="stylesheet" href="design-system.css"><script src="flowly-config.js"></script></head>
<body>
<div class="app">
<aside class="side">
<a class="logo" href="index.html">FLOW<i>LY</i></a>
<div class="section">WORKSPACE</div>
<a class="nav" href="dashboard.html">⌂ &nbsp; Dashboard</a>
<a class="nav active" href="booking.html">◷ &nbsp; Booking</a>
<a class="nav" href="customers.html">◯ &nbsp; Customers</a>
<div class="section">INSIGHTS</div><a class="nav" href="business-data.html">▥ &nbsp; Business Data</a><a class="nav" href="ai-assistant.html">✦ &nbsp; AI Assistant</a>
<div class="section">SYSTEM</div><a class="nav" href="settings.html">⚙ &nbsp; Settings</a>
</aside>
<main class="main">
<header class="top"><span class="crumb">Workspace / Booking</span><div class="user"><span>Demo Business</span><div class="avatar">D</div></div></header>
<section class="content">
<div class="head"><div><div class="kicker">BOOKING MANAGEMENT</div><h1>ตารางนัดหมาย</h1></div><button class="btn" id="newBtn">＋ New Booking</button></div>
<div class="toolbar"><div class="filters"><button class="filter">‹ &nbsp; วันนี้</button><button class="filter">สัปดาห์นี้ ▾</button><button class="filter">ทั้งหมด ▾</button></div><div class="date">24–30 August 2026</div></div>
<div class="calendar">
<div class="week"><div></div><div class="day">จันทร์<strong>24</strong></div><div class="day">อังคาร<strong>25</strong></div><div class="day">พุธ<strong>26</strong></div><div class="day">พฤหัสบดี<strong>27</strong></div><div class="day">ศุกร์<strong>28</strong></div><div class="day">เสาร์<strong>29</strong></div><div class="day">อาทิตย์<strong>30</strong></div></div>
<div class="rows">
<div class="row"><div class="hour">10:00</div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
<div class="row"><div class="hour">11:00</div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
<div class="row"><div class="hour">12:00</div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
<div class="row"><div class="hour">13:00</div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
<div class="row"><div class="hour">14:00</div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>
<div class="event e1"><b>Customer A</b><small>10:00 · Confirmed</small></div>
<div class="event e2"><b>Customer B</b><small>11:00 · Confirmed</small></div>
<div class="event e3"><b>Customer C</b><small>12:00 · Pending</small></div>
<div class="event e4"><b>Customer D</b><small>10:00 · Confirmed</small></div>
<div class="event e5"><b>Customer E</b><small>13:00 · Pending</small></div>
</div></div>
<div class="recent" style="margin-top:18px;background:#101010;border:1px solid #242424;border-radius:15px;padding:18px;">
<h3 style="margin:0 0 5px;font-size:14px">รายการที่เพิ่มล่าสุด</h3>
<p style="margin:0 0 12px;color:#666;font-size:11px">ข้อมูล Demo จะเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น</p>
<div id="recentList"></div>
</div>
<div class="legend"><span>Confirmed</span><span>Pending</span> · V1 Demo Data</div>
</section>
</main></div>

<div class="modal" id="modal"><div class="modalbox">
<h2>สร้าง Booking ใหม่</h2><p class="muted">V1 Preview · ยังไม่บันทึกลงฐานข้อมูลจริง</p>
<label>ลูกค้า</label>
<select id="customerSelect">
  <option value="">เลือกจากรายชื่อลูกค้า</option>
  <option value="__manual__">＋ พิมพ์ชื่อลูกค้าใหม่</option>
</select>
<label style="margin-top:14px;display:block">บริการ</label>
<select id="serviceSelect">
  <option value="">เลือกบริการ</option>
  <option value="บริการด่วน" data-price="500">บริการด่วน · 30 นาที · ฿500</option>
  <option value="บริการมาตรฐาน" data-price="800">บริการมาตรฐาน · 60 นาที · ฿800</option>
  <option value="บริการพรีเมียม" data-price="1200">บริการพรีเมียม · 90 นาที · ฿1,200</option>
</select>
<div id="servicePrice" style="font-size:12px;color:#777;margin-top:6px"></div>
<input id="customer" placeholder="Customer name" style="display:none;margin-top:8px">
<label>วันที่</label><input id="dateInput" type="date">
<label>เวลา</label><input id="timeInput" type="time">
<label>บริการ</label><select><option>Service</option><option>Consultation</option><option>Appointment</option></select>
<div class="actions"><button class="btn cancel" id="cancel">ยกเลิก</button><div id="bookingError" class="flowly-error" aria-live="polite"></div><button class="btn" id="save">สร้างรายการ</button></div>
</div></div>
<script>
const modal=document.getElementById('modal');
document.getElementById('newBtn').onclick=()=>modal.classList.add('open');
document.getElementById('cancel').onclick=()=>modal.classList.remove('open');
const recentList=document.getElementById('recentList');
const customerSelect=document.getElementById('customerSelect');
const serviceSelect=document.getElementById('serviceSelect');
const servicePrice=document.getElementById('servicePrice');
if(serviceSelect){
  serviceSelect.addEventListener('change',()=>{
    const opt=serviceSelect.options[serviceSelect.selectedIndex];
    servicePrice.textContent = opt && opt.dataset.price ? 'ราคา: ฿' + Number(opt.dataset.price).toLocaleString('th-TH') : '';
  });
}

const customerInput=document.getElementById('customer');
const CUSTOMER_STORE='flowly_demo_customers_v1';

function getCustomers(){
  try{return JSON.parse(localStorage.getItem(CUSTOMER_STORE)||'[]')}catch(e){return[]}
}
function renderCustomerOptions(){
  if(!customerSelect) return;
  const customers=getCustomers();
  customerSelect.innerHTML='<option value="">เลือกจากรายชื่อลูกค้า</option>';
  customers.forEach((x,i)=>{
    const opt=document.createElement('option');
    opt.value=String(i);
    opt.textContent=x.name + (x.phone ? ' · '+x.phone : '');
    customerSelect.appendChild(opt);
  });
  const manual=document.createElement('option');
  manual.value='__manual__';
  manual.textContent='＋ พิมพ์ชื่อลูกค้าใหม่';
  customerSelect.appendChild(manual);
}
customerSelect.addEventListener('change',()=>{
  if(customerSelect.value==='__manual__'){
    customerInput.style.display='block';
    customerInput.focus();
  }else{
    customerInput.style.display='none';
 serviceSelect.value=''; servicePrice.textContent=''; bookingError.textContent='';
    const c=getCustomers()[Number(customerSelect.value)];
    customerInput.value=c ? c.name : '';
  }
});

const STORE='flowly_demo_bookings_v1';
function getBookings(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
function renderBookings(){
 const items=getBookings();
 if(!items.length){recentList.innerHTML='<div style="color:#555;font-size:11px;padding:8px 0">ยังไม่มีรายการใหม่</div>';return}
 recentList.innerHTML=items.slice(0,5).map(x=>`
 <div style="display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #202020">
   <div><b style="font-size:12px">${x.name.replace(/[<>&"]/g,'')}</b><div style="color:#666;font-size:10px;margin-top:3px">${x.date||'ไม่ระบุวันที่'} · ${x.time||'ไม่ระบุเวลา'} · ${x.service}</div></div>
   <div style="display:flex;align-items:center;gap:8px">
     <select data-status-index="${i}" style="padding:6px 7px;border:1px solid #292929;border-radius:7px;background:#0b0b0b;color:#c8c3ba;font-size:10px">
       <option ${x.status==='Pending'?'selected':''}>Pending</option>
       <option ${x.status==='Confirmed'?'selected':''}>Confirmed</option>
       <option ${x.status==='Completed'?'selected':''}>Completed</option>
     </select>
     <span style="color:#c89c58;font-size:10px">Demo</span>
   </div>
 </div>`).join('');
 recentList.querySelectorAll('[data-status-index]').forEach(sel=>{
   sel.onchange=()=>{
     const items=getBookings();
     const idx=Number(sel.dataset.statusIndex);
     if(items[idx]){items[idx].status=sel.value;localStorage.setItem(STORE,JSON.stringify(items));renderBookings();}
   };
 });
}
document.getElementById('save').onclick=()=>{
 const bookingError=document.getElementById('bookingError');
 const name=document.getElementById('customer').value.trim();
 const service=document.getElementById('serviceSelect').value;
 if(!service){bookingError.textContent='กรุณาเลือกบริการ';serviceSelect.focus();return}
 if(!name){ bookingError.textContent='กรุณาเลือกลูกค้าหรือพิมพ์ชื่อลูกค้า'; customerSelect.focus(); return; }
 bookingError.textContent='';
 const items=getBookings();
 items.unshift({
   name,
   date:document.getElementById('dateInput').value,
   time:document.getElementById('timeInput').value,
   service:document.querySelector('.modalbox select').value,
   status:'Pending'
 });
 localStorage.setItem(STORE,JSON.stringify(items.slice(0,20)));
 modal.classList.remove('open');
 document.getElementById('customer').value='';
 customerSelect.value='';
 customerInput.style.display='none';
 document.getElementById('dateInput').value='';
 document.getElementById('timeInput').value='';
 renderBookings();
};
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
renderCustomerOptions();
renderBookings();
</script>
<div style="position:fixed;left:10px;bottom:10px;z-index:9999;font-size:9px;color:#666;background:rgba(10,10,10,.9);border:1px solid #222;border-radius:8px;padding:5px 8px">LOCAL DEMO · Browser only</div></body></html>