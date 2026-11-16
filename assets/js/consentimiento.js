// CLAUSE · AdSense (Academy L5 §07): botón «Gestionar consentimiento» del aviso de privacidad.
// Reabre el mensaje de Google Privacy & messaging (CMP certificado) servido por adsbygoogle.js.
// Sin script en línea (CSP). Si el CMP no está cargado (México, bloqueador o AdSense aún inactivo), lleva a adssettings.
(function () {
  var b = document.getElementById('gestionar-consentimiento');
  if (!b) return;
  b.addEventListener('click', function () {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    if (typeof window.googlefc.showRevocationMessage === 'function') {
      window.googlefc.callbackQueue.push(window.googlefc.showRevocationMessage);
    } else {
      window.location.href = 'https://adssettings.google.com';
    }
  });
})();
