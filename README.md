# Web Undangan Pernikahan Digital Adat Nusantara & Luxury Studio
### 5 Pilihan Tema: Bugis Klasik • Toraja Tongkonan • Suku Kajang • Pantai Bira • Studio Wedding Adat Bugis

Website undangan pernikahan digital (*E-Invitation*) mewah dan responsif dengan **5 Pilihan Tema Eksklusif**:
1. **Tema 1 (Adat Bugis-Makassar)**: Nuansa kemegahan Saoraja Timpa Laja', Beludru Marun, dan Tenun Sutera Lagosi (`bugis.html`).
2. **Tema 2 (Toraja Modern & Klasik)**: Nuansa arsitektur megah Tongkonan, 4 Warna Sakral Adat (Merah Oker, Kuning Emas, Hitam Jelaga, Putih Gading), dan ukiran Pa'ssura' (`toraja.html`).
3. **Tema 3 (Adat Sakral Suku Kajang Ammatoa)**: Nuansa Tenun Hitam Le'leng, Filosofi Kesederhanaan *Tallasa' Kamase-masea & Kalambusang* Bulukumba (`kajang.html`).
4. **Tema 4 (Modern Coastal Wedding Pantai Bira)**: Nuansa keindahan bahari pasir putih Tanjung Bira, Deep Ocean Azure, dan perahu Pinisi Bulukumba (`bira.html`).
5. **Tema 5 (Luxury Studio Wedding Adat Bugis Heritage)**: Konsep editorial photoshoot studio mewah, pencahayaan spotlight studio, frame galeri rapi, foto prewedding adat Bugis lengkap (Baju Bodo, Jas Tutup, Mahkota Saloko, Songkok Recca), dan tipografi berdaya baca sangat tinggi & tajam (`studio.html`).

Terdapat tombol **"Pilih Tema (Universal Theme Switcher)"** di pojok kanan atas semua halaman untuk berpindah antar 5 tema secara instan.

---

## 🌟 Fitur Utama & Nuansa Budaya

1. **Estetika & Suasana Suku Adat Bugis-Makassar**:
   - **Palet Warna Kerajaan**: Merah Beludru Adat (*Royal Velvet Maroon*), Kemilau Emas (*Metallic Gold*), dan Hijau Zamrud (*Noble Emerald*).
   - **Simbol & Ornamen Adat Autentik**:
     - *Timpa Laja'* 5 tingkat (bubungan segitiga Saoraja kehormatan bangsawan Bugis).
     - Motif anyaman sarung sutera Bugis *Lagosi* (*Lipa' Sabbe* Sengkang).
     - Aksara Lontara Bugis (*ᨅᨔ ᨕᨘᨁᨗ*) dan pepatah luhur: *"Sipakatau, Sipakalebbi, Sipakainge"*, *"Narekko siri' tapakaraja, deceng muturusi..."*.
     - Ilustrasi mempelai berbusana lengkap: *Baju Bodo*, *Mahkota Saloko* kembang goyang emas, rumbai melati, *Jas Tutu'*, *Songkok Recca / Pamiring* emas, *Kawali / Badik*, dan selempang *Rante Manuk-manuk*.
2. **Cover Pembuka Interaktif (Gate / Amplop Digital)**:
   - Nama tamu otomatis diambil dari link URL (contoh: `?to=Nama+Tamu`).
   - Tombol **"Buka Undangan"** yang membuka gerbang dan memulai alunan musik secara otomatis.
3. **Alunan Musik Tradisional Bugis Otomatis**:
   - Dilengkapi synthesizer audio built-in (Web Audio API) yang melantunkan petikan melodi Kecapi dan tiupan Suling Bugis yang menenangkan secara offline tanpa risiko file hilang atau diblokir browser.
   - Tombol kontrol audio melayang (*floating button*) dengan animasi piringan berputar dan equalizer suara.
   - Dapat diganti dengan file MP3 pilihan sendiri melalui tag `<audio id="weddingAudio">` di `index.html`.
4. **Efek Visual Kemilau Autentik**:
   - Kanvas partikel serpihan emas (*gold flakes*) dan kelopak bunga melati pengantin Bugis yang melayang anggun.
   - Pola tenun sarung sutera Bugis *Lipa' Sabbe Lagosi* Sengkang di latar belakang dengan gradasi beludru marun kerajaan.
   - Animasi kemunculan konten halus saat halaman digulir (*Scroll Reveal*).
5. **Countdown Timer Hari H**:
   - Hitung mundur hari, jam, menit, dan detik menuju akad dan resepsi.
   - Tombol integrasi langsung ke Google Calendar.
6. **Rangkaian Upacara Adat Bugis**:
   - *Malam Mappacci / Tudang Sipulung* (Ritual pensucian diri 7 lapis sarung sutera dan daun pacar).
   - *Akad Nikah / Ijab Qabul*.
   - *Resepsi & Mappasikarawa* (Sentuhan pertama penuh berkah).
7. **Peta & Lokasi Interaktif**:
   - Google Maps tersemat rapi beserta tombol navigasi penunjuk arah.
8. **Galeri Foto Prewedding & Lightbox**:
   - Galeri bertema Bugis Makassar dengan pop-up tampilan penuh saat foto diklik.
9. **Amplop Digital (Wedding Gift)**:
   - Rekening Bank (BCA, Mandiri) dan alamat pengiriman kado fisik lengkap dengan tombol satu kali klik *Salin Nomor Rekening* (Copy to Clipboard) beserta notifikasi toast.
10. **Buku Tamu & RSVP Interaktif**:
    - Tamu dapat mengisi konfirmasi kehadiran (Hadir, Ragu-ragu, Berhalangan) dan doa restu.
    - Ucapan langsung tersimpan di peramban (`localStorage`) dan langsung tampil di linimasa ucapan secara real-time.
11. **Navigasi Cepat Melayang (*Bottom Navigation Bar*)**:
    - Mempermudah tamu berpindah antar sesi di layar ponsel (*smartphone*).

---

## 📂 Struktur File

```
TES/
├── index.html                   # Halaman web utama undangan
├── server.js                    # Server lokal ringan (opsional)
├── README.md                    # Dokumentasi lengkap
├── css/
│   ├── style.css                # Desain visual tema Bugis-Makassar
│   └── toraja.css               # Desain visual tema Toraja (modern & klasik)
├── js/
│   ├── app.js                   # Interaktivitas tema Bugis-Makassar
│   ├── audio.js                 # Sintesis musik petikan Kecapi Bugis
│   ├── toraja.js                # Interaktivitas tema Toraja (RSVP, lightbox, countdown)
│   └── toraja-audio.js          # Sintesis musik Suling Lembang Toraja
└── assets/
    ├── lagu.aac                 # Musik audio latar pernikahan (dari Desktop)
    ├── toraja/
    │   ├── bg-toraja-custom.jpeg # Foto background adat Toraja (dari Desktop: baground adat toraja1.jpeg)
    │   ├── tongkonan.svg        # Arsitektur rumah adat Tongkonan
    │   ├── passura-pattern.svg  # Motif ukiran kayu Pa'ssura' 4 warna sakral
    │   └── patedong-icon.svg    # Ikon kerbau Pa'tedong kehormatan adat
    ├── saoraja-ornament.svg     # Bubungan atap rumah panggung Bugis Timpa Laja'
    ├── lagosi-pattern.svg       # Pola motif sutera Bugis Lagosi
    ├── corner-ornament.svg      # Ornamen sudut ukiran emas
    ├── divider-gold.svg         # Garis pembatas emas
    ├── mappacci-icon.svg        # Ikon ritual Mappacci & lilin adat
    ├── couple-bugis.svg         # Ilustrasi pengantin Baju Bodo & Jas Tutu'
    └── images/
        ├── groom.jpeg           # Foto Mempelai Pria (Aswandi Syam)
        ├── bride.jpeg           # Foto Mempelai Wanita (Wira Kartika Putri)
        ├── couple.jpeg          # Foto Pasangan Kedua Mempelai (Couple)
        ├── gallery-1.jpeg       # Foto Galeri Prewedding 1 (dari Desktop)
        ├── gallery-2.jpeg       # Foto Galeri Prewedding 2 (dari Desktop)
        ├── gallery-3.jpeg       # Foto Galeri Prewedding 3 (dari Desktop)
        ├── gallery-4.jpeg       # Foto Galeri Prewedding 4 (dari Desktop)
        ├── gallery-5.jpeg       # Foto Galeri Prewedding 5 (dari Desktop)
        └── gallery-6.jpeg       # Foto Galeri Prewedding 6 (dari Desktop)
```

---

## 🚀 Cara Menjalankan

### Cara 1: Buka Langsung di Browser
Cukup klik ganda file [index.html](file:///c:/Users/alwimz/Downloads/TES/index.html) di file explorer Anda (menggunakan Google Chrome, Edge, Safari, Firefox).

### Cara 2: Menggunakan Server Lokal Ringan (Node.js)
Jalankan perintah berikut di terminal:
```bash
node server.js
```
Kemudian buka browser di:
- `http://localhost:3000`
- Atau dengan nama tamu kustom:
  `http://localhost:3000/?to=Puang+Hj.+Bau+Tenri+%26+Keluarga`
  `http://localhost:3000/?to=Bapak+Andi+Sultan`

---

## ✍️ Cara Menyesuaikan Data Pernikahan

1. **Mengubah Nama Mempelai & Orang Tua**:
   - Buka [index.html](file:///c:/Users/alwimz/Downloads/TES/index.html) dan cari teks `Aswandi Syam` serta `Wira Kartika Putri`.
2. **Mengubah Tanggal & Waktu Acara**:
   - Di [index.html](file:///c:/Users/alwimz/Downloads/TES/index.html), ubah tanggal dan jam di bagian `#acara`.
   - Di [js/app.js](file:///c:/Users/alwimz/Downloads/TES/js/app.js) baris 86:
     ```javascript
     const targetDate = new Date('2026-12-12T09:00:00+08:00').getTime();
     ```
3. **Mengubah Rekening Bank / Nomor Kado**:
   - Di [index.html](file:///c:/Users/alwimz/Downloads/TES/index.html), cari bagian `#kado` dan ganti nomor rekening serta atribut `data-account`.
4. **Mengganti Musik dengan Lagu Sendiri**:
   - Cukup masukkan file lagu Anda (misal `lagu-bugis.mp3`) ke dalam folder `assets/` dan tambahkan tag di `index.html`:
     ```html
     <audio id="weddingAudio" loop preload="none">
       <source src="assets/lagu-bugis.mp3" type="audio/mp3">
     </audio>
     ```
