import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");

if (form) {
  const isGuncelleMode = form.dataset.mode === "guncelle";
  const id = new URLSearchParams(window.location.search).get("id");
  const mevcutEtkinlik = isGuncelleMode ? events.find((e) => e.id === id) : null;

  // Güncelleme Sayfası ID Kontrolü (Adım 11 - Slayt 18 & 22)
  if (isGuncelleMode) {
    if (!mevcutEtkinlik) {
      form.outerHTML = `
        <div class="hata-kutusu" style="border: 1px solid #d9534f; background:#fdf2f2; color:#a94442; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.</p>
        </div>
        <a href="etkinlikler.html" class="buton" style="display:inline-block; padding:10px 20px; background:#1b7e42; color:#fff; text-decoration:none; border-radius:5px;">Etkinliklere git</a>
      `;
    } else {
      // Alanları mevcut etkinliğin verileriyle doldur
      form.elements.ad.value = mevcutEtkinlik.title;
      form.elements.kategori.value = mevcutEtkinlik.category;
      
      // GG-AA-YYYY formatını input type="date" (YYYY-MM-DD) için çevir
      const parts = mevcutEtkinlik.date.split("-");
      if (parts.length === 3) {
        form.elements.tarih.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      
      form.elements.saat.value = mevcutEtkinlik.time;
      form.elements.yer.value = mevcutEtkinlik.location;
      form.elements.kontenjan.value = mevcutEtkinlik.capacity || "";
      if (form.elements.aciklama) {
        form.elements.aciklama.value = mevcutEtkinlik.description || "";
      }
    }
  }

  // Form Submit İşlemi
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hata mesajı yerlerini temizle
    document.querySelectorAll("[id$='-hata']").forEach((el) => (el.textContent = ""));
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const mesajKutusu = document.querySelector("#form-mesaj");
    if (mesajKutusu) mesajKutusu.innerHTML = "";

    const fd = new FormData(form);

    // Form name'leri Türkçe -> Nesne alanları İngilizce (Adım 9)
    const data = {
      id: isGuncelleMode && mevcutEtkinlik ? mevcutEtkinlik.id : `event-${events.length + 1}`,
      title: (fd.get("ad") || "").toString().trim(),
      category: (fd.get("kategori") || "").toString(),
      date: (fd.get("tarih") || "").toString(),
      time: (fd.get("saat") || "").toString(),
      location: (fd.get("yer") || "").toString().trim(),
      capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
      description: fd.get("aciklama") ? fd.get("aciklama").toString().trim() : ""
    };

    // Hata Kontrolleri (Adım 10)
    const errors = {};

    if (data.title.length < 3) {
      errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
    }
    if (!data.category) {
      errors.kategori = "Bir kategori seçin.";
    }
    if (!data.date) {
      errors.tarih = "Tarih seçin.";
    }
    if (!data.time) {
      errors.saat = "Saat seçin.";
    }
    if (!data.location) {
      errors.yer = "Yer bilgisini yazın.";
    }
    if (data.capacity !== null && (isNaN(data.capacity) || data.capacity < 1 || data.capacity > 1000)) {
      errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalıdır.";
    }

    // Hataları Ekrana Basma
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((field) => {
        const errorSpan = document.querySelector(`#${field}-hata`);
        const inputElem = form.elements[field];

        if (errorSpan) errorSpan.textContent = errors[field];
        if (inputElem) inputElem.setAttribute("aria-invalid", "true");
      });
      return;
    }

    // Başarılı Gönderim (Adım 10)
    if (mesajKutusu) {
      const baslikMetni = isGuncelleMode
        ? "Etkinlik güncellendi (bu sprintte kaydedilmez):"
        : "Etkinlik oluşturuldu (bu sprintte kaydedilmez):";

      mesajKutusu.innerHTML = `
        <div style="background-color: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">${baslikMetni}</p>
          <pre style="margin: 0; font-family: monospace; font-size: 0.9em;">${JSON.stringify(data, null, 2)}</pre>
        </div>
      `;
    }
  });
}