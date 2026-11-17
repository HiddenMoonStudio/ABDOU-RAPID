// عدّل بيانات الخدمة من هذا القسم فقط عند الحاجة.
const BUSINESS = {
  serviceName: "ABDOU RAPID",
  owner: "ABDELRAHMENE",
  phoneDisplay: "0696367059",
  phoneInternational: "+213696367059",
  whatsapp: "213696367059",
  coverage: "الحطاطبة وما جاورها",
  hours: "10:00 صباحاً – 00:00 ليلاً",
  message: "السلام عليكم، أريد الاستفسار عن خدمة التوصيل وطلب توصيل."
};

const $ = (id) => document.getElementById(id);
const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(BUSINESS.message)}`;
const phoneUrl = `tel:${BUSINESS.phoneInternational}`;

function applyBusinessInfo() {
  document.title = `${BUSINESS.serviceName} | توصيل سريع`;
  $("owner").textContent = BUSINESS.owner;
  $("coverage").textContent = BUSINESS.coverage;
  $("hours").textContent = BUSINESS.hours;
  $("callButton").href = phoneUrl;
  $("topCall").href = phoneUrl;
  $("callButton").querySelector("strong").textContent = BUSINESS.phoneDisplay;
  $("whatsappButton").href = whatsappUrl;
  $("orderTop").href = whatsappUrl;
  $("year").textContent = new Date().getFullYear();
}

let qrSvg = null;
let qrReady = false;

async function createQr() {
  const target = window.location.href.split("#")[0];
  $("pageUrl").textContent = target;

  if (!window.QRCode || typeof QRCode.toCanvas !== "function") {
    $("qrcode").innerHTML = '<div class="qr-loading">تعذر تحميل مولّد QR. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.</div>';
    $("qrHint").textContent = "يلزم اتصال بالإنترنت لتحميل مكتبة إنشاء الرمز.";
    $("downloadPng").disabled = true;
    $("downloadSvg").disabled = true;
    return;
  }

  const canvas = document.createElement("canvas");
  try {
    await QRCode.toCanvas(canvas, target, {
      errorCorrectionLevel: "H",
      margin: 3,
      width: 420,
      color: { dark: "#101010", light: "#FFFFFF" }
    });
    $("qrcode").replaceChildren(canvas);
    qrSvg = await QRCode.toString(target, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 3,
      width: 420,
      color: { dark: "#101010", light: "#FFFFFF" }
    });
    qrReady = true;
    $("qrHint").textContent = "هذا الرمز يفتح رابط هذه الصفحة. بعد النشر، حمّل النسخة النهائية وجرّب مسحها.";
  } catch (error) {
    console.error("QR generation failed:", error);
    $("qrcode").innerHTML = '<div class="qr-loading">حدث خطأ أثناء إنشاء الرمز.</div>';
    $("qrHint").textContent = "أعد تحميل الصفحة وحاول مرة أخرى.";
  }
}

function downloadPng() {
  const canvas = $("qrcode").querySelector("canvas");
  if (!qrReady || !canvas) return;
  const link = document.createElement("a");
  link.download = "ABDOU-RAPID-QR.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadSvg() {
  if (!qrReady || !qrSvg) return;
  const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ABDOU-RAPID-QR.svg";
  link.click();
  URL.revokeObjectURL(url);
}

async function sharePage() {
  const shareData = {
    title: BUSINESS.serviceName,
    text: "خدمة توصيل سريع بالدراجة النارية في الحطاطبة وما جاورها.",
    url: window.location.href.split("#")[0]
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (err) { /* المستخدم أغلق نافذة المشاركة */ }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareData.url);
    alert("تم نسخ رابط الصفحة.");
  } else {
    prompt("انسخ رابط الصفحة:", shareData.url);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyBusinessInfo();
  createQr();
  $("downloadPng").addEventListener("click", downloadPng);
  $("downloadSvg").addEventListener("click", downloadSvg);

  // زر مشاركة اختياري؛ يمكن إضافته لاحقاً إلى الواجهة إذا رغبت.
  window.shareAbdouRapid = sharePage;
});
