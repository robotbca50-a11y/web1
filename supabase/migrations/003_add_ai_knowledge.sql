-- 003_add_ai_knowledge.sql
-- Comprehensive AI knowledge base entries

-- Delete existing entries to avoid duplicates
DELETE FROM public.ai_knowledge;

INSERT INTO public.ai_knowledge (topic, content, category) VALUES
-- Umum
('welcome', 'Halo! Saya adalah AI assistant dari Web Utama. Saya bisa membantu menjawab pertanyaan tentang fitur-fitur web ini, memberikan tips, dan membantu menyelesaikan masalah. Ketik "help" untuk melihat semua topik yang bisa saya bantu.', 'general'),
('about', 'Web Utama adalah pusat kendali digital yang menyediakan akses ke berbagai tools dan layanan: Typing Test, Notepad, Broadcast, dan AI Assistant. Dibangun dengan Next.js 16, Supabase, dan Tailwind CSS. Tema bisa diganti dari 10 opsi yang tersedia.', 'general'),
('help', 'Saya bisa membantu tentang:\n1. Typing Test - cara bermain, tips, multiplayer\n2. Notepad - fitur catatan pribadi\n3. Broadcast - info & pengumuman\n4. Theme - ganti tampilan (10 tema)\n5. AI Chatbot - tentang saya\n6. Admin Panel - panel khusus admin\n7. Error/Bug - troubleshooting\n\nCoba tanyakan topik spesifik untuk jawaban lebih detail!', 'general'),
('features', 'Fitur utama Web Utama:\n- Typing Test: Latihan mengetik dengan 3 difficulty dan mode solo/multiplayer\n- Notepad: Catatan pribadi online dengan auto-save dan fitur pin\n- Broadcast: Info dan pengumuman dari admin dengan 4 level prioritas\n- AI Chatbot: Asisten virtual yang bisa menjawab pertanyaan\n- 10 Themes: Cyborg, Samurai, Aurora, Marvel, Medieval, Cyberpunk, Space, Nature, Deep Ocean, Volcanic\n- Links Hub: Kumpulan link dan project yang dikelola admin', 'general'),

-- Typing Test
('typing_test', 'Typing Test memiliki 3 mode difficulty: Easy (kata-kata umum seperti "the", "and", "is"), Medium (kata campuran termasuk kata sulit), Hard (kata kompleks dan snippet kode). Waktu per sesi: 15s, 30s, 60s, atau 120s. Kamu bisa bermain solo atau bersama teman via room code.', 'features'),
('typing_easy', 'Mode Easy Typing Test: Menggunakan kata-kata umum sehari-hari yang sering digunakan dalam bahasa Inggris. Cocok untuk pemula atau pemanasan. Contoh kata: "the", "quick", "brown", "fox", "jump", "over". Target: 40-60 WPM.', 'features'),
('typing_medium', 'Mode Medium Typing Test: Campuran kata-kata umum dan sulit. Tantangan lebih besar dari Easy. Contoh kata: "beautiful", "algorithm", "javascript", "efficiency". Target: 60-80 WPM.', 'features'),
('typing_hard', 'Mode Hard Typing Test: Kata-kata kompleks dan snippet kode programming. Untuk typist berpengalaman. Contoh: "function", "async/await", "const", bracket notation. Target: 80+ WPM.', 'features'),
('typing_multiplayer', 'Multiplayer Typing Test:\n1. Pilih mode "Friend"\n2. Klik "Create Room" → dapat 6-digit room code\n3. Share code ke teman\n4. Teman klik "Join Room" → masukkan code\n5. Tunggu kedua pemain siap\n6. Race dimulai!\n\nPemenang: WPM tertinggi dengan accuracy minimal 80%.', 'features'),
('typing_tips', 'Tips meningkatkan WPM:\n1. Jangan terburu-buru, fokus accuracy dulu\n2. Latihan 15-30 menit setiap hari\n3. Mulai dari Easy, naik ke Hard secara bertahap\n4. Gunakan semua 10 jari, bukan hanya 2-3\n5. Jangan melihat keyboard (touch typing)\n6. Postur tubuh tegak, pergelangan tangan mengambang\n7. Beristirahat jika jari mulai lelah\n8. Accuracy 95% dengan 50 WPM lebih baik dari 30% dengan 100 WPM', 'tips'),
('typing_accuracy', 'Accuracy dalam typing test dihitung dari jumlah karakter yang benar dibagi total karakter yang diketik. Tips menjaga accuracy:\n- Ketik dengan ritme stabil\n- Jangan spam tombol\n- Perhatikan spasi dan huruf besar/kecil\n- Jika salah, tekan Backspace untuk koreksi\n- Fokus pada kata yang sedang diketik, bukan yang akan datang', 'tips'),

-- Notepad
('notepad', 'Notepad adalah fitur catatan pribadi online:\n- Klik "+ New Note" untuk membuat catatan baru\n- Ketik judul dan isi catatan\n- Klik ikon pin untuk menyematkan catatan penting\n- Catatan tersimpan otomatis ke cloud\n- Bisa diakses dari device manapun setelah login\n- Fitur pencarian untuk menemukan catatan dengan cepat\n- Hapus catatan yang tidak diperlukan', 'features'),
('notepad_tips', 'Tips menggunakan Notepad:\n- Pin catatan penting agar selalu di atas\n- Gunakan judul yang deskriptif agar mudah dicari\n- Manfaatkan pencarian untuk catatan banyak\n- Notepad tersinkronisasi otomatis ke cloud\n- Cocok untuk menyimpan room code, daftar task, atau ide', 'tips'),

-- Broadcast
('broadcast', 'Broadcast menampilkan informasi penting dari admin. Level prioritas:\n- Low (abu-abu): Info biasa, tidak mendesak\n- Normal (biru): Info penting yang perlu diketahui\n- High (kuning): Perlu perhatian segera\n- Urgent (merah): Sangat penting, tindakan segera diperlukan!\n\nBroadcast terbaru muncul di halaman Broadcast.', 'features'),

-- Theme
('theme', 'Web Utama punya 10 tema keren dengan animasi loading unik:\n1. Cyborg - Teknologi futuristik, warna biru-hijau\n2. Samurai - Elegansi Jepang, merah-hitam\n3. Aurora - Cahaya utara, hijau-ungu\n4. Marvel - Superhero, merah-biru\n5. Medieval - Abad pertengahan, coklat-emas\n6. Cyberpunk - Neon futuristik, pink-kuning\n7. Space - Luar angkasa, biru-ungu\n8. Nature - Alam hijau, hijau-coklat\n9. Deep Ocean - Samudra dalam, biru tua\n10. Volcanic - Magma, merah-oranye\n\nKlik tombol theme picker di navbar untuk ganti tema. Tersimpan otomatis!', 'features'),
('theme_loading', 'Setiap tema memiliki animasi loading unik yang ditampilkan saat aplikasi memuat:\n- Cyborg: Matrix digital rain (hijau)\n- Samurai: Enso circle (merah)\n- Aurora: Aurora wave (ungu-hijau)\n- Marvel: Comic burst (merah-biru)\n- Medieval: Celtic knot (emas)\n- Cyberpunk: Neon scan lines (pink)\n- Space: Star field (biru)\n- Nature: Leaf fall (hijau)\n- Deep Ocean: Bubble rise (biru tua)\n- Volcanic: Magma flow (merah-oranye)', 'features'),

-- AI Chatbot
('ai_chatbot', 'AI Chatbot Web Utama adalah asisten virtual berbasis rule-based AI. Fitur:\n- Menjawab pertanyaan tentang fitur web\n- Memberikan tips typing test\n- Membantu troubleshooting masalah\n- Menjadi panduan penggunaan web\n- Learning dari percakapan untuk jawaban lebih baik\n- Feedback (thumbs up/down) untuk meningkatkan kualitas', 'features'),
('ai_how_it_works', 'AI Chatbot bekerja dengan:\n1. Menerima pertanyaan dari user\n2. Mencari knowledge base yang relevan\n3. Memproses dengan rule-based engine\n4. Menghasilkan respons yang sesuai\n5. Menyimpan percakapan untuk konteks\n\nAI ini tidak menggunakan API eksternal - sepenuhnya berjalan di server.', 'features'),

-- Admin Panel
('admin_panel', 'Master Panel (Admin) adalah area khusus admin yang bisa diakses di /master:\n- Links: Kelola semua link dan project yang tampil di hub\n- Broadcasts: Buat dan kelola pengumuman\n- AI Knowledge: Kelola basis pengetahuan AI\n- Analytics: Statistik penggunaan web\n\nLogin menggunakan username dan password yang ditentukan admin.', 'features'),
('admin_analytics', 'Halaman Analytics di admin panel menampilkan:\n- Total races (typing test yang sudah dimainkan)\n- Total users (jumlah pengguna terdaftar)\n- Average WPM rata-rata semua pemain\n- Top WPM skor tertinggi\n- Breakdown per difficulty (Easy/Medium/Hard)\n- Daftar hasil terbaru', 'features'),

-- Teknis
('keyboard_shortcut', 'Keyboard shortcuts yang tersedia:\n- Tab + Enter: Mulai typing test (di halaman typing test)\n- Backspace: Hapus karakter terakhir (di typing test)\n- Ctrl+S: Simpan catatan (di notepad)\n- Enter: Kirim pesan (di AI chatbot)', 'features'),
('browser_support', 'Web Utama mendukung semua browser modern:\n- Google Chrome (recommended)\n- Mozilla Firefox\n- Microsoft Edge\n- Safari\n- Opera\n\nGunakan browser terbaru untuk pengalaman terbaik.', 'general'),
('responsive', 'Web Utama adalah responsive web yang bisa diakses dari:\n- Desktop/Laptop: Tampilan penuh dengan sidebar\n- Tablet: Adaptif dengan grid 2 kolom\n- Smartphone: Tampilan mobile dengan bottom navigation\n\nSemua fitur tersedia di semua ukuran layar.', 'general'),
('troubleshooting', 'Jika mengalami masalah:\n1. Refresh halaman (F5 / Ctrl+R)\n2. Clear browser cache (Ctrl+Shift+Del)\n3. Coba browser lain\n4. Pastikan koneksi internet stabil\n5. Login ulang jika session expired\n6. Cek console browser (F12) untuk error\n7. Hubungi admin jika masalah berlanjut', 'general'),

-- Tips & Tricks
('productivity_tips', 'Tips produktivitas:\n- Gunakan Notepad untuk menyimpan daftar harian\n- Pin catatan penting agar mudah diakses\n- Ganti tema sesuai mood untuk produktivitas\n- Latihan typing test 15 menit sehari untuk meningkatkan WPM\n- Manfaatkan AI chatbot untuk pertanyaan cepat', 'tips'),
('wpm_explanation', 'WPM (Words Per Minute) adalah ukuran kecepatan mengetik. 1 WPM = 5 karakter per menit. Jadi 60 WPM = 300 karakter per menit.\n\nStandar WPM:\n- 20-30: Pemula\n- 30-40: Rata-rata\n- 40-60: Di atas rata-rata\n- 60-80: Cepat\n- 80-100: Sangat cepat\n- 100+: Profesional', 'tips'),
('copy_paste_tip', 'Catatan penting tentang copy-paste di Typing Test: Tidak diperbolehkan! Sistem mendeteksi paste events. Fokus pada ketik manual untuk hasil yang akurat dan meningkatkan skill mengetik.', 'tips');
