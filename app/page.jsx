"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const CURRENCIES = [
  { code:"SAR", symbol:"ر.س", name:"ريال سعودي",      flag:"🇸🇦" },
  { code:"YER", symbol:"ر.ي", name:"ريال يمني",       flag:"🇾🇪" },
  { code:"USD", symbol:"$",   name:"دولار أمريكي",    flag:"🇺🇸" },
  { code:"EUR", symbol:"€",   name:"يورو",            flag:"🇪🇺" },
  { code:"GBP", symbol:"£",   name:"جنيه إسترليني",   flag:"🇬🇧" },
  { code:"AED", symbol:"د.إ", name:"درهم إماراتي",    flag:"🇦🇪" },
  { code:"KWD", symbol:"د.ك", name:"دينار كويتي",     flag:"🇰🇼" },
  { code:"BHD", symbol:"د.ب", name:"دينار بحريني",    flag:"🇧🇭" },
  { code:"QAR", symbol:"ر.ق", name:"ريال قطري",       flag:"🇶🇦" },
  { code:"OMR", symbol:"ر.ع", name:"ريال عُماني",     flag:"🇴🇲" },
  { code:"JOD", symbol:"د.أ", name:"دينار أردني",     flag:"🇯🇴" },
  { code:"EGP", symbol:"ج.م", name:"جنيه مصري",       flag:"🇪🇬" },
  { code:"TRY", symbol:"₺",   name:"ليرة تركية",      flag:"🇹🇷" },
  { code:"INR", symbol:"₹",   name:"روبية هندية",     flag:"🇮🇳" },
];

const TRADES = {
  electrician: { ar:"كهربائي",            en:"Electrician",          icon:"⚡" },
  plumber:     { ar:"سباك",               en:"Plumber",              icon:"🔧" },
  hvac:        { ar:"تكييف وتبريد",       en:"HVAC Technician",      icon:"❄️" },
  carpenter:   { ar:"نجار",               en:"Carpenter",            icon:"🪚" },
  painter:     { ar:"دهان",               en:"Painter",              icon:"🖌️" },
  welder:      { ar:"حداد / لحام",        en:"Welder",               icon:"🔥" },
  mason:       { ar:"بناء / مقاول أبنية", en:"Mason",                icon:"🧱" },
  tile_layer:  { ar:"فرّاش سيراميك",     en:"Tile Layer",            icon:"🏠" },
  aluminum:    { ar:"ألمنيوم وزجاج",     en:"Aluminum & Glass",      icon:"🪟" },
  solar:       { ar:"طاقة شمسية",        en:"Solar Technician",      icon:"☀️" },
  cctv:        { ar:"كاميرات مراقبة",    en:"CCTV Installer",        icon:"📷" },
  network:     { ar:"شبكات وإنترنت",     en:"Network Technician",    icon:"🌐" },
  elevator:    { ar:"مصاعد",             en:"Elevator Technician",   icon:"🛗" },
  generator:   { ar:"مولدات كهربائية",   en:"Generator Tech",        icon:"🔌" },
  landscaping: { ar:"حدائق ومسابح",      en:"Landscaping",           icon:"🌿" },
  cleaning:    { ar:"تنظيف وصيانة",      en:"Cleaning",              icon:"🧹" },
  gas:         { ar:"غاز وأنابيب",       en:"Gas & Piping",          icon:"🔴" },
  roofing:     { ar:"عزل وأسطح",        en:"Roofing & Insulation",   icon:"🏗️" },
  interior:    { ar:"ديكور وتشطيب",     en:"Interior Finishing",     icon:"🏡" },
  general:     { ar:"مقاول عام",         en:"General Contractor",    icon:"🔨" },
};

const TXT = {
  ar:{
    dir:"rtl",dashboard:"الرئيسية",jobs:"المهام",customers:"العملاء",
    invoices:"الفواتير",reports:"التقارير",ai:"المساعد",settings:"الإعدادات",
    newJob:"مهمة جديدة",newCustomer:"عميل جديد",
    search:"ابحث عن عميل أو مهمة...",
    totalPending:"معلق التحصيل",totalPaid:"محصّل الشهر",
    activeJobs:"مهام نشطة",todayJobs:"مهام اليوم",allJobs:"كل المهام",
    noJobs:"لا توجد مهام",noCustomers:"لا يوجد عملاء",noInvoices:"لا توجد فواتير",
    addFirst:"اضغط + للإضافة",name:"الاسم",phone:"الجوال",
    address:"العنوان",notes:"ملاحظات",jobTitle:"وصف المهمة",
    selectCustomer:"اختر العميل...",scheduledAt:"الموعد",
    laborHours:"ساعات العمل",laborRate:"سعر الساعة",
    materials:"المواد",materialName:"اسم المادة",qty:"الكمية",unitPrice:"السعر",
    addMaterial:"+ أضف مادة",laborTotal:"إجمالي العمالة",matsTotal:"إجمالي المواد",
    grandTotal:"الإجمالي",save:"حفظ",cancel:"إلغاء",delete:"حذف",edit:"تعديل",
    markPaid:"تم الدفع ✓",sendWhatsApp:"إرسال عبر واتساب",
    resendReminder:"إعادة إرسال التذكير",createInvoice:"إنشاء فاتورة",
    viewInvoice:"عرض الفاتورة",changeStatus:"تغيير الحالة",
    jobDetails:"تفاصيل المهمة",invoiceDetails:"تفاصيل الفاتورة",
    customerDetails:"تفاصيل العميل",back:"رجوع",
    scheduled:"مجدول",in_progress:"جارٍ",done:"منتهي",invoiced:"مفوتر",
    draft:"مسودة",sent:"مُرسَل",paid:"مدفوع",overdue:"متأخر",
    online:"متصل",offline:"غير متصل",offlineBanner:"بدون إنترنت — بياناتك محفوظة",
    syncSuccess:"تمت المزامنة",dataSaved:"محفوظ",savedLocally:"محفوظ على الجهاز",
    language:"اللغة",profile:"الملف الشخصي",businessName:"اسم النشاط",
    trade:"المهنة",invoicePrefix:"بادئة الفاتورة",
    subtotal:"قبل الضريبة",tax:"الضريبة",total:"الإجمالي",
    dueDate:"تاريخ الاستحقاق",paidOn:"تم الدفع في",invoiceNumber:"رقم الفاتورة",
    call:"اتصال",jobHistory:"سجل المهام",confirmDelete:"هل أنت متأكد؟",
    noResults:"لا توجد نتائج",fullName:"الاسم الكامل",
    currency:"العملة",taxRate:"نسبة الضريبة (%)",
    revenue:"الإيرادات",totalJobs:"إجمالي المهام",completedJobs:"مكتملة",
    totalCustomers:"إجمالي العملاء",lastActivity:"آخر نشاط",thisMonth:"هذا الشهر",
    quickNote:"ملاحظة سريعة",saveNote:"حفظ",jobTimer:"مؤقت المهمة",
    startTimer:"ابدأ",stopTimer:"أوقف",clearData:"مسح جميع البيانات",
    pendingInvoices:"فواتير معلقة",welcome:"مرحباً",
    aiTitle:"المساعد الذكي ⚡",aiSubtitle:"مجاني — يعمل بدون إنترنت",
    aiPlaceholder:"اسأل مثلاً: ما إجمالي إيراداتي؟",
    aiSend:"إرسال",aiClear:"مسح",aiThinking:"جارٍ التفكير...",
    exportPDF:"تصدير PDF",addPhoto:"إضافة صورة",photos:"صور المشروع",
    exportExcel:"تصدير CSV",enableNotifications:"تفعيل الإشعارات",
    notificationsEnabled:"الإشعارات مفعّلة",
    expenses:"المصروفات",addExpense:"إضافة مصروف",expenseName:"اسم المصروف",
    expenseAmt:"المبلغ",expenseDate:"التاريخ",expenseCategory:"الفئة",
    profit:"الربح الصافي",totalExpenses:"إجمالي المصروفات",
    monthlyRevenue:"الإيرادات الشهرية",jobsByStatus:"توزيع المهام",
    topCustomers:"أفضل العملاء",avgJobValue:"متوسط الفاتورة",
  },
  en:{
    dir:"ltr",dashboard:"Dashboard",jobs:"Jobs",customers:"Customers",
    invoices:"Invoices",reports:"Reports",ai:"Assistant",settings:"Settings",
    newJob:"New Job",newCustomer:"New Customer",
    search:"Search jobs or customers...",
    totalPending:"Pending",totalPaid:"Collected",
    activeJobs:"Active Jobs",todayJobs:"Today",allJobs:"All Jobs",
    noJobs:"No jobs yet",noCustomers:"No customers yet",noInvoices:"No invoices yet",
    addFirst:"Tap + to add",name:"Name",phone:"Phone",
    address:"Address",notes:"Notes",jobTitle:"Job Description",
    selectCustomer:"Select customer...",scheduledAt:"Scheduled At",
    laborHours:"Labor Hours",laborRate:"Hourly Rate",
    materials:"Materials",materialName:"Material Name",qty:"Qty",unitPrice:"Price",
    addMaterial:"+ Add Material",laborTotal:"Labor Total",matsTotal:"Materials Total",
    grandTotal:"Grand Total",save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",
    markPaid:"Mark Paid ✓",sendWhatsApp:"Send via WhatsApp",
    resendReminder:"Resend Reminder",createInvoice:"Create Invoice",
    viewInvoice:"View Invoice",changeStatus:"Change Status",
    jobDetails:"Job Details",invoiceDetails:"Invoice Details",
    customerDetails:"Customer Details",back:"Back",
    scheduled:"Scheduled",in_progress:"In Progress",done:"Done",invoiced:"Invoiced",
    draft:"Draft",sent:"Sent",paid:"Paid",overdue:"Overdue",
    online:"Online",offline:"Offline",offlineBanner:"Offline — data saved locally",
    syncSuccess:"Synced",dataSaved:"Saved",savedLocally:"Saved on device",
    language:"Language",profile:"Profile",businessName:"Business Name",
    trade:"Trade",invoicePrefix:"Invoice Prefix",
    subtotal:"Subtotal",tax:"Tax",total:"Total",
    dueDate:"Due Date",paidOn:"Paid on",invoiceNumber:"Invoice #",
    call:"Call",jobHistory:"Job History",confirmDelete:"Are you sure?",
    noResults:"No results",fullName:"Full Name",
    currency:"Currency",taxRate:"Tax Rate (%)",
    revenue:"Revenue",totalJobs:"Total Jobs",completedJobs:"Completed",
    totalCustomers:"Total Customers",lastActivity:"Last Activity",thisMonth:"This Month",
    quickNote:"Quick Note",saveNote:"Save",jobTimer:"Job Timer",
    startTimer:"Start",stopTimer:"Stop",clearData:"Clear All Data",
    pendingInvoices:"Pending Invoices",welcome:"Welcome",
    aiTitle:"AI Assistant ⚡",aiSubtitle:"Free — works offline",
    aiPlaceholder:"Ask e.g.: What's my revenue?",
    aiSend:"Send",aiClear:"Clear",aiThinking:"Thinking...",
    exportPDF:"Export PDF",addPhoto:"Add Photo",photos:"Project Photos",
    exportExcel:"Export CSV",enableNotifications:"Enable Notifications",
    notificationsEnabled:"Notifications On",
    expenses:"Expenses",addExpense:"Add Expense",expenseName:"Expense Name",
    expenseAmt:"Amount",expenseDate:"Date",expenseCategory:"Category",
    profit:"Net Profit",totalExpenses:"Total Expenses",
    monthlyRevenue:"Monthly Revenue",jobsByStatus:"Jobs by Status",
    topCustomers:"Top Customers",avgJobValue:"Avg Invoice",
  },
};

const SK   = "tradepro_v5";
const INIT = {
  lang:"ar",
  profile:{ fullName:"", businessName:"", trade:"electrician", phone:"", invoicePrefix:"INV-", taxRate:15, currency:"SAR" },
  customers:[], jobs:[], invoices:[], notes:[], expenses:[], invoiceCounter:1,
};

const uid    = () => `${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const jTotal = (j) => (j.labor_hours||0)*(j.labor_rate||0)+(j.materials||[]).reduce((s,m)=>s+(m.qty||0)*(m.unit_price||0),0);
const fmtM   = (n,sym) => `${Number(n||0).toLocaleString("ar-SA",{minimumFractionDigits:0,maximumFractionDigits:2})} ${sym}`;
const fmtD   = (d) => d ? new Date(d).toLocaleDateString("ar-SA",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtT   = (d) => d ? new Date(d).toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"}) : "";

const SC={scheduled:{bg:"#EFF6FF",text:"#1D4ED8",dot:"#3B82F6"},in_progress:{bg:"#FFFBEB",text:"#B45309",dot:"#F59E0B"},done:{bg:"#F0FDF4",text:"#166534",dot:"#10B981"},invoiced:{bg:"#F5F3FF",text:"#6D28D9",dot:"#8B5CF6"}};
const IC={draft:{bg:"#F8FAFC",text:"#475569",dot:"#94A3B8"},sent:{bg:"#EFF6FF",text:"#1D4ED8",dot:"#3B82F6"},paid:{bg:"#F0FDF4",text:"#166534",dot:"#10B981"},overdue:{bg:"#FEF2F2",text:"#991B1B",dot:"#EF4444"}};

// ── Built-in AI (Free, No API Key) ───────────────────────
function builtinAI(msg, S, sym, t) {
  const m = msg.toLowerCase().trim();
  const pAmt  = S.invoices.filter(i=>i.status==="sent"||i.status==="overdue").reduce((s,i)=>s+i.total,0);
  const cAmt  = S.invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.total,0);
  const mo    = new Date().toISOString().slice(0,7);
  const moAmt = S.invoices.filter(i=>i.status==="paid"&&(i.paid_at||i.created_at||"").startsWith(mo)).reduce((s,i)=>s+i.total,0);
  const aJobs = S.jobs.filter(j=>j.status==="scheduled"||j.status==="in_progress");
  const tr    = TRADES[S.profile.trade];
  const trN   = tr ? tr[S.lang] : S.profile.trade;
  const totalExp = (S.expenses||[]).reduce((s,e)=>s+(e.amount||0),0);
  const ar = S.lang==="ar";

  // Revenue
  if(m.includes("ايراد")||m.includes("دخل")||m.includes("revenue")||m.includes("income")) {
    if(m.includes("شهر")||m.includes("month"))
      return ar
        ? `📊 **إيراداتك هذا الشهر:** ${fmtM(moAmt,sym)}\n\n• الكل المحصّل: ${fmtM(cAmt,sym)}\n• معلق: ${fmtM(pAmt,sym)}\n• ربح صافي: ${fmtM(cAmt-totalExp,sym)}\n\n💡 تابع فواتيرك المعلقة لزيادة التحصيل.`
        : `📊 **This month:** ${fmtM(moAmt,sym)}\n\n• Total collected: ${fmtM(cAmt,sym)}\n• Pending: ${fmtM(pAmt,sym)}\n• Net profit: ${fmtM(cAmt-totalExp,sym)}`;
    return ar
      ? `📊 **ملخص إيراداتك:**\n\n• محصّل الكل: **${fmtM(cAmt,sym)}**\n• هذا الشهر: **${fmtM(moAmt,sym)}**\n• معلق: **${fmtM(pAmt,sym)}**\n• مصروفات: **${fmtM(totalExp,sym)}**\n• ربح صافي: **${fmtM(cAmt-totalExp,sym)}**`
      : `📊 **Revenue summary:**\n\n• Collected: **${fmtM(cAmt,sym)}**\n• This month: **${fmtM(moAmt,sym)}**\n• Pending: **${fmtM(pAmt,sym)}**\n• Net profit: **${fmtM(cAmt-totalExp,sym)}**`;
  }

  // Invoices / pending
  if(m.includes("فاتور")||m.includes("invoice")||m.includes("معلق")||m.includes("pending")) {
    const pending = S.invoices.filter(i=>i.status==="sent"||i.status==="overdue");
    const overdue = S.invoices.filter(i=>i.status==="overdue");
    if(pending.length===0) return ar?"✅ لا توجد فواتير معلقة! كل شيء مدفوع.":"✅ No pending invoices! Everything is paid.";
    const list = pending.slice(0,5).map(inv=>{
      const job=S.jobs.find(j=>j.id===inv.job_id);
      const cu=S.customers.find(c=>c.id===job?.customer_id);
      return `• ${inv.invoice_number} — ${cu?.name||"?"} — **${fmtM(inv.total,sym)}** [${t[inv.status]}]`;
    }).join("\n");
    return ar
      ? `💰 **الفواتير المعلقة (${pending.length}):**\n\n${list}\n\n⚠️ متأخرة: ${overdue.length}\n**الإجمالي: ${fmtM(pAmt,sym)}**\n\n💡 أرسل تذكيراً عبر واتساب من شاشة الفاتورة.`
      : `💰 **Pending (${pending.length}):**\n\n${list}\n\n**Total: ${fmtM(pAmt,sym)}**`;
  }

  // Jobs
  if(m.includes("مهمة")||m.includes("مهام")||m.includes("شغل")||m.includes("job")||m.includes("task")) {
    if(m.includes("اليوم")||m.includes("today")) {
      const d=new Date().toISOString().split("T")[0];
      const tj=S.jobs.filter(j=>j.scheduled_at?.startsWith(d));
      if(tj.length===0) return ar?"📅 لا مهام اليوم. استغل الوقت لمتابعة الفواتير!":"📅 No jobs today. Follow up on invoices!";
      return ar
        ? `📅 **مهام اليوم (${tj.length}):**\n\n${tj.map(j=>`• ${j.title} [${t[j.status]}]`).join("\n")}`
        : `📅 **Today (${tj.length}):**\n\n${tj.map(j=>`• ${j.title} [${t[j.status]}]`).join("\n")}`;
    }
    return ar
      ? `⚙️ **مهامك:**\n\n• الكل: **${S.jobs.length}**\n• مجدولة: **${S.jobs.filter(j=>j.status==="scheduled").length}**\n• جارية: **${S.jobs.filter(j=>j.status==="in_progress").length}**\n• منتهية: **${S.jobs.filter(j=>j.status==="done").length}**\n• نشطة: **${aJobs.length}**`
      : `⚙️ **Jobs:**\n\n• Total: **${S.jobs.length}**\n• Active: **${aJobs.length}**\n• Done: **${S.jobs.filter(j=>j.status==="done").length}**`;
  }

  // Customers
  if(m.includes("عميل")||m.includes("عملاء")||m.includes("customer")||m.includes("client")) {
    const top = S.customers.map(c=>{
      const cp=S.invoices.filter(i=>S.jobs.find(j=>j.id===i.job_id&&j.customer_id===c.id)&&i.status==="paid").reduce((s,i)=>s+i.total,0);
      return{...c,jobs:S.jobs.filter(j=>j.customer_id===c.id).length,paid:cp};
    }).sort((a,b)=>b.paid-a.paid).slice(0,5);
    if(S.customers.length===0) return ar?"لا يوجد عملاء بعد. أضف أول عميل!":"No customers yet. Add your first client!";
    return ar
      ? `👥 **أفضل عملائك:**\n\n${top.map((c,i)=>`${i+1}. **${c.name}** — ${c.jobs} مهمة — ${fmtM(c.paid,sym)}`).join("\n")}`
      : `👥 **Top clients:**\n\n${top.map((c,i)=>`${i+1}. **${c.name}** — ${c.jobs} jobs — ${fmtM(c.paid,sym)}`).join("\n")}`;
  }

  // Pricing
  if(m.includes("سعر")||m.includes("تسعير")||m.includes("أجر")||m.includes("price")||m.includes("rate")) {
    const rates={electrician:"50–120",plumber:"60–150",hvac:"80–200",carpenter:"60–130",painter:"40–100",general:"70–180"};
    const r=rates[S.profile.trade]||rates.general;
    const myAvg=S.invoices.length?(S.invoices.reduce((s,i)=>s+i.subtotal,0)/S.invoices.length):0;
    return ar
      ? `💰 **تسعير ${trN}:**\n\n• نطاق السوق: **${r} ${sym}/ساعة**\n• متوسط فاتورتك: **${fmtM(myAvg,sym)}**\n\n📌 **نصيحة:**\n• (تكلفة المواد × 1.3) + (ساعات × سعرك)\n• أضف 15-20% هامش ربح\n• لا تنسَ وقت التنقل وإهلاك الأدوات`
      : `💰 **Pricing for ${trN}:**\n\n• Market rate: **${r} ${sym}/hr**\n• Your avg invoice: **${fmtM(myAvg,sym)}**\n\n📌 Formula: (materials × 1.3) + (hours × rate) + 15% profit`;
  }

  // WhatsApp message
  if(m.includes("واتساب")||m.includes("whatsapp")||m.includes("رسالة")||m.includes("تذكير")||m.includes("reminder")) {
    const pending=S.invoices.filter(i=>i.status==="sent"||i.status==="overdue");
    if(pending.length===0) return ar?"لا توجد فواتير معلقة ✅":"No pending invoices ✅";
    const inv=pending[0];
    const job=S.jobs.find(j=>j.id===inv.job_id);
    const cu=S.customers.find(c=>c.id===job?.customer_id);
    return ar
      ? `💬 **رسالة جاهزة:**\n\n---\nالسلام عليكم ${cu?.name||"عميل"},\n\nأذكّركم بفاتورة رقم **${inv.invoice_number}**\nالمبلغ: **${fmtM(inv.total,sym)}**\nالخدمة: ${job?.title||""}\nالاستحقاق: ${fmtD(inv.due_date)}\n\nشكراً 🙏 ${S.profile.fullName||""}\n---\n\n📋 انسخها وأرسلها`
      : `💬 **Ready message:**\n\n---\nHello ${cu?.name||"Client"},\nReminder for invoice **${inv.invoice_number}**\nAmount: **${fmtM(inv.total,sym)}**\nDue: ${fmtD(inv.due_date)}\nThank you 🙏\n---`;
  }

  // Growth tips
  if(m.includes("نصيحة")||m.includes("زيادة")||m.includes("تنمية")||m.includes("tip")||m.includes("grow")) {
    return ar
      ? `💡 **نصائح لتنمية ${trN}:**\n\n1. **صوّر أعمالك** — صور قبل وبعد تبني الثقة\n2. **الفاتورة الفورية** — أرسل فور انتهاء العمل\n3. **اطلب التقييمات** — على جوجل وواتساب\n4. **باقات صيانة** — دخل ثابت شهري\n5. **تواصل دوري** — تابع عملاءك القدامى كل 3 شهور\n6. **تسعير ذكي** — لا تخفض السعر، أضف قيمة`
      : `💡 **Growth tips for ${trN}:**\n\n1. **Photo your work** — Before/after builds trust\n2. **Instant invoicing** — Send immediately after job\n3. **Ask for reviews** — Google and WhatsApp\n4. **Maintenance packages** — Fixed monthly income\n5. **Follow-up clients** — Every 3 months\n6. **Smart pricing** — Add value, don't lower price`;
  }

  // Schedule
  if(m.includes("جدول")||m.includes("موعد")||m.includes("schedule")||m.includes("calendar")) {
    const up=S.jobs.filter(j=>j.status==="scheduled"&&j.scheduled_at).sort((a,b)=>new Date(a.scheduled_at)-new Date(b.scheduled_at)).slice(0,5);
    if(up.length===0) return ar?"📅 لا مواعيد قادمة.":"📅 No upcoming appointments.";
    return ar
      ? `📅 **المواعيد القادمة:**\n\n${up.map(j=>`• **${j.title}**\n  ${fmtD(j.scheduled_at)} ${fmtT(j.scheduled_at)}\n  ${S.customers.find(c=>c.id===j.customer_id)?.name||"?"}`).join("\n\n")}`
      : `📅 **Upcoming:**\n\n${up.map(j=>`• **${j.title}**\n  ${fmtD(j.scheduled_at)}\n  ${S.customers.find(c=>c.id===j.customer_id)?.name||"?"}`).join("\n\n")}`;
  }

  // Profit/expenses
  if(m.includes("ربح")||m.includes("مصروف")||m.includes("profit")||m.includes("expense")) {
    return ar
      ? `📊 **الربح والمصروفات:**\n\n• محصّل: **${fmtM(cAmt,sym)}**\n• مصروفات: **${fmtM(totalExp,sym)}**\n• **ربح صافي: ${fmtM(cAmt-totalExp,sym)}**\n\n💡 تتبع مصروفاتك من قائمة "المصروفات" لمعرفة ربحك الحقيقي`
      : `📊 **Profit:**\n\n• Collected: **${fmtM(cAmt,sym)}**\n• Expenses: **${fmtM(totalExp,sym)}**\n• **Net profit: ${fmtM(cAmt-totalExp,sym)}**`;
  }

  // Materials
  if(m.includes("مواد")||m.includes("material")||m.includes("قطع")) {
    const m2={electrician:"كيبل 2.5مم، قواطع، مقابس، صناديق توزيع",plumber:"أنابيب PPR، صمامات، وصلات، عوازل",hvac:"فريون R410A، أنابيب نحاسية، مرشحات",carpenter:"خشب MDF، براغي، لاصق خشب، صنفرة",painter:"دهان، رول، فرشاة، مشط، ورق تغطية",general:"حسب طبيعة كل مشروع"};
    const mats=m2[S.profile.trade]||m2.general;
    return ar?`🔧 **المواد الشائعة لـ${trN}:**\n\n${mats}\n\n💡 أضف موادك في كل مهمة لتتبع التكاليف بدقة!`
      :`🔧 **Common materials:** ${mats}`;
  }

  // Default / help
  const sugg = ar
    ? ["إيراداتي هذا الشهر","الفواتير المعلقة","مهام اليوم","نصائح التسعير","رسالة واتساب","كيف أزيد دخلي","أفضل عملائي","المواد الشائعة"]
    : ["Revenue this month","Pending invoices","Today's jobs","Pricing tips","WhatsApp message","Grow income","Top clients","Common materials"];
  return ar
    ? `مرحباً! 🤖 أنا مساعدك المجاني في TradePro.\n\nجرّب أن تسألني:\n\n${sugg.map(s=>`• "${s}"`).join("\n")}`
    : `Hello! 🤖 I'm your free TradePro assistant.\n\nTry asking:\n\n${sugg.map(s=>`• "${s}"`).join("\n")}`;
}

// ── PDF Generator ─────────────────────────────────────────
function generatePDF(inv, job, cu, profile, sym) {
  const taxAmt = inv.total - inv.subtotal;
  const tr = TRADES[profile.trade];
  const html = `<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Cairo',sans-serif;padding:36px;color:#1E293B;background:#fff;}
.hdr{display:flex;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #0F172A;}
.biz{font-size:22px;font-weight:900;color:#0F172A;}
.inv-num{font-size:18px;font-weight:800;color:#0F172A;text-align:left;}
.inv-date{font-size:12px;color:#64748B;margin-top:4px;text-align:left;}
.sec{margin-bottom:20px;}
.sec-lbl{font-size:10px;font-weight:700;color:#94A3B8;letter-spacing:1px;margin-bottom:6px;}
.cname{font-size:16px;font-weight:700;}
.cinfo{font-size:12px;color:#64748B;margin-top:3px;}
.jbox{background:#F8FAFC;border-radius:8px;padding:12px 14px;margin-bottom:18px;}
.jttl{font-weight:700;font-size:14px;}
table{width:100%;border-collapse:collapse;margin-bottom:16px;}
th{background:#0F172A;color:#fff;padding:9px 12px;font-size:12px;text-align:right;}
td{padding:9px 12px;border-bottom:1px solid #F1F5F9;font-size:13px;}
.totals{background:#F8FAFC;border-radius:10px;padding:14px 16px;}
.trow{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#64748B;}
.grand{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:2px solid #0F172A;}
.g-lbl{font-size:16px;font-weight:700;color:#F97316;}
.g-val{font-size:20px;font-weight:900;color:#F97316;}
.ftr{margin-top:36px;padding-top:16px;border-top:1px solid #E2E8F0;text-align:center;color:#94A3B8;font-size:11px;}
</style></head><body>
<div class="hdr">
  <div><div class="biz">${profile.businessName||"TradePro"}</div>${tr?`<div class="cinfo">${tr.icon} ${tr.ar}</div>`:""}${profile.phone?`<div class="cinfo">📞 ${profile.phone}</div>`:""}</div>
  <div><div class="inv-num">${inv.invoice_number}</div><div class="inv-date">📅 ${fmtD(inv.created_at)}</div><div class="inv-date">الاستحقاق: ${fmtD(inv.due_date)}</div></div>
</div>
${cu?`<div class="sec"><div class="sec-lbl">العميل</div><div class="cname">${cu.name}</div><div class="cinfo">📞 ${cu.phone}</div>${cu.address?`<div class="cinfo">📍 ${cu.address}</div>`:""}</div>`:""}
${job?`<div class="jbox"><div class="sec-lbl">الخدمة</div><div class="jttl">${job.title}</div>${job.notes?`<div class="cinfo" style="margin-top:4px">${job.notes}</div>`:""}</div>`:""}
${(job?.materials||[]).length>0?`<table><tr><th>المادة</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>${(job.materials||[]).map(m=>`<tr><td>${m.name}</td><td>${m.qty} ${m.unit||""}</td><td>${fmtM(m.unit_price,sym)}</td><td>${fmtM(m.qty*m.unit_price,sym)}</td></tr>`).join("")}</table>`:""}
<div class="totals">
  <div class="trow"><span>عمالة (${job?.labor_hours||0} ساعة)</span><span>${fmtM((job?.labor_hours||0)*(job?.labor_rate||0),sym)}</span></div>
  <div class="trow"><span>مواد</span><span>${fmtM((job?.materials||[]).reduce((s,m)=>s+m.qty*m.unit_price,0),sym)}</span></div>
  <div class="trow"><span>قبل الضريبة</span><span>${fmtM(inv.subtotal,sym)}</span></div>
  ${inv.tax_rate>0?`<div class="trow"><span>ضريبة ${inv.tax_rate}%</span><span>${fmtM(taxAmt,sym)}</span></div>`:""}
  <div class="grand"><span class="g-lbl">الإجمالي</span><span class="g-val">${fmtM(inv.total,sym)}</span></div>
</div>
<div class="ftr"><p>شكراً لثقتكم — ${profile.businessName||"TradePro"}</p></div>
</body></html>`;
  const w = window.open("","_blank");
  if(w){ w.document.write(html); w.document.close(); w.onload=()=>w.print(); }
}

// ── CSV Export ────────────────────────────────────────────
function exportCSV(rows, fname) {
  const bom = "\uFEFF";
  const csv = rows.map(r=>r.map(c=>`"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const a   = document.createElement("a");
  a.href    = URL.createObjectURL(new Blob([bom+csv],{type:"text/csv;charset=utf-8;"}));
  a.download = fname; a.click();
}

export default function TradePro() {
  const [mounted,  setMounted]  = useState(false);
  const [S,        setS_]       = useState(INIT);
  const [screen,   setScreen]   = useState("dashboard");
  const [selId,    setSelId]    = useState(null);
  const [modal,    setModal]    = useState(null);
  const [sq,       setSq]       = useState("");
  const [soOpen,   setSoOpen]   = useState(false);
  const [online,   setOnline]   = useState(true);
  const [toast,    setToast]    = useState(null);
  const [drawer,   setDrawer]   = useState(false);
  const [cdel,     setCdel]     = useState(null);
  const [tSec,     setTSec]     = useState(0);
  const [tOn,      setTOn]      = useState(false);
  const [jf,       setJf]       = useState("all");
  const [aiMsgs,   setAiMsgs]   = useState([]);
  const [aiIn,     setAiIn]     = useState("");
  const [aiLoad,   setAiLoad]   = useState(false);
  const [notifOn,  setNotifOn]  = useState(false);
  const [photoMdl, setPhotoMdl] = useState(null);
  const aiRef   = useRef(null);
  const tRef    = useRef(null);
  const srchRef = useRef(null);
  const fileRef = useRef(null);

  // ── FIX HYDRATION ERROR: load localStorage only after mount ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK);
      if (raw) setS_({ ...INIT, ...JSON.parse(raw) });
    } catch {}
    setMounted(true);
    setOnline(navigator.onLine);
  }, []);

  const t   = TXT[S.lang];
  const dir = t.dir;
  const cur = CURRENCIES.find(c=>c.code===S.profile.currency)||CURRENCIES[0];
  const sym = cur.symbol;

  const setS = useCallback((u) => {
    setS_(p => {
      const n = typeof u === "function" ? u(p) : { ...p, ...u };
      try { localStorage.setItem(SK, JSON.stringify(n)); } catch {}
      return n;
    });
  }, []);

  // Cross-tab sync
  useEffect(() => {
    if (!mounted) return;
    const h = (e) => {
      if (e.key === SK && e.newValue) {
        try { setS_(JSON.parse(e.newValue)); showToast("🔄 " + t.syncSuccess); } catch {}
      }
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, [mounted]);

  // Online/offline
  useEffect(() => {
    if (!mounted) return;
    const on  = () => { setOnline(true);  showToast("✅ " + t.online); };
    const off = () => setOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [mounted]);

  // Timer
  useEffect(() => {
    if (tOn) { tRef.current = setInterval(() => setTSec(p => p + 1), 1000); }
    else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [tOn]);

  // Search outside click
  useEffect(() => {
    const h = (e) => { if (srchRef.current && !srchRef.current.contains(e.target)) setSoOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Scroll AI
  useEffect(() => { aiRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMsgs]);

  // AI welcome
  useEffect(() => {
    if (aiMsgs.length === 0 && mounted) {
      const msg = S.lang === "ar"
        ? "مرحباً! 🤖 أنا مساعدك المجاني في TradePro.\n\nأعمل بدون إنترنت أو API key — ذكاء اصطناعي محلي مجاني!\n\nاسألني عن:\n• إيراداتك ومهامك\n• الفواتير المعلقة\n• نصائح التسعير\n• رسائل واتساب للعملاء\n• نصائح لتنمية نشاطك"
        : "Hello! 🤖 I'm your free TradePro AI assistant.\n\nWorks offline — no API key needed!\n\nAsk me about:\n• Your revenue and jobs\n• Pending invoices\n• Pricing tips\n• WhatsApp messages\n• Business growth tips";
      setAiMsgs([{ role: "assistant", content: msg, ts: new Date().toISOString() }]);
    }
  }, [mounted]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const nav = (s, id = null) => { setScreen(s); setSelId(id); setDrawer(false); setSoOpen(false); setSq(""); };
  const fmtSec = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // DATA
  const addCust   = (d) => { setS(p=>({...p,customers:[...p.customers,{id:uid(),...d,created_at:new Date().toISOString()}]})); showToast("✅"); setModal(null); };
  const updCust   = (id,d) => { setS(p=>({...p,customers:p.customers.map(c=>c.id===id?{...c,...d}:c)})); showToast("✅"); setModal(null); };
  const delCust   = (id) => { setS(p=>({...p,customers:p.customers.filter(c=>c.id!==id)})); nav("customers"); showToast("🗑"); };
  const addJob    = (d) => { setS(p=>({...p,jobs:[...p.jobs,{id:uid(),...d,materials:d.materials||[],photos:[],status:"scheduled",created_at:new Date().toISOString()}]})); showToast("✅"); setModal(null); };
  const updJob    = (id,d) => { setS(p=>({...p,jobs:p.jobs.map(j=>j.id===id?{...j,...d}:j)})); showToast("✅"); setModal(null); };
  const updJStat  = (id,st) => { setS(p=>({...p,jobs:p.jobs.map(j=>j.id===id?{...j,status:st,completed_at:st==="done"?new Date().toISOString():j.completed_at}:j)})); showToast("✅ "+t[st]); };
  const delJob    = (id) => { setS(p=>({...p,jobs:p.jobs.filter(j=>j.id!==id)})); nav("jobs"); showToast("🗑"); };
  const addExp    = (d) => { setS(p=>({...p,expenses:[...p.expenses,{id:uid(),...d,created_at:new Date().toISOString()}]})); showToast("✅"); };

  const mkInv = (jobId) => {
    const job = S.jobs.find(j=>j.id===jobId); if (!job) return;
    const sub  = jTotal(job);
    const taxA = sub*(S.profile.taxRate||0)/100;
    const inv  = { id:uid(), job_id:jobId, invoice_number:`${S.profile.invoicePrefix}${String(S.invoiceCounter).padStart(4,"0")}`, subtotal:sub, tax_rate:S.profile.taxRate||0, total:sub+taxA, status:"draft", created_at:new Date().toISOString(), due_date:new Date(Date.now()+15*86400000).toISOString().split("T")[0], currency:S.profile.currency };
    setS(p=>({...p,invoices:[...p.invoices,inv],invoiceCounter:p.invoiceCounter+1,jobs:p.jobs.map(j=>j.id===jobId?{...j,status:"invoiced"}:j)}));
    nav("invoice-detail", inv.id); showToast("📋 " + t.createInvoice);
  };

  const updInv = (id,st) => {
    setS(p=>({...p,invoices:p.invoices.map(i=>i.id===id?{...i,status:st,paid_at:st==="paid"?new Date().toISOString():i.paid_at,sent_at:st==="sent"?new Date().toISOString():i.sent_at}:i)}));
    showToast("✅ "+t[st]);
  };

  const addPhoto = (jobId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setS(p=>({...p,jobs:p.jobs.map(j=>j.id===jobId?{...j,photos:[...(j.photos||[]),{id:uid(),url:e.target.result,ts:new Date().toISOString()}]}:j)}));
      showToast("📷 " + t.addPhoto);
    };
    reader.readAsDataURL(file);
  };

  const sendAI = (custom) => {
    const msg = (custom || aiIn).trim();
    if (!msg || aiLoad) return;
    setAiMsgs(p=>[...p,{role:"user",content:msg,ts:new Date().toISOString()}]);
    setAiIn("");
    setAiLoad(true);
    setTimeout(() => {
      const reply = builtinAI(msg, S, sym, t);
      setAiMsgs(p=>[...p,{role:"assistant",content:reply,ts:new Date().toISOString()}]);
      setAiLoad(false);
    }, 350);
  };

  const QP = S.lang==="ar"
    ? ["إيراداتي هذا الشهر","الفواتير المعلقة","مهام اليوم","نصائح التسعير","رسالة واتساب","كيف أزيد دخلي؟","أفضل عملائي","ربحي الصافي"]
    : ["Revenue this month","Pending invoices","Today's jobs","Pricing tips","WhatsApp message","Grow income","Top clients","Net profit"];

  // Search
  const sRes = useMemo(() => sq.length>1 ? [
    ...S.customers.filter(c=>c.name?.toLowerCase().includes(sq.toLowerCase())||c.phone?.includes(sq)).map(c=>({type:"customer",id:c.id,title:c.name,sub:c.phone,icon:"◉"})),
    ...S.jobs.filter(j=>j.title?.toLowerCase().includes(sq.toLowerCase())).map(j=>({type:"job",id:j.id,title:j.title,sub:S.customers.find(c=>c.id===j.customer_id)?.name||"",icon:"⚙"})),
  ] : [], [sq, S.customers, S.jobs]);

  // Stats
  const pAmt     = useMemo(()=>S.invoices.filter(i=>i.status==="sent"||i.status==="overdue").reduce((s,i)=>s+i.total,0),[S.invoices]);
  const cAmt     = useMemo(()=>S.invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.total,0),[S.invoices]);
  const aJobs    = useMemo(()=>S.jobs.filter(j=>j.status==="scheduled"||j.status==="in_progress"),[S.jobs]);
  const tJobs    = useMemo(()=>{const d=new Date().toISOString().split("T")[0];return S.jobs.filter(j=>j.scheduled_at?.startsWith(d));},[S.jobs]);
  const totalExp = useMemo(()=>(S.expenses||[]).reduce((s,e)=>s+(e.amount||0),0),[S.expenses]);
  const selJ = S.jobs.find(j=>j.id===selId);
  const selC = S.customers.find(c=>c.id===selId);
  const selI = S.invoices.find(i=>i.id===selId);

  // Loading screen (fix hydration)
  if (!mounted) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0F172A"}}>
      <div style={{color:"#F97316",fontSize:26,fontWeight:900,fontFamily:"sans-serif"}}>⚡ TradePro</div>
    </div>
  );

  // DESIGN
  const C={sb:"#0F172A",sb2:"#1E293B",acc:"#F97316",accD:"#EA580C",bg:"#F1F5F9",card:"#FFFFFF",bdr:"#E2E8F0",tx:"#0F172A",mu:"#64748B",li:"#94A3B8",ok:"#10B981",er:"#EF4444",wa:"#F59E0B",pu:"#8B5CF6",ai:"#6366F1",aiD:"#4F46E5"};
  const iS={width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${C.bdr}`,fontSize:14,background:"#fff",color:C.tx,boxSizing:"border-box",fontFamily:"inherit",outline:"none"};

  // Micro components
  const Bdg=({st,tp="job"})=>{const cc=(tp==="job"?SC:IC)[st]||{bg:"#eee",text:"#555"};return<span style={{background:cc.bg,color:cc.text,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{t[st]||st}</span>;};
  const Dot=({st,tp="job"})=>{const cc=(tp==="job"?SC:IC)[st]||{dot:"#ccc"};return<div style={{width:8,height:8,borderRadius:"50%",background:cc.dot,flexShrink:0}}/>;};
  const Btn=({label,onClick,col,out=false,sm=false,icon="",disabled=false})=>(
    <button onClick={onClick} disabled={disabled} style={{padding:sm?"6px 12px":"10px 18px",borderRadius:9,border:out?`1.5px solid ${col||C.acc}`:"none",background:out?"transparent":disabled?C.bg:`linear-gradient(135deg,${col||C.acc},${col?col+"bb":C.accD})`,color:out?(col||C.acc):disabled?C.mu:"#fff",fontWeight:700,fontSize:sm?12:13,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",flexShrink:0,opacity:disabled?0.6:1}}>
      {icon&&<span>{icon}</span>}{label}
    </button>
  );
  const Fld=({label,children,half})=>(
    <div style={{marginBottom:12,flex:half?"1 1 45%":"1 1 100%",minWidth:0}}>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:C.mu,marginBottom:4}}>{label}</label>
      {children}
    </div>
  );
  const IR=({label,value,bold,acc})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.bdr}`}}>
      <span style={{fontSize:12,color:C.mu}}>{label}</span>
      <span style={{fontSize:13,color:acc?C.acc:C.tx,fontWeight:bold?800:500}}>{value}</span>
    </div>
  );
  const Card=({title,children,action})=>(
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.bdr}`,marginBottom:14,overflow:"hidden"}}>
      {title&&<div style={{padding:"12px 18px",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:13,color:C.tx}}>{title}</span>{action}
      </div>}
      <div style={{padding:"14px 18px"}}>{children}</div>
    </div>
  );
  const Emp=({icon,label})=>(
    <div style={{textAlign:"center",padding:"50px 20px"}}>
      <div style={{fontSize:44,marginBottom:10}}>{icon}</div>
      <p style={{color:C.mu,fontSize:14,margin:"0 0 4px"}}>{label}</p>
      <p style={{color:C.li,fontSize:12}}>{t.addFirst}</p>
    </div>
  );
  const Mdl=({title,onClose,children,wide})=>(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,borderRadius:16,width:"100%",maxWidth:wide?680:500,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:`1px solid ${C.bdr}`,position:"sticky",top:0,background:C.card,zIndex:1}}>
          <h2 style={{margin:0,fontSize:15,fontWeight:700,color:C.tx}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mu}}>×</button>
        </div>
        <div style={{padding:"16px 20px"}}>{children}</div>
      </div>
    </div>
  );
  const Stat=({label,value,sub,col,icon})=>(
    <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.bdr}`,padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{color:C.mu,fontSize:11,fontWeight:600,margin:"0 0 6px"}}>{label}</p>
          <p style={{color:col||C.tx,fontSize:19,fontWeight:900,margin:"0 0 2px",letterSpacing:-0.5}}>{value}</p>
          {sub&&<p style={{color:C.li,fontSize:11,margin:0}}>{sub}</p>}
        </div>
        <div style={{width:38,height:38,borderRadius:10,background:`${col||C.acc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{icon}</div>
      </div>
    </div>
  );
  const JRow=({job,onClick})=>{
    const cu=S.customers.find(c=>c.id===job.customer_id);
    return(
      <div onClick={onClick} style={{background:C.card,borderRadius:10,border:`1px solid ${C.bdr}`,padding:"11px 13px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"box-shadow 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
        <Dot st={job.status}/>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontWeight:600,fontSize:13,color:C.tx,margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</p>
          <p style={{fontSize:11,color:C.mu,margin:0}}>{cu?.name||"—"}{job.scheduled_at?" · "+fmtD(job.scheduled_at):""}{(job.photos||[]).length>0?` 📷${job.photos.length}`:""}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
          <Bdg st={job.status}/>
          <span style={{fontSize:12,fontWeight:700,color:C.tx}}>{fmtM(jTotal(job),sym)}</span>
        </div>
      </div>
    );
  };
  const IRow=({inv,onClick})=>{
    const job=S.jobs.find(j=>j.id===inv.job_id);
    const cu=S.customers.find(c=>c.id===job?.customer_id);
    const iSym=(CURRENCIES.find(c=>c.code===inv.currency)||cur).symbol;
    return(
      <div onClick={onClick} style={{background:C.card,borderRadius:10,border:`1px solid ${C.bdr}`,padding:"11px 13px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"box-shadow 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
        <Dot st={inv.status} tp="invoice"/>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontWeight:700,fontSize:13,color:C.tx,margin:"0 0 2px"}}>{inv.invoice_number}</p>
          <p style={{fontSize:11,color:C.mu,margin:0}}>{cu?.name||"—"} · {fmtD(inv.created_at)}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
          <Bdg st={inv.status} tp="invoice"/>
          <span style={{fontSize:13,fontWeight:800,color:C.tx}}>{fmtM(inv.total,iSym)}</span>
        </div>
      </div>
    );
  };

  // Sidebar
  const navItems=[
    {key:"dashboard",icon:"⊞",label:t.dashboard},
    {key:"jobs",icon:"⚙",label:t.jobs,badge:aJobs.length||null},
    {key:"customers",icon:"◉",label:t.customers},
    {key:"invoices",icon:"◧",label:t.invoices,badge:S.invoices.filter(i=>i.status==="overdue").length||null},
    {key:"expenses",icon:"💸",label:t.expenses},
    {key:"reports",icon:"📊",label:t.reports},
    {key:"ai",icon:"🤖",label:t.ai},
    {key:"settings",icon:"⚙︎",label:t.settings},
  ];
  const SB=()=>(
    <div style={{width:240,minWidth:240,background:C.sb,display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 16px 14px",borderBottom:"1px solid #1E293B",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${C.acc},${C.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:16,flexShrink:0}}>T</div>
          <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>TradePro</div><div style={{color:C.li,fontSize:10}}>أداة المقاول الذكي</div></div>
        </div>
        {S.profile.businessName&&<p style={{color:C.li,fontSize:11,margin:"8px 0 0",paddingTop:8,borderTop:"1px solid #1E293B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{S.profile.businessName}</p>}
      </div>
      <nav style={{flex:1,padding:"8px 8px",overflowY:"auto"}}>
        {navItems.map(item=>{
          const active=screen===item.key;
          const isAI=item.key==="ai";
          return(
            <button key={item.key} onClick={()=>nav(item.key)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,background:active?(isAI?"#312E81":C.sb2):"transparent",border:active?`1px solid ${isAI?"#4338CA":"#334155"}`:"1px solid transparent",cursor:"pointer",marginBottom:2,textAlign:dir==="rtl"?"right":"left"}}>
              <span style={{fontSize:15,color:active?(isAI?C.ai:C.acc):C.li,lineHeight:1,flexShrink:0}}>{item.icon}</span>
              <span style={{color:active?"#fff":C.li,fontWeight:active?700:400,fontSize:12,flex:1,textAlign:"start"}}>{item.label}</span>
              {item.badge>0&&<span style={{background:isAI?C.ai:C.er,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:18}}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"10px 12px",borderTop:"1px solid #1E293B",borderBottom:"1px solid #1E293B",flexShrink:0}}>
        <p style={{color:C.li,fontSize:10,margin:"0 0 6px",fontWeight:600}}>{t.jobTimer}</p>
        <div style={{background:C.sb2,borderRadius:8,padding:"8px 10px"}}>
          <p style={{color:tOn?C.acc:"#fff",fontSize:19,fontWeight:900,margin:"0 0 6px",fontVariantNumeric:"tabular-nums",letterSpacing:1}}>{fmtSec(tSec)}</p>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setTOn(p=>!p)} style={{flex:1,padding:"5px 0",borderRadius:6,border:"none",background:tOn?C.er:C.ok,color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{tOn?t.stopTimer:t.startTimer}</button>
            {!tOn&&tSec>0&&<button onClick={()=>setTSec(0)} style={{padding:"5px 8px",borderRadius:6,border:"none",background:"#334155",color:"#fff",fontSize:11,cursor:"pointer"}}>↺</button>}
          </div>
        </div>
      </div>
      <div style={{padding:"10px 10px 14px",flexShrink:0}}>
        <button onClick={()=>setModal("add-job")} style={{width:"100%",padding:"10px 0",background:`linear-gradient(135deg,${C.acc},${C.accD})`,color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 12px rgba(249,115,22,0.3)`}}>+ {t.newJob}</button>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:7,paddingInlineStart:2}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:online?C.ok:C.er}}/>
            <span style={{color:C.li,fontSize:10}}>{online?t.online:t.offline}</span>
          </div>
          <span style={{color:C.li,fontSize:10}}>{t.savedLocally}</span>
        </div>
      </div>
    </div>
  );

  // Top bar
  const detS=["job-detail","invoice-detail","customer-detail"];
  const TB=({title})=>(
    <div style={{background:C.card,borderBottom:`1px solid ${C.bdr}`,padding:"0 12px",height:52,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      <button className="tp-ham" onClick={()=>setDrawer(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.tx,padding:4,lineHeight:1,flexShrink:0}}>☰</button>
      {detS.includes(screen)&&(
        <button onClick={()=>nav(screen==="job-detail"?"jobs":screen==="invoice-detail"?"invoices":"customers")} style={{background:"none",border:"none",cursor:"pointer",color:C.acc,fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:3,whiteSpace:"nowrap",flexShrink:0}}>
          {dir==="rtl"?"→":"←"} {t.back}
        </button>
      )}
      <h1 style={{fontSize:13,fontWeight:700,color:C.tx,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:"0 1 auto"}}>{title}</h1>
      <div ref={srchRef} style={{position:"relative",flex:1,minWidth:0,maxWidth:360}}>
        <input value={sq} onChange={e=>{setSq(e.target.value);setSoOpen(true);}} onFocus={()=>setSoOpen(true)} placeholder={t.search}
          style={{width:"100%",padding:"6px 10px 6px 30px",borderRadius:7,border:`1.5px solid ${C.bdr}`,fontSize:12,background:C.bg,color:C.tx,outline:"none",boxSizing:"border-box"}}/>
        <span style={{position:"absolute",insetInlineStart:8,top:"50%",transform:"translateY(-50%)",color:C.li,fontSize:12,pointerEvents:"none"}}>🔍</span>
        {soOpen&&sq.length>1&&(
          <div style={{position:"absolute",top:"calc(100% + 5px)",insetInlineStart:0,insetInlineEnd:0,background:C.card,borderRadius:8,boxShadow:"0 8px 28px rgba(0,0,0,0.14)",border:`1px solid ${C.bdr}`,zIndex:999,maxHeight:220,overflowY:"auto"}}>
            {sRes.length===0
              ?<div style={{padding:"12px",color:C.mu,fontSize:12,textAlign:"center"}}>{t.noResults}</div>
              :sRes.map(r=>(
                <button key={r.id} onClick={()=>{setSq("");setSoOpen(false);nav(r.type==="customer"?"customer-detail":"job-detail",r.id);}}
                  style={{width:"100%",padding:"9px 12px",textAlign:dir==="rtl"?"right":"left",background:"none",border:"none",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14,flexShrink:0}}>{r.icon}</span>
                  <div><div style={{fontWeight:600,fontSize:12,color:C.tx}}>{r.title}</div><div style={{fontSize:11,color:C.mu}}>{r.sub}</div></div>
                </button>
              ))}
          </div>
        )}
      </div>
      <select value={S.profile.currency} onChange={e=>setS(p=>({...p,profile:{...p.profile,currency:e.target.value}}))}
        style={{padding:"5px 6px",borderRadius:6,border:`1px solid ${C.bdr}`,fontSize:11,background:C.bg,color:C.tx,cursor:"pointer",flexShrink:0,maxWidth:85}}>
        {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
      </select>
      <button onClick={()=>setS(p=>({...p,lang:p.lang==="ar"?"en":"ar"}))}
        style={{background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:6,padding:"5px 8px",fontSize:11,fontWeight:700,color:C.mu,cursor:"pointer",flexShrink:0}}>
        {S.lang==="ar"?"EN":"عربي"}
      </button>
    </div>
  );

  // Forms
  const CustForm=({init,onSave,onClose})=>{
    const [f,sf]=useState(init||{name:"",phone:"",address:"",notes:""});
    return(
      <>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          <Fld label={t.name+" *"} half><input value={f.name} onChange={e=>sf(p=>({...p,name:e.target.value}))} style={iS} placeholder={S.lang==="ar"?"أحمد الزهراني":"John Smith"}/></Fld>
          <Fld label={t.phone+" *"} half><input value={f.phone} onChange={e=>sf(p=>({...p,phone:e.target.value}))} style={iS} type="tel" placeholder="05XXXXXXXX"/></Fld>
        </div>
        <Fld label={t.address}><input value={f.address} onChange={e=>sf(p=>({...p,address:e.target.value}))} style={iS}/></Fld>
        <Fld label={t.notes}><textarea value={f.notes} onChange={e=>sf(p=>({...p,notes:e.target.value}))} style={{...iS,resize:"none"}} rows={3}/></Fld>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"9px 0",borderRadius:7,border:`1.5px solid ${C.bdr}`,background:"#fff",color:C.mu,fontWeight:600,cursor:"pointer",fontSize:13}}>{t.cancel}</button>
          <button onClick={()=>f.name&&f.phone&&onSave(f)} style={{flex:2,padding:"9px 0",borderRadius:7,border:"none",background:`linear-gradient(135deg,${C.acc},${C.accD})`,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>{t.save}</button>
        </div>
      </>
    );
  };

  const JobForm=({init,onSave,onClose})=>{
    const [f,sf]=useState(init||{customer_id:"",title:"",scheduled_at:"",labor_hours:"",labor_rate:"",notes:"",materials:[]});
    const [mat,smat]=useState({name:"",qty:"1",unit_price:"",unit:"قطعة"});
    const lT=(Number(f.labor_hours)||0)*(Number(f.labor_rate)||0);
    const mT=(f.materials||[]).reduce((s,m)=>s+(m.qty||0)*(m.unit_price||0),0);
    const taxA=(lT+mT)*(S.profile.taxRate||0)/100;
    return(
      <>
        <Fld label={t.customers+" *"}>
          <select value={f.customer_id} onChange={e=>sf(p=>({...p,customer_id:e.target.value}))} style={{...iS,color:f.customer_id?C.tx:C.li}}>
            <option value="">{t.selectCustomer}</option>
            {S.customers.map(c=><option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
          </select>
        </Fld>
        <Fld label={t.jobTitle+" *"}><input value={f.title} onChange={e=>sf(p=>({...p,title:e.target.value}))} style={iS}/></Fld>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          <Fld label={t.scheduledAt} half><input value={f.scheduled_at} onChange={e=>sf(p=>({...p,scheduled_at:e.target.value}))} type="datetime-local" style={iS}/></Fld>
          <Fld label={`${t.laborRate} (${sym})`} half><input value={f.labor_rate} onChange={e=>sf(p=>({...p,labor_rate:e.target.value}))} type="number" style={iS} placeholder="0"/></Fld>
          <Fld label={t.laborHours} half><input value={f.labor_hours} onChange={e=>sf(p=>({...p,labor_hours:e.target.value}))} type="number" style={iS} placeholder="0"/></Fld>
        </div>
        <Fld label={t.notes}><textarea value={f.notes} onChange={e=>sf(p=>({...p,notes:e.target.value}))} style={{...iS,resize:"none"}} rows={2}/></Fld>
        <div style={{background:C.bg,borderRadius:8,padding:12,marginBottom:12}}>
          <p style={{fontWeight:700,fontSize:12,color:C.mu,margin:"0 0 8px"}}>{t.materials}</p>
          {(f.materials||[]).map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.bdr}`}}>
              <span style={{fontSize:12,color:C.tx}}>{m.name} × {m.qty} {m.unit}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontWeight:700,fontSize:12}}>{fmtM(m.qty*m.unit_price,sym)}</span>
                <button onClick={()=>sf(p=>({...p,materials:p.materials.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",cursor:"pointer",color:C.er,fontSize:16}}>×</button>
              </div>
            </div>
          ))}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:7,marginTop:8}}>
            <input value={mat.name} onChange={e=>smat(p=>({...p,name:e.target.value}))} placeholder={t.materialName} style={{...iS,fontSize:12}}/>
            <input value={mat.qty} onChange={e=>smat(p=>({...p,qty:e.target.value}))} type="number" placeholder={t.qty} style={{...iS,fontSize:12}}/>
            <input value={mat.unit_price} onChange={e=>smat(p=>({...p,unit_price:e.target.value}))} type="number" placeholder={t.unitPrice} style={{...iS,fontSize:12}}/>
          </div>
          <button onClick={()=>{if(!mat.name||!mat.unit_price)return;sf(p=>({...p,materials:[...(p.materials||[]),{...mat,qty:Number(mat.qty),unit_price:Number(mat.unit_price),id:uid()}]}));smat({name:"",qty:"1",unit_price:"",unit:"قطعة"});}}
            style={{marginTop:7,width:"100%",background:"#fff",color:C.acc,border:`1.5px dashed ${C.acc}`,borderRadius:7,padding:"6px 0",cursor:"pointer",fontWeight:600,fontSize:12}}>{t.addMaterial}</button>
        </div>
        {(lT+mT)>0&&(
          <div style={{background:C.sb,borderRadius:8,padding:"11px 13px",marginBottom:12}}>
            <IR label={t.laborTotal} value={fmtM(lT,sym)}/>
            <IR label={t.matsTotal} value={fmtM(mT,sym)}/>
            {S.profile.taxRate>0&&<IR label={`${t.tax} ${S.profile.taxRate}%`} value={fmtM(taxA,sym)}/>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"1px solid #334155"}}>
              <span style={{color:C.acc,fontWeight:700,fontSize:13}}>{t.grandTotal}</span>
              <span style={{color:C.acc,fontWeight:900,fontSize:17}}>{fmtM(lT+mT+taxA,sym)}</span>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"9px 0",borderRadius:7,border:`1.5px solid ${C.bdr}`,background:"#fff",color:C.mu,fontWeight:600,cursor:"pointer",fontSize:13}}>{t.cancel}</button>
          <button onClick={()=>f.customer_id&&f.title&&onSave(f)} style={{flex:2,padding:"9px 0",borderRadius:7,border:"none",background:`linear-gradient(135deg,${C.acc},${C.accD})`,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>⚡ {t.save}</button>
        </div>
      </>
    );
  };

  // SCREENS
  const Dashboard=()=>(
    <div style={{padding:"16px"}}>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:900,color:C.tx,margin:"0 0 2px"}}>{t.welcome}{S.profile.fullName?`، ${S.profile.fullName}`:""}</h2>
        <p style={{color:C.mu,fontSize:12,margin:0}}>{S.profile.trade&&TRADES[S.profile.trade]?`${TRADES[S.profile.trade].icon} ${TRADES[S.profile.trade][S.lang]} · `:""}{fmtD(new Date().toISOString())}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:9,marginBottom:16}}>
        <Stat label={t.totalPending} value={fmtM(pAmt,sym)} col={C.wa} icon="💰" sub={`${S.invoices.filter(i=>i.status==="sent"||i.status==="overdue").length} ${t.invoices}`}/>
        <Stat label={t.totalPaid} value={fmtM(cAmt,sym)} col={C.ok} icon="✅"/>
        <Stat label={t.profit} value={fmtM(cAmt-totalExp,sym)} col={C.pu} icon="📈" sub={`${t.totalExpenses}: ${fmtM(totalExp,sym)}`}/>
        <Stat label={t.activeJobs} value={aJobs.length} col={C.acc} icon="⚙"/>
      </div>
      {S.invoices.filter(i=>i.status==="overdue").length>0&&(
        <div style={{background:"#FEF2F2",border:`1px solid ${C.er}40`,borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:700,color:C.er,margin:0,fontSize:12}}>{S.lang==="ar"?`${S.invoices.filter(i=>i.status==="overdue").length} فاتورة متأخرة!`:`${S.invoices.filter(i=>i.status==="overdue").length} overdue invoices!`}</p>
            <p style={{color:"#991B1B",fontSize:11,margin:0}}>{fmtM(S.invoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.total,0),sym)}</p>
          </div>
          <button onClick={()=>nav("invoices")} style={{background:C.er,color:"#fff",border:"none",borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{t.invoices}</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12,marginBottom:12}}>
        <Card title={t.todayJobs} action={<button onClick={()=>nav("jobs")} style={{background:"none",border:"none",color:C.acc,fontSize:11,fontWeight:700,cursor:"pointer"}}>{t.allJobs} →</button>}>
          {tJobs.length===0?<p style={{color:C.li,fontSize:12,textAlign:"center",padding:"12px 0"}}>📅 {S.lang==="ar"?"لا مهام اليوم":"No jobs today"}</p>
            :tJobs.map(j=><JRow key={j.id} job={j} onClick={()=>nav("job-detail",j.id)}/>)}
        </Card>
        <Card title={t.pendingInvoices}>
          {S.invoices.filter(i=>i.status==="sent"||i.status==="overdue").length===0
            ?<p style={{color:C.li,fontSize:12,textAlign:"center",padding:"12px 0"}}>✅ {S.lang==="ar"?"لا فواتير معلقة":"No pending"}</p>
            :S.invoices.filter(i=>i.status==="sent"||i.status==="overdue").map(i=><IRow key={i.id} inv={i} onClick={()=>nav("invoice-detail",i.id)}/>)}
        </Card>
      </div>
      <Card title={`🤖 ${t.ai}`} action={<button onClick={()=>nav("ai")} style={{background:"none",border:"none",color:C.ai,fontSize:11,fontWeight:700,cursor:"pointer"}}>{S.lang==="ar"?"فتح →":"Open →"}</button>}>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {QP.slice(0,4).map((p,i)=>(
            <button key={i} onClick={()=>{nav("ai");setTimeout(()=>sendAI(p),100);}}
              style={{padding:"5px 11px",borderRadius:18,border:`1.5px solid ${C.ai}30`,background:`${C.ai}08`,color:C.ai,fontSize:11,fontWeight:600,cursor:"pointer"}}>
              {p.length>28?p.slice(0,28)+"...":p}
            </button>
          ))}
        </div>
      </Card>
      <Card title={`📝 ${t.quickNote}`}><QuickNoteBox/></Card>
    </div>
  );

  const QuickNoteBox=()=>{
    const [v,sv]=useState("");
    return(
      <div>
        <textarea value={v} onChange={e=>sv(e.target.value)} rows={2} placeholder={S.lang==="ar"?"ملاحظة سريعة...":"Quick note..."} style={{...iS,resize:"none",marginBottom:7,fontSize:12}}/>
        <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{if(!v.trim())return;setS(p=>({...p,notes:[{id:uid(),text:v,ts:new Date().toISOString()},...(p.notes||[])]}));sv("");showToast("📝 "+t.dataSaved);}}
            style={{padding:"5px 12px",borderRadius:6,border:"none",background:C.acc,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>{t.saveNote}</button>
          {(S.notes||[]).slice(0,2).map(n=>(
            <div key={n.id} style={{background:C.bg,borderRadius:6,padding:"4px 9px",fontSize:11,color:C.tx,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",border:`1px solid ${C.bdr}`}}>{n.text}</div>
          ))}
        </div>
      </div>
    );
  };

  const AIScr=()=>{
    const fmt=(txt)=>txt.split("\n").map((line,i)=>{
      if(line.startsWith("**")&&line.endsWith("**"))return<p key={i} style={{fontWeight:700,color:C.tx,fontSize:13,margin:"3px 0"}}>{line.slice(2,-2)}</p>;
      if(line.startsWith("• ")||line.startsWith("- "))return<div key={i} style={{display:"flex",gap:5,marginBottom:3}}><span style={{color:C.ai,flexShrink:0}}>•</span><span style={{fontSize:13,color:C.tx,lineHeight:1.6}}>{line.slice(2).replace(/\*\*(.*?)\*\*/g,"$1")}</span></div>;
      if(/^\d+\./.test(line))return<div key={i} style={{display:"flex",gap:5,marginBottom:3}}><span style={{color:C.ai,fontWeight:700,flexShrink:0}}>{line.match(/^\d+/)[0]}.</span><span style={{fontSize:13,color:C.tx,lineHeight:1.6}}>{line.replace(/^\d+\.\s*/,"").replace(/\*\*(.*?)\*\*/g,"$1")}</span></div>;
      if(line.startsWith("---"))return<hr key={i} style={{border:"none",borderTop:`1px solid ${C.bdr}`,margin:"6px 0"}}/>;
      if(line==="")return<div key={i} style={{height:4}}/>;
      return<p key={i} style={{fontSize:13,color:C.tx,lineHeight:1.7,margin:"2px 0"}}>{line.replace(/\*\*(.*?)\*\*/g,"$1")}</p>;
    });
    return(
      <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${C.ai},${C.aiD})`,padding:"14px 16px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <h2 style={{color:"#fff",fontWeight:800,fontSize:15,margin:"0 0 2px"}}>{t.aiTitle}</h2>
              <p style={{color:"rgba(255,255,255,0.7)",fontSize:11,margin:0}}>{t.aiSubtitle}</p>
            </div>
            <button onClick={()=>setAiMsgs([{role:"assistant",content:S.lang==="ar"?"مرحباً! كيف أساعدك؟":"Hi! How can I help?",ts:new Date().toISOString()}])}
              style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:7,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>{t.aiClear}</button>
          </div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
            {QP.map((p,i)=>(
              <button key={i} onClick={()=>sendAI(p)} style={{padding:"4px 10px",borderRadius:16,border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:10,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                {p.length>22?p.slice(0,22)+"...":p}
              </button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {aiMsgs.map((msg,i)=>(
            <div key={i} style={{display:"flex",gap:7,flexDirection:msg.role==="user"?(dir==="rtl"?"row":"row-reverse"):(dir==="rtl"?"row-reverse":"row"),alignItems:"flex-start"}}>
              <div style={{width:28,height:28,borderRadius:7,background:msg.role==="user"?`linear-gradient(135deg,${C.acc},${C.accD})`:`linear-gradient(135deg,${C.ai},${C.aiD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                {msg.role==="user"?"👤":"🤖"}
              </div>
              <div style={{maxWidth:"80%",background:msg.role==="user"?`${C.acc}10`:C.card,border:`1px solid ${msg.role==="user"?C.acc+"30":C.bdr}`,borderRadius:msg.role==="user"?(dir==="rtl"?"13px 3px 13px 13px":"3px 13px 13px 13px"):(dir==="rtl"?"3px 13px 13px 13px":"13px 3px 13px 13px"),padding:"9px 12px"}}>
                {fmt(msg.content)}
                <p style={{fontSize:9,color:C.li,margin:"4px 0 0",textAlign:"end"}}>{fmtT(msg.ts)}</p>
              </div>
            </div>
          ))}
          {aiLoad&&(
            <div style={{display:"flex",gap:7,alignItems:"flex-start",flexDirection:dir==="rtl"?"row-reverse":"row"}}>
              <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${C.ai},${C.aiD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🤖</div>
              <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:"13px 3px 13px 13px",padding:"10px 13px",display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.ai,animation:`tp_b 1.2s ${i*0.2}s infinite`}}/>)}
                <span style={{color:C.mu,fontSize:11,marginInlineStart:5}}>{t.aiThinking}</span>
              </div>
            </div>
          )}
          <div ref={aiRef}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.bdr}`,background:C.card,flexShrink:0}}>
          <div style={{display:"flex",gap:7}}>
            <input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAI();}}}
              placeholder={t.aiPlaceholder} disabled={aiLoad}
              style={{...iS,flex:1,borderRadius:9,padding:"9px 12px",fontSize:13}}/>
            <button onClick={()=>sendAI()} disabled={aiLoad||!aiIn.trim()}
              style={{padding:"9px 14px",borderRadius:9,border:"none",background:aiLoad||!aiIn.trim()?C.bg:`linear-gradient(135deg,${C.ai},${C.aiD})`,color:aiLoad||!aiIn.trim()?C.li:"#fff",fontWeight:700,fontSize:13,cursor:aiLoad||!aiIn.trim()?"not-allowed":"pointer",flexShrink:0}}>
              ↑
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Jobs=()=>{
    const fl=jf==="all"?S.jobs:S.jobs.filter(j=>j.status===jf);
    return(
      <div style={{padding:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:7}}>
          <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:0}}>{t.jobs} ({S.jobs.length})</h2>
          <div style={{display:"flex",gap:7}}>
            <Btn label={t.exportExcel} col={C.ok} sm icon="📊" onClick={()=>{const rows=[[S.lang==="ar"?"العميل":"Client","Job","Status","Total","Date"]];S.jobs.forEach(j=>{const cu=S.customers.find(c=>c.id===j.customer_id);rows.push([cu?.name||"",j.title,t[j.status],jTotal(j).toFixed(2),fmtD(j.scheduled_at)]);});exportCSV(rows,"jobs.csv");}}/>
            <Btn label={t.newJob} onClick={()=>setModal("add-job")} icon="+"/>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {["all","scheduled","in_progress","done","invoiced"].map(f=>(
            <button key={f} onClick={()=>setJf(f)} style={{padding:"5px 12px",borderRadius:16,cursor:"pointer",fontWeight:jf===f?700:400,fontSize:11,background:jf===f?C.sb:C.card,color:jf===f?"#fff":C.mu,border:`1px solid ${jf===f?C.sb:C.bdr}`}}>
              {f==="all"?(S.lang==="ar"?"الكل":"All"):t[f]}
            </button>
          ))}
        </div>
        {fl.length===0?<Emp icon="⚙" label={t.noJobs}/>:fl.map(j=><JRow key={j.id} job={j} onClick={()=>nav("job-detail",j.id)}/>)}
      </div>
    );
  };

  const JobDetail=()=>{
    if(!selJ)return null;
    const cu=S.customers.find(c=>c.id===selJ.customer_id);
    const tot=jTotal(selJ); const taxA=tot*(S.profile.taxRate||0)/100;
    const ei=S.invoices.find(i=>i.job_id===selJ.id);
    const wa=cu?`https://wa.me/${cu.phone?.replace(/\D/g,"")}?text=${encodeURIComponent(`${S.lang==="ar"?"السلام عليكم":"Hello"} ${cu.name},\n${S.lang==="ar"?"تم الانتهاء من:":"Completed:"} ${selJ.title}\n${S.lang==="ar"?"الإجمالي:":"Total:"} ${fmtM(tot,sym)} 🙏`)}`:"#";
    return(
      <div style={{padding:"16px",maxWidth:780}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:7}}>
          <div><h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:"0 0 6px"}}>{selJ.title}</h2><Bdg st={selJ.status}/></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Btn label={t.edit} onClick={()=>setModal("edit-job")} out col={C.mu} sm/>
            <Btn label="📷" sm col="#0EA5E9" onClick={()=>fileRef.current?.click()}/>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>e.target.files[0]&&addPhoto(selJ.id,e.target.files[0])}/>
            <Btn label="🤖" sm col={C.ai} onClick={()=>{nav("ai");setTimeout(()=>sendAI((S.lang==="ar"?"حلل المهمة: ":"Analyze job: ")+selJ.title+" — "+fmtM(tot,sym)),100);}}/>
            <button onClick={()=>setCdel({type:"job",id:selJ.id})} style={{padding:"6px 9px",borderRadius:7,border:`1.5px solid ${C.er}`,background:"transparent",color:C.er,fontWeight:700,fontSize:12,cursor:"pointer"}}>🗑</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:11}}>
          <Card title={t.jobDetails}>
            <IR label={t.customers} value={cu?.name||"—"}/>
            <IR label={t.phone} value={cu?.phone||"—"}/>
            {cu?.address&&<IR label={t.address} value={cu.address}/>}
            <IR label={t.scheduledAt} value={selJ.scheduled_at?fmtD(selJ.scheduled_at)+" "+fmtT(selJ.scheduled_at):"—"}/>
            {selJ.notes&&<IR label={t.notes} value={selJ.notes}/>}
          </Card>
          <Card title={S.lang==="ar"?"الحساب":"Summary"}>
            <IR label={t.laborTotal} value={fmtM((selJ.labor_hours||0)*(selJ.labor_rate||0),sym)}/>
            <IR label={t.matsTotal} value={fmtM((selJ.materials||[]).reduce((s,m)=>s+m.qty*m.unit_price,0),sym)}/>
            {S.profile.taxRate>0&&<IR label={`${t.tax} ${S.profile.taxRate}%`} value={fmtM(taxA,sym)}/>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:9,background:C.sb,borderRadius:7,padding:"10px 12px"}}>
              <span style={{color:C.acc,fontWeight:700,fontSize:13}}>{t.grandTotal}</span>
              <span style={{color:C.acc,fontWeight:900,fontSize:17}}>{fmtM(tot+taxA,sym)}</span>
            </div>
          </Card>
        </div>
        {(selJ.materials||[]).length>0&&(
          <Card title={t.materials}>
            {selJ.materials.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <span style={{fontSize:12}}>{m.name} × {m.qty} {m.unit}</span>
                <span style={{fontWeight:700,fontSize:12}}>{fmtM(m.qty*m.unit_price,sym)}</span>
              </div>
            ))}
          </Card>
        )}
        {(selJ.photos||[]).length>0&&(
          <Card title={`📷 ${t.photos} (${selJ.photos.length})`}>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {(selJ.photos||[]).map(ph=>(
                <div key={ph.id} style={{position:"relative"}}>
                  <img src={ph.url} alt="" style={{width:76,height:76,objectFit:"cover",borderRadius:7,cursor:"pointer"}} onClick={()=>setPhotoMdl(ph.url)}/>
                  <button onClick={()=>setS(p=>({...p,jobs:p.jobs.map(j=>j.id===selJ.id?{...j,photos:(j.photos||[]).filter(x=>x.id!==ph.id)}:j)}))}
                    style={{position:"absolute",top:-5,insetInlineEnd:-5,background:C.er,color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              ))}
              <button onClick={()=>fileRef.current?.click()} style={{width:76,height:76,borderRadius:7,border:`2px dashed ${C.bdr}`,background:C.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:C.li}}>+</button>
            </div>
          </Card>
        )}
        {selJ.status!=="invoiced"&&(
          <Card title={t.changeStatus}>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["scheduled","in_progress","done"].map(s=>(
                <button key={s} onClick={()=>updJStat(selJ.id,s)} disabled={selJ.status===s}
                  style={{padding:"7px 13px",borderRadius:7,cursor:selJ.status===s?"default":"pointer",border:`1.5px solid ${SC[s].dot}`,background:selJ.status===s?SC[s].dot:"transparent",color:selJ.status===s?"#fff":SC[s].text,fontWeight:700,fontSize:12}}>
                  {t[s]}
                </button>
              ))}
            </div>
          </Card>
        )}
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {(selJ.status==="done"||selJ.status==="invoiced")&&<Btn label={ei?t.viewInvoice:t.createInvoice} onClick={()=>ei?nav("invoice-detail",ei.id):mkInv(selJ.id)} col={C.pu} icon="📋"/>}
          <a href={wa} target="_blank" rel="noreferrer" style={{padding:"10px 16px",borderRadius:9,background:"#25D366",color:"#fff",fontWeight:700,fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>💬 {t.sendWhatsApp}</a>
        </div>
      </div>
    );
  };

  const Customers=()=>(
    <div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:7}}>
        <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:0}}>{t.customers} ({S.customers.length})</h2>
        <Btn label={t.newCustomer} onClick={()=>setModal("add-customer")} icon="+"/>
      </div>
      {S.customers.length===0?<Emp icon="◉" label={t.noCustomers}/>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:9}}>
          {S.customers.map(c=>{
            const cj=S.jobs.filter(j=>j.customer_id===c.id);
            const cp=S.invoices.filter(i=>S.jobs.find(j=>j.id===i.job_id&&j.customer_id===c.id)&&i.status==="paid").reduce((s,i)=>s+i.total,0);
            const lj=cj.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];
            return(
              <div key={c.id} onClick={()=>nav("customer-detail",c.id)} style={{background:C.card,borderRadius:11,border:`1px solid ${C.bdr}`,padding:"13px 15px",cursor:"pointer",transition:"box-shadow 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:700,fontSize:13,color:C.tx,margin:"0 0 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</p>
                    <p style={{color:C.mu,fontSize:12,margin:"0 0 2px"}}>📞 {c.phone}</p>
                    {c.address&&<p style={{color:C.li,fontSize:11,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {c.address}</p>}
                  </div>
                  <div style={{background:C.bg,borderRadius:7,padding:"5px 9px",textAlign:"center",flexShrink:0,marginInlineStart:8}}>
                    <p style={{fontSize:16,fontWeight:900,color:C.tx,margin:0}}>{cj.length}</p>
                    <p style={{fontSize:9,color:C.li,margin:0}}>{t.jobs}</p>
                  </div>
                </div>
                <div style={{marginTop:7,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:10,color:C.li}}>{lj?t.lastActivity+": "+fmtD(lj.created_at):""}</span>
                  <span style={{fontSize:11,fontWeight:700,color:C.ok}}>{fmtM(cp,sym)}</span>
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );

  const CustDetail=()=>{
    if(!selC)return null;
    const cj=S.jobs.filter(j=>j.customer_id===selC.id);
    const cp=S.invoices.filter(i=>S.jobs.find(j=>j.id===i.job_id&&j.customer_id===selC.id)&&i.status==="paid").reduce((s,i)=>s+i.total,0);
    return(
      <div style={{padding:"16px",maxWidth:760}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:7}}>
          <div><h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:"0 0 5px"}}>{selC.name}</h2><span style={{background:`${C.pu}18`,color:C.pu,fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:16}}>{cj.length} {t.jobs}</span></div>
          <div style={{display:"flex",gap:6}}>
            <Btn label={t.edit} onClick={()=>setModal("edit-customer")} out col={C.mu} sm/>
            <Btn label="🤖" sm col={C.ai} onClick={()=>{nav("ai");setTimeout(()=>sendAI((S.lang==="ar"?"تقرير العميل: ":"Client report: ")+selC.name+" — "+fmtM(cp,sym)),100);}}/>
            <button onClick={()=>setCdel({type:"customer",id:selC.id})} style={{padding:"6px 9px",borderRadius:7,border:`1.5px solid ${C.er}`,background:"transparent",color:C.er,fontWeight:700,fontSize:12,cursor:"pointer"}}>🗑</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:11,marginBottom:11}}>
          <Card title={t.customerDetails}>
            <IR label={t.name} value={selC.name}/>
            <IR label={t.phone} value={selC.phone}/>
            {selC.address&&<IR label={t.address} value={selC.address}/>}
            {selC.notes&&<IR label={t.notes} value={selC.notes}/>}
          </Card>
          <Card title="Stats">
            <IR label={t.totalJobs} value={cj.length}/>
            <IR label={t.completedJobs} value={cj.filter(j=>j.status==="done"||j.status==="invoiced").length}/>
            <IR label={S.lang==="ar"?"إجمالي المدفوع":"Total Paid"} value={fmtM(cp,sym)} bold acc/>
          </Card>
        </div>
        <Card title={t.jobHistory}>
          {cj.length===0?<p style={{color:C.li,fontSize:12,textAlign:"center",padding:"12px 0"}}>{t.noJobs}</p>
            :cj.map(j=><JRow key={j.id} job={j} onClick={()=>nav("job-detail",j.id)}/>)}
        </Card>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <a href={`tel:${selC.phone}`} style={{padding:"9px 14px",borderRadius:8,background:"#EFF6FF",color:"#1D4ED8",fontWeight:700,fontSize:13,textDecoration:"none"}}>📞 {t.call}</a>
          <a href={`https://wa.me/${selC.phone?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{padding:"9px 14px",borderRadius:8,background:"#F0FDF4",color:"#166534",fontWeight:700,fontSize:13,textDecoration:"none"}}>💬 WhatsApp</a>
        </div>
      </div>
    );
  };

  const Invoices=()=>(
    <div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:7}}>
        <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:0}}>{t.invoices} ({S.invoices.length})</h2>
        <Btn label={t.exportExcel} col={C.ok} sm icon="📊" onClick={()=>{const rows=[[t.invoiceNumber,S.lang==="ar"?"العميل":"Client","Total","Status","Date"]];S.invoices.forEach(inv=>{const job=S.jobs.find(j=>j.id===inv.job_id);const cu=S.customers.find(c=>c.id===job?.customer_id);rows.push([inv.invoice_number,cu?.name||"",inv.total.toFixed(2),t[inv.status],fmtD(inv.created_at)]);});exportCSV(rows,"invoices.csv");}}/>
      </div>
      {pAmt>0&&(
        <div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:9,padding:"10px 13px",marginBottom:10,display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
          <span style={{fontSize:16}}>💰</span>
          <div style={{flex:1}}><p style={{fontWeight:700,color:"#92400E",margin:0,fontSize:12}}>{t.totalPending}: {fmtM(pAmt,sym)}</p></div>
          <Btn label="🤖 AI" sm col={C.ai} onClick={()=>{nav("ai");setTimeout(()=>sendAI(S.lang==="ar"?"اكتب رسائل واتساب للفواتير المعلقة":"Write WhatsApp reminders for pending invoices"),100);}}/>
        </div>
      )}
      {S.invoices.length===0?<Emp icon="◧" label={t.noInvoices}/>:S.invoices.map(inv=><IRow key={inv.id} inv={inv} onClick={()=>nav("invoice-detail",inv.id)}/>)}
    </div>
  );

  const InvDetail=()=>{
    if(!selI)return null;
    const job=S.jobs.find(j=>j.id===selI.job_id);
    const cu=S.customers.find(c=>c.id===job?.customer_id);
    const iSym=(CURRENCIES.find(c=>c.code===selI.currency)||cur).symbol;
    const wa=cu?`https://wa.me/${cu.phone?.replace(/\D/g,"")}?text=${encodeURIComponent(`${S.lang==="ar"?"السلام عليكم":"Hello"} ${cu.name},\n\n${t.invoiceNumber}: ${selI.invoice_number}\n${S.lang==="ar"?"الخدمة:":"Service:"} ${job?.title||""}\n${t.total}: ${fmtM(selI.total,iSym)}\n${t.dueDate}: ${fmtD(selI.due_date)}\n\n🙏 ${S.profile.fullName||""}`)}`:"#";
    return(
      <div style={{padding:"16px",maxWidth:740}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:7}}>
          <div><h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:"0 0 6px"}}>{selI.invoice_number}</h2><Bdg st={selI.status} tp="invoice"/></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Btn label={t.exportPDF} sm col="#EF4444" icon="📄" onClick={()=>generatePDF(selI,job,cu,S.profile,iSym)}/>
            <Btn label="🤖" sm col={C.ai} onClick={()=>{nav("ai");setTimeout(()=>sendAI((S.lang==="ar"?"ساعدني في متابعة: ":"Help follow up: ")+selI.invoice_number+" — "+fmtM(selI.total,iSym)),100);}}/>
          </div>
        </div>
        <div style={{background:C.card,borderRadius:13,border:`1px solid ${C.bdr}`,padding:"20px",marginBottom:11,boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,paddingBottom:14,borderBottom:`2px solid ${C.sb}`}}>
            <div>
              <p style={{fontWeight:900,fontSize:16,color:C.sb,margin:"0 0 2px"}}>{S.profile.businessName||"TradePro"}</p>
              {S.profile.trade&&TRADES[S.profile.trade]&&<p style={{color:C.mu,fontSize:11,margin:"0 0 2px"}}>{TRADES[S.profile.trade].icon} {TRADES[S.profile.trade][S.lang]}</p>}
              {S.profile.phone&&<p style={{color:C.mu,fontSize:11,margin:0}}>📞 {S.profile.phone}</p>}
            </div>
            <div style={{textAlign:dir==="rtl"?"left":"right"}}>
              <p style={{fontWeight:800,fontSize:14,color:C.sb,margin:"0 0 2px"}}>{selI.invoice_number}</p>
              <p style={{color:C.mu,fontSize:11}}>{fmtD(selI.created_at)}</p>
            </div>
          </div>
          {cu&&<div style={{marginBottom:14}}>
            <p style={{color:C.li,fontSize:10,fontWeight:700,margin:"0 0 4px",letterSpacing:1}}>{t.customers.toUpperCase()}</p>
            <p style={{fontWeight:700,color:C.tx,margin:"0 0 2px",fontSize:13}}>{cu.name}</p>
            <p style={{color:C.mu,fontSize:12,margin:"0 0 2px"}}>📞 {cu.phone}</p>
            {cu.address&&<p style={{color:C.mu,fontSize:11,margin:0}}>📍 {cu.address}</p>}
          </div>}
          {job&&<div style={{background:C.bg,borderRadius:7,padding:"9px 11px",marginBottom:14}}>
            <p style={{color:C.li,fontSize:10,fontWeight:700,margin:"0 0 2px",letterSpacing:1}}>{S.lang==="ar"?"الخدمة":"SERVICE"}</p>
            <p style={{fontWeight:600,color:C.tx,margin:0,fontSize:12}}>{job.title}</p>
          </div>}
          <div style={{borderTop:`1px solid ${C.bdr}`,paddingTop:10}}>
            <IR label={t.subtotal} value={fmtM(selI.subtotal,iSym)}/>
            {selI.tax_rate>0&&<IR label={`${t.tax} (${selI.tax_rate}%)`} value={fmtM(selI.total-selI.subtotal,iSym)}/>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:9,background:C.sb,borderRadius:8,padding:"11px 13px"}}>
              <span style={{color:C.acc,fontWeight:700,fontSize:13}}>{t.total}</span>
              <span style={{color:C.acc,fontWeight:900,fontSize:19}}>{fmtM(selI.total,iSym)}</span>
            </div>
          </div>
          {selI.due_date&&<p style={{color:C.li,fontSize:11,textAlign:"center",marginTop:7}}>{t.dueDate}: {fmtD(selI.due_date)}</p>}
          {selI.paid_at&&<p style={{color:C.ok,fontSize:11,textAlign:"center",marginTop:3,fontWeight:700}}>✅ {t.paidOn} {fmtD(selI.paid_at)}</p>}
        </div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {selI.status!=="paid"&&<Btn label={t.markPaid} onClick={()=>updInv(selI.id,"paid")} col={C.ok}/>}
          <a href={wa} target="_blank" rel="noreferrer" onClick={()=>selI.status==="draft"&&updInv(selI.id,"sent")}
            style={{padding:"10px 16px",borderRadius:9,background:"#25D366",color:"#fff",fontWeight:700,fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
            💬 {selI.status==="sent"?t.resendReminder:t.sendWhatsApp}
          </a>
        </div>
      </div>
    );
  };

  const Expenses=()=>{
    const [ef,sef]=useState({name:"",amount:"",date:new Date().toISOString().split("T")[0],category:S.lang==="ar"?"مواد":"Materials"});
    const cats=S.lang==="ar"?["مواد","أدوات","وقود","إيجار","رسوم","أخرى"]:["Materials","Tools","Fuel","Rent","Fees","Other"];
    return(
      <div style={{padding:"16px",maxWidth:680}}>
        <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:"0 0 14px"}}>{t.expenses}</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:9,marginBottom:14}}>
          <Stat label={t.totalExpenses} value={fmtM(totalExp,sym)} col={C.er} icon="💸"/>
          <Stat label={t.totalPaid} value={fmtM(cAmt,sym)} col={C.ok} icon="✅"/>
          <Stat label={t.profit} value={fmtM(cAmt-totalExp,sym)} col={C.pu} icon="📈"/>
        </div>
        <Card title={t.addExpense}>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            <Fld label={t.expenseName+" *"} half><input value={ef.name} onChange={e=>sef(p=>({...p,name:e.target.value}))} style={iS} placeholder={S.lang==="ar"?"مثال: شراء كيبل":"e.g. Cable purchase"}/></Fld>
            <Fld label={`${t.expenseAmt} (${sym}) *`} half><input value={ef.amount} onChange={e=>sef(p=>({...p,amount:e.target.value}))} type="number" style={iS} placeholder="0"/></Fld>
            <Fld label={t.expenseDate} half><input value={ef.date} onChange={e=>sef(p=>({...p,date:e.target.value}))} type="date" style={iS}/></Fld>
            <Fld label={t.expenseCategory} half>
              <select value={ef.category} onChange={e=>sef(p=>({...p,category:e.target.value}))} style={iS}>
                {cats.map(c=><option key={c}>{c}</option>)}
              </select>
            </Fld>
          </div>
          <Btn label={`+ ${t.addExpense}`} onClick={()=>{if(!ef.name||!ef.amount)return;addExp({...ef,amount:Number(ef.amount)});sef({name:"",amount:"",date:new Date().toISOString().split("T")[0],category:cats[0]});}}/>
        </Card>
        <Card title={S.lang==="ar"?"سجل المصروفات":"Expense History"}>
          {(S.expenses||[]).length===0?<Emp icon="💸" label={t.addExpense}/>
            :[...(S.expenses||[])].reverse().map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <div>
                  <p style={{fontWeight:600,fontSize:12,color:C.tx,margin:"0 0 1px"}}>{e.name}</p>
                  <p style={{fontSize:11,color:C.mu,margin:0}}>{e.category} · {fmtD(e.date)}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontWeight:700,fontSize:13,color:C.er}}>{fmtM(e.amount,sym)}</span>
                  <button onClick={()=>setS(p=>({...p,expenses:(p.expenses||[]).filter(x=>x.id!==e.id)}))} style={{background:"none",border:"none",cursor:"pointer",color:C.li,fontSize:15}}>×</button>
                </div>
              </div>
            ))}
        </Card>
      </div>
    );
  };

  const Reports=()=>{
    const mo={};
    S.invoices.filter(i=>i.status==="paid").forEach(inv=>{
      const m=(inv.paid_at||inv.created_at||"").slice(0,7);
      if(m) mo[m]=(mo[m]||0)+inv.total;
    });
    const mos=Object.entries(mo).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6);
    const mx=Math.max(...mos.map(m=>m[1]),1);
    const topC=S.customers.map(c=>{
      const cp=S.invoices.filter(i=>S.jobs.find(j=>j.id===i.job_id&&j.customer_id===c.id)&&i.status==="paid").reduce((s,i)=>s+i.total,0);
      return{...c,paid:cp,jobs:S.jobs.filter(j=>j.customer_id===c.id).length};
    }).sort((a,b)=>b.paid-a.paid).slice(0,5);
    const avgInv=S.invoices.length?cAmt/S.invoices.length:0;
    return(
      <div style={{padding:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:7}}>
          <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:0}}>{t.reports}</h2>
          <div style={{display:"flex",gap:6}}>
            <Btn label={t.exportExcel} sm col={C.ok} icon="📊" onClick={()=>{const rows=[[t.invoiceNumber,"Client","Total","Status","Date"]];S.invoices.forEach(i=>{const j=S.jobs.find(x=>x.id===i.job_id);const c=S.customers.find(x=>x.id===j?.customer_id);rows.push([i.invoice_number,c?.name||"",i.total.toFixed(2),t[i.status],fmtD(i.created_at)]);});exportCSV(rows,"report.csv");}}/>
            <Btn label="🤖 AI" sm col={C.ai} onClick={()=>{nav("ai");setTimeout(()=>sendAI(S.lang==="ar"?"أعطني تحليلاً مالياً كاملاً":"Give me a complete financial analysis"),100);}}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:9,marginBottom:14}}>
          <Stat label={t.revenue} value={fmtM(cAmt,sym)} col={C.ok} icon="📈"/>
          <Stat label={t.totalPending} value={fmtM(pAmt,sym)} col={C.wa} icon="⏳"/>
          <Stat label={t.profit} value={fmtM(cAmt-totalExp,sym)} col={C.pu} icon="💰"/>
          <Stat label={t.avgJobValue} value={fmtM(avgInv,sym)} col={C.acc} icon="📊"/>
        </div>
        {mos.length>0&&(
          <Card title={t.monthlyRevenue}>
            <div style={{display:"flex",gap:7,alignItems:"flex-end",height:110,paddingBottom:6}}>
              {mos.map(([m,v])=>(
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:9,color:C.mu,fontWeight:600,textAlign:"center"}}>{fmtM(v,sym)}</span>
                  <div style={{width:"100%",background:`linear-gradient(to top,${C.acc},${C.accD})`,borderRadius:"3px 3px 0 0",height:`${(v/mx)*100}px`,minHeight:4,transition:"height 0.4s"}}/>
                  <span style={{fontSize:8,color:C.li}}>{m.slice(5)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:11}}>
          <Card title={t.jobsByStatus}>
            {["scheduled","in_progress","done","invoiced"].map(s=>{
              const ct=S.jobs.filter(j=>j.status===s).length;
              const pct=S.jobs.length?Math.round(ct/S.jobs.length*100):0;
              return(
                <div key={s} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,color:C.tx,fontWeight:600}}>{t[s]}</span>
                    <span style={{fontSize:11,color:C.mu}}>{ct} ({pct}%)</span>
                  </div>
                  <div style={{background:C.bg,borderRadius:18,height:6,overflow:"hidden"}}>
                    <div style={{height:"100%",background:SC[s].dot,width:`${pct}%`,borderRadius:18,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </Card>
          <Card title={t.topCustomers}>
            {topC.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:`${C.acc}20`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:C.acc,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:600,fontSize:12,color:C.tx,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</p>
                  <p style={{fontSize:10,color:C.mu,margin:0}}>{c.jobs} {t.jobs}</p>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:C.ok,flexShrink:0}}>{fmtM(c.paid,sym)}</span>
              </div>
            ))}
            {topC.length===0&&<p style={{color:C.li,fontSize:12,textAlign:"center",padding:"12px 0"}}>{t.noCustomers}</p>}
          </Card>
        </div>
      </div>
    );
  };

  const Settings=()=>{
    const [f,sf]=useState({...S.profile});
    return(
      <div style={{padding:"16px",maxWidth:560}}>
        <h2 style={{fontSize:16,fontWeight:800,color:C.tx,margin:"0 0 16px"}}>{t.settings}</h2>
        <Card title={t.profile}>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            <Fld label={t.fullName} half><input value={f.fullName} onChange={e=>sf(p=>({...p,fullName:e.target.value}))} style={iS}/></Fld>
            <Fld label={t.businessName} half><input value={f.businessName} onChange={e=>sf(p=>({...p,businessName:e.target.value}))} style={iS}/></Fld>
            <Fld label={t.phone} half><input value={f.phone} onChange={e=>sf(p=>({...p,phone:e.target.value}))} style={iS} type="tel"/></Fld>
            <Fld label={t.invoicePrefix} half><input value={f.invoicePrefix} onChange={e=>sf(p=>({...p,invoicePrefix:e.target.value}))} style={iS}/></Fld>
          </div>
          <Fld label={t.trade}>
            <select value={f.trade} onChange={e=>sf(p=>({...p,trade:e.target.value}))} style={iS}>
              {Object.entries(TRADES).map(([k,v])=><option key={k} value={k}>{v.icon} {v[S.lang]}</option>)}
            </select>
          </Fld>
          <Btn label={t.save} onClick={()=>{setS(p=>({...p,profile:f}));showToast("✅ "+t.save);}}/>
        </Card>
        <Card title={t.taxRate}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
            <input type="range" min="0" max="30" step="0.5" value={f.taxRate||0} onChange={e=>sf(p=>({...p,taxRate:Number(e.target.value)}))} style={{flex:1,accentColor:C.acc}}/>
            <span style={{fontSize:19,fontWeight:900,color:C.acc,minWidth:48}}>{f.taxRate||0}%</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:9}}>
            {[0,5,10,15,20,25].map(v=>(
              <button key={v} onClick={()=>sf(p=>({...p,taxRate:v}))} style={{padding:"4px 11px",borderRadius:16,border:`1.5px solid ${(f.taxRate||0)===v?C.acc:C.bdr}`,background:(f.taxRate||0)===v?`${C.acc}15`:"#fff",color:(f.taxRate||0)===v?C.accD:C.mu,fontWeight:700,cursor:"pointer",fontSize:12}}>{v}%</button>
            ))}
          </div>
          <Btn label={t.save} sm onClick={()=>{setS(p=>({...p,profile:f}));showToast("✅");}}/>
        </Card>
        <Card title={t.currency}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(105px,1fr))",gap:6,marginBottom:9}}>
            {CURRENCIES.map(c=>(
              <button key={c.code} onClick={()=>sf(p=>({...p,currency:c.code}))} style={{padding:"7px 8px",borderRadius:8,cursor:"pointer",textAlign:"start",border:`1.5px solid ${f.currency===c.code?C.acc:C.bdr}`,background:f.currency===c.code?`${C.acc}10`:"#fff"}}>
                <div style={{fontSize:15,marginBottom:2}}>{c.flag}</div>
                <div style={{fontWeight:700,fontSize:11,color:f.currency===c.code?C.accD:C.tx}}>{c.code} {c.symbol}</div>
                <div style={{fontSize:10,color:C.mu,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
              </button>
            ))}
          </div>
          <Btn label={t.save} sm onClick={()=>{setS(p=>({...p,profile:f}));showToast("✅");}}/>
        </Card>
        <Card title={t.language}>
          <div style={{display:"flex",gap:8}}>
            {["ar","en"].map(l=>(
              <button key={l} onClick={()=>setS(p=>({...p,lang:l}))} style={{padding:"8px 18px",borderRadius:7,border:`1.5px solid ${S.lang===l?C.acc:C.bdr}`,background:S.lang===l?`${C.acc}15`:"#fff",color:S.lang===l?C.accD:C.mu,fontWeight:S.lang===l?700:400,cursor:"pointer",fontSize:13}}>
                {l==="ar"?"🇸🇦 العربية":"🇬🇧 English"}
              </button>
            ))}
          </div>
        </Card>
        <Card title={S.lang==="ar"?"الإشعارات":"Notifications"}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={async()=>{if(!("Notification" in window)){showToast("❌ Not supported");return;}const p=await Notification.requestPermission();setNotifOn(p==="granted");showToast(p==="granted"?"🔔 "+t.notificationsEnabled:"❌");}}
              style={{padding:"8px 14px",borderRadius:7,border:"none",background:notifOn?C.ok:C.acc,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>
              🔔 {notifOn?t.notificationsEnabled:t.enableNotifications}
            </button>
            <span style={{fontSize:11,color:C.mu}}>{S.lang==="ar"?"تنبيه للفواتير المتأخرة":"Overdue invoice alerts"}</span>
          </div>
        </Card>
        <Card title={S.lang==="ar"?"البيانات":"Data"}>
          <div style={{background:"#F0FDF4",borderRadius:8,padding:"9px 12px",marginBottom:9,border:"1px solid #BBF7D0"}}>
            <p style={{fontWeight:700,color:"#166534",margin:"0 0 2px",fontSize:12}}>✅ {t.dataSaved}</p>
            <p style={{color:"#16A34A",fontSize:11,margin:0}}>{t.offlineBanner}</p>
          </div>
          <button onClick={()=>{if(window.confirm(S.lang==="ar"?"هل أنت متأكد؟ سيتم حذف جميع البيانات!":"Are you sure? All data will be deleted!")){localStorage.removeItem(SK);setS_(INIT);showToast("🗑");}}}
            style={{padding:"6px 13px",borderRadius:7,border:`1.5px solid ${C.er}`,background:"transparent",color:C.er,fontWeight:600,cursor:"pointer",fontSize:12}}>
            {t.clearData}
          </button>
        </Card>
      </div>
    );
  };

  // Render
  const render=()=>{
    switch(screen){
      case"dashboard":  return<Dashboard/>;
      case"jobs":       return<Jobs/>;
      case"job-detail": return<JobDetail/>;
      case"customers":  return<Customers/>;
      case"customer-detail": return<CustDetail/>;
      case"invoices":   return<Invoices/>;
      case"invoice-detail": return<InvDetail/>;
      case"expenses":   return<Expenses/>;
      case"reports":    return<Reports/>;
      case"ai":         return<AIScr/>;
      case"settings":   return<Settings/>;
      default:          return<Dashboard/>;
    }
  };

  const stitle =
    screen==="job-detail"      ? selJ?.title          || t.jobDetails      :
    screen==="invoice-detail"  ? selI?.invoice_number || t.invoiceDetails  :
    screen==="customer-detail" ? selC?.name           || t.customerDetails :
    (TXT[S.lang][screen] || t.dashboard);

  const mobNav=[
    {key:"dashboard", icon:"⊞", label:t.dashboard},
    {key:"jobs",      icon:"⚙", label:t.jobs},
    {key:"ai",        icon:"🤖", label:t.ai, center:true},
    {key:"invoices",  icon:"◧", label:t.invoices},
    {key:"settings",  icon:"⚙︎",label:t.settings},
  ];

  return(
    <div style={{display:"flex",width:"100vw",height:"100vh",background:C.bg,fontFamily:"'Cairo','Segoe UI',Tahoma,sans-serif",direction:dir,overflow:"hidden"}}>

      {/* ── Desktop Sidebar ── */}
      <div className="tp-desk"><SB/></div>

      {/* ── Mobile Drawer ── */}
      {drawer&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:dir==="rtl"?"row-reverse":"row"}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}} onClick={()=>setDrawer(false)}/>
          <div style={{position:"relative",width:245,height:"100%",zIndex:301,flexShrink:0}}><SB/></div>
        </div>
      )}

      {/* ── Main Area ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

        {/* Offline banner */}
        {!online&&(
          <div style={{background:"#1E293B",color:C.wa,padding:"5px 14px",fontSize:11,fontWeight:600,textAlign:"center",flexShrink:0}}>
            📵 {t.offlineBanner}
          </div>
        )}

        <TB title={stitle}/>

        {/* Screen content */}
        <div style={{flex:1,overflow:screen==="ai"?"hidden":"auto"}}>
          {render()}
        </div>

        {/* ── Mobile Bottom Nav ── */}
        <div className="tp-mob" style={{background:C.card,borderTop:`1px solid ${C.bdr}`,display:"none",boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",flexShrink:0}}>
          {mobNav.map(item=>item.center?(
            <button key={item.key} onClick={()=>nav(item.key)}
              style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"5px 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:42,height:42,borderRadius:12,marginTop:-16,background:`linear-gradient(135deg,${C.ai},${C.aiD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:`0 4px 12px ${C.ai}55`}}>
                🤖
              </div>
              <span style={{fontSize:9,color:screen===item.key?C.ai:C.li,marginTop:2,fontWeight:screen===item.key?700:400}}>{item.label}</span>
            </button>
          ):(
            <button key={item.key} onClick={()=>nav(item.key)}
              style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"6px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <span style={{fontSize:15,color:screen===item.key?C.acc:C.li}}>{item.icon}</span>
              <span style={{fontSize:9,color:screen===item.key?C.acc:C.li,fontWeight:screen===item.key?700:400}}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal==="add-customer"&&(
        <Mdl title={t.newCustomer} onClose={()=>setModal(null)}>
          <CustForm onSave={addCust} onClose={()=>setModal(null)}/>
        </Mdl>
      )}
      {modal==="edit-customer"&&selC&&(
        <Mdl title={`${t.edit} — ${selC.name}`} onClose={()=>setModal(null)}>
          <CustForm init={selC} onSave={d=>updCust(selC.id,d)} onClose={()=>setModal(null)}/>
        </Mdl>
      )}
      {modal==="add-job"&&(
        <Mdl title={t.newJob} onClose={()=>setModal(null)} wide>
          {S.customers.length===0
            ?<div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:40,marginBottom:10}}>👥</div>
                <p style={{color:C.mu,marginBottom:14,fontSize:14}}>{S.lang==="ar"?"أضف عميلاً أولاً قبل إنشاء مهمة":"Add a customer first before creating a job"}</p>
                <Btn label={t.newCustomer} onClick={()=>setModal("add-customer")}/>
              </div>
            :<JobForm onSave={addJob} onClose={()=>setModal(null)}/>}
        </Mdl>
      )}
      {modal==="edit-job"&&selJ&&(
        <Mdl title={`${t.edit} — ${selJ.title}`} onClose={()=>setModal(null)} wide>
          <JobForm init={selJ} onSave={d=>updJob(selJ.id,d)} onClose={()=>setModal(null)}/>
        </Mdl>
      )}

      {/* ── Confirm Delete ── */}
      {cdel&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:C.card,borderRadius:14,padding:22,maxWidth:290,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:38,marginBottom:9}}>🗑</div>
            <p style={{fontWeight:700,fontSize:14,color:C.tx,margin:"0 0 16px"}}>{t.confirmDelete}</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setCdel(null)}
                style={{flex:1,padding:"9px 0",borderRadius:7,border:`1.5px solid ${C.bdr}`,background:"#fff",fontWeight:600,cursor:"pointer",color:C.mu,fontSize:13}}>
                {t.cancel}
              </button>
              <button onClick={()=>{ cdel.type==="job"?delJob(cdel.id):delCust(cdel.id); setCdel(null); }}
                style={{flex:1,padding:"9px 0",borderRadius:7,border:"none",background:C.er,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Photo Lightbox ── */}
      {photoMdl&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>setPhotoMdl(null)}>
          <img src={photoMdl} alt="" style={{maxWidth:"92vw",maxHeight:"92vh",borderRadius:10,objectFit:"contain"}}/>
          <button onClick={()=>setPhotoMdl(null)}
            style={{position:"absolute",top:18,insetInlineEnd:18,background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            ×
          </button>
        </div>
      )}

      {/* ── Toast ── */}
      {toast&&(
        <div style={{position:"fixed",bottom:72,left:"50%",transform:"translateX(-50%)",background:C.sb,color:"#fff",padding:"8px 18px",borderRadius:26,fontWeight:600,fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,0.2)",zIndex:3000,whiteSpace:"nowrap",pointerEvents:"none"}}>
          {toast}
        </div>
      )}

      {/* ── Global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{width:100%;height:100%;overflow:hidden;}
        input:focus,textarea:focus,select:focus{
          border-color:#F97316!important;
          box-shadow:0 0 0 3px rgba(249,115,22,0.1)!important;
        }
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:4px;}
        @keyframes tp_b{
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-5px)}
        }
        .tp-desk{display:flex;height:100%;}
        .tp-ham{display:none!important;}
        @media(max-width:768px){
          .tp-desk{display:none!important;}
          .tp-mob{display:flex!important;}
          .tp-ham{display:flex!important;}
        }
      `}</style>
    </div>
  );
}
