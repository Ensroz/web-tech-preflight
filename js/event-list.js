import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");
const filtreFormu = document.querySelector("#filtre-formu");
const aramaInput = document.querySelector("#arama");
const kategoriSelect = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");

// Kart Şablonu (Adım 4) - Güncelleme butonu yok, sadece Detayları gör
function createCard(event) {
  // GG-AA-YYYY formatını okunabilir tarihe dönüştürme (örn: 12 Ekim 2026)
  const parts = event.date.split("-");
  const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `
    <article class="kart">
      <h2>${event.title}</h2>
      <p class="kategori">${event.category}</p>
      <p><strong>Tarih:</strong> ${formattedDate}, ${event.time}</p>
      <p><strong>Yer:</strong> ${event.location}</p>
      <p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>
      <p>${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}">Detayları gör</a>
    </article>
  `;
}

// Ekrana Kartları Basma
function render(dizi) {
  if (!listContainer) return;
  listContainer.innerHTML = dizi.map(createCard).join("");
}

// Kategorileri Dinamik Doldurma (Adım 7)
function populateCategories() {
  if (!kategoriSelect) return;
  const categories = [...new Set(events.map((e) => e.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    kategoriSelect.appendChild(option);
  });
}

// Filtreleme Fonksiyonu (Adım 7)
function filtrele() {
  const aranan = aramaInput ? aramaInput.value.trim().toLocaleLowerCase("tr-TR") : "";
  const secilenKategori = kategoriSelect ? kategoriSelect.value : "";

  const sonuc = events.filter((e) => {
    const metinUyuyor =
      e.title.toLocaleLowerCase("tr-TR").includes(aranan) ||
      e.description.toLocaleLowerCase("tr-TR").includes(aranan) ||
      e.location.toLocaleLowerCase("tr-TR").includes(aranan);

    const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;

    return metinUyuyor && kategoriUyuyor;
  });

  render(sonuc);

  if (sonucSatiri) {
    if (sonuc.length === 0) {
      sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
    } else {
      sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
    }
  }
}

// Başlangıç Çalıştırma Mantığı
if (listContainer) {
  if (listContainer.dataset.limit) {
    // Ana Sayfa Mantığı (Adım 5: Tarihe göre sırala ve ilk N tanesini al)
    const yaklasan = [...events]
      .sort((a, b) => {
        const dateA = a.date.split("-").reverse().join("-");
        const dateB = b.date.split("-").reverse().join("-");
        return dateA.localeCompare(dateB);
      })
      .slice(0, Number(listContainer.dataset.limit));

    render(yaklasan);
  } else {
    // Etkinlikler Liste Sayfası Mantığı (Adım 6 ve 7)
    populateCategories();
    render(events);
    if (sonucSatiri) sonucSatiri.textContent = `${events.length} etkinlik listeleniyor.`;

    if (aramaInput) aramaInput.addEventListener("input", filtrele);
    if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);
    if (filtreFormu) {
      filtreFormu.addEventListener("submit", (e) => e.preventDefault());
    }
  }
}