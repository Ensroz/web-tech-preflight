import { events } from "./data.js";

const container = document.querySelector("#detay");

if (container) {
  const id = new URLSearchParams(window.location.search).get("id");
  const event = events.find((e) => e.id === id);

  if (!event) {
    // Geçersiz veya eksik ID (Adım 8 - Slayt 20)
    container.innerHTML = `
      <div class="hata-kutusu" style="border:1px solid #d9534f; padding:20px; background-color:#fdf2f2; border-radius:8px; color:#a94442;">
        <h2>Etkinlik bulunamadı</h2>
        <p>"${id || "Eksik"}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.</p>
        <a href="etkinlikler.html" class="buton" style="display:inline-block; margin-top:10px;">Listeye dön</a>
      </div>
    `;
  } else {
    // Doğru ID (Adım 8 & 11)
    document.title = event.title;

    const parts = event.date.split("-");
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    container.innerHTML = `
      <div class="detay-duzen" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="detay-sol" style="flex: 1; min-width: 280px;">
          <div class="afis-placeholder" style="background:#1a2b4c; color:#fff; padding:40px 20px; text-align:center; border-radius:8px;">
            <h1 style="color:#fff; margin-bottom:10px;">${event.title}</h1>
            <p>${formattedDate} • ${event.location}</p>
          </div>
          <p class="afis-alt" style="font-size:0.9em; color:#666; margin-top:5px;">${event.title} afişi</p>
          
          <h2 style="margin-top:20px;">Açıklama</h2>
          <p>${event.description}</p>

          <div style="margin-top: 20px; display:flex; gap:10px;">
            <a href="etkinlikler.html" class="buton-sekil">← Listeye dön</a>
            <a href="etkinlik-guncelle.html?id=${event.id}" class="buton-sekil YESIL">Bu etkinliği güncelle</a>
          </div>
        </div>

        <aside class="detay-sag" style="width: 300px; background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h3>Etkinlik Künyesi</h3>
          <dl>
            <dt><strong>Tarih:</strong></dt>
            <dd>${formattedDate}, ${event.time}</dd>
            <dt><strong>Yer:</strong></dt>
            <dd>${event.location}</dd>
            <dt><strong>Kategori:</strong></dt>
            <dd>${event.category}</dd>
            <dt><strong>Kontenjan:</strong></dt>
            <dd>${event.capacity} kişi</dd>
          </dl>
        </aside>
      </div>
    `;
  }
}