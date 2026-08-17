-- 004_smart_ai_knowledge.sql
-- Excel, Google Sheets, and general intelligence knowledge

DELETE FROM public.ai_knowledge WHERE category IN ('excel', 'gsheet', 'math', 'coding', 'writing', 'general_ai');

INSERT INTO public.ai_knowledge (topic, content, category) VALUES

-- EXCEL FORMULAS: Basic
('sum', E'SUM: Menjumlahkan range angka.\nContoh: =SUM(A1:A10)\n=SUM(A1:A10, C1:C10)\nTips: SUM otomatis mengabaikan teks dan sel kosong.', 'excel'),
('average', E'AVERAGE: Menghitung rata-rata.\n=AVERAGE(B1:B20)\n=AVERAGEIF(A1:A10,">0")\n=AVERAGEIFS(B1:B10,A1:A10,">5",C1:C10,"yes")', 'excel'),
('count', E'COUNT: Menghitung jumlah sel.\n=COUNT(A1:A10) // sel angka\n=COUNTA(A1:A10) // sel tidak kosong\n=COUNTBLANK(A1:A10) // sel kosong\n=COUNTIF(A1:A10,"selesai")', 'excel'),
('max_min', E'MAX & MIN:\n=MAX(A1:A10) // nilai terbesar\n=MIN(A1:A10) // nilai terkecil\n=MAXIFS(B1:B10,A1:A10,"Januari")\n=LARGE(A1:A10,2) // terbesar ke-2\n=SMALL(A1:A10,3) // terkecil ke-3', 'excel'),
('sumproduct', E'SUMPRODUCT: Kalikan lalu jumlahkan.\n=SUMPRODUCT(A1:A5,B1:B5)\nBerguna untuk total harga (qty x harga).', 'excel'),
('round', E'ROUND, ROUNDUP, ROUNDDOWN:\n=ROUND(A1,2) // 2 desimal\n=ROUNDUP(A1,0) // bulatkan ke atas\n=ROUNDDOWN(A1,0) // bulatkan ke bawah\n=FLOOR(A1,5) // bawah kelipatan 5\n=CEILING(A1,5) // atas kelipatan 5', 'excel'),

-- EXCEL: Logical
('if', E'IF: Conditional logic.\n=IF(A1>60,"Lulus","Tidak Lulus")\nNesting: =IF(A1>=90,"A",IF(A1>=80,"B",IF(A1>=70,"C","D")))\nMaksimal 64 level di Excel, 50 di Google Sheets.', 'excel'),
('ifs', E'IFS: Multiple conditions tanpa nesting.\n=IFS(A1>=90,"A",A1>=80,"B",A1>=70,"C",TRUE,"D")\nLebih rapi dari IF bersarang. Excel 2019+ dan Google Sheets.', 'excel'),
('switch', E'SWITCH: Cocokkan nilai.\n=SWITCH(A1,"Jan","Januari","Feb","Februari","Mar","Maret","?")\nGoogle Sheets dan Excel 2019+.', 'excel'),
('and_or_not', E'AND, OR, NOT:\n=IF(AND(A1>0,A1<100),"Valid","Invalid")\n=IF(OR(A1="Ya",A1="ya"),TRUE,FALSE)\n=IF(NOT(A1=""),"Ada isi","Kosong")', 'excel'),
('iferror', E'IFERROR: Tangani error.\n=IFERROR(A1/B1,"Error")\n=IFERROR(VLOOKUP(...),"Tidak ditemukan")\n=IFNA(A1,"N/A") // handle #N/A', 'excel'),

-- EXCEL: Lookup
('vlookup', E'VLOOKUP: Cari di kolom pertama, ambil dari kolom lain.\n=VLOOKUP(A1,D:E,2,FALSE)\nFALSE = exact match (paling sering dipakai)\nTRUE = approximate match\nLimitasi: hanya mencari ke KANAN.', 'excel'),
('hlookup', E'HLOOKUP: Seperti VLOOKUP tapi horizontal.\n=HLOOKUP(A1,C5:Z8,3,FALSE)\nJarang dipakai. VLOOKUP atau INDEX-MATCH lebih umum.', 'excel'),
('index_match', E'INDEX + MATCH: Lebih fleksibel dari VLOOKUP.\n=INDEX(C1:C10,MATCH(A1,A1:A10,0))\nMATCH: cari posisi. INDEX: ambil nilai.\nBisa mencari ke KIRI. Formula lookup favorit profesional.', 'excel'),
('xlookup', E'XLOOKUP: Pencarian modern (Excel 365 / Google Sheets).\n=XLOOKUP(A1,D:D,C:C,"Tidak ditemukan",0,1)\nBisa ke kiri, ke atas, ke bawah. Menggantikan VLOOKUP/HLOOKUP/INDEX-MATCH.', 'excel'),
('indirect', E'INDIRECT: Buat referensi dari teks.\n=INDIRECT("A"&B1) // jika B1=3, merujuk A3\n=INDIRECT("Sheet"&A1&"!B2") // referensi silang sheet\nVOLATILE (lambat).', 'excel'),
('offset', E'OFFSET: Buat range dinamis.\n=OFFSET(A1,0,0,COUNTA(A:A),1)\nBerguna untuk chart dinamis. VOLATILE.', 'excel'),

-- EXCEL: Text
('left_right_mid', E'LEFT, RIGHT, MID: Ambil teks.\n=LEFT(A1,5) // 5 dari kiri\n=RIGHT(A1,4) // 4 dari kanan\n=MID(A1,3,6) // dari posisi 3, ambil 6\n=LEN(A1) // panjang\n=TRIM(A1) // hapus spasi berlebih', 'excel'),
('upper_lower_proper', E'UPPER, LOWER, PROPER:\n=UPPER(A1) // SEMUA BESAR\n=lower(a1) // semua kecil\n=proper(a1) // Setiap Kata Huruf Besar\n=SUBSTITUTE(A1,"old","new")', 'excel'),
('concatenate', E'CONCATENATE & &: Gabungkan teks.\n=CONCATENATE(A1," ",B1)\n=A1&" "&B1 // cara singkat\n=TEXTJOIN(", ",TRUE,A1:A10)\n=TEXT(A1,"DD-MMM-YYYY")', 'excel'),
('find_search', E'FIND & SEARCH: Cari posisi teks.\n=FIND("@",A1) // case-sensitive\n=SEARCH("@",A1) // case-insensitive\n=ISNUMBER(FIND("@",A1)) // cek keberadaan', 'excel'),
('substitute_replace', E'SUBSTITUTE: Ganti teks spesifik.\n=SUBSTITUTE(A1," ","_")\n=SUBSTITUTE(A1,"old","new",1) // kejadian pertama saja\nBerbeda dari REPLACE yang pakai posisi.', 'excel'),

-- EXCEL: Date
('today_now', E'TODAY, NOW:\n=TODAY() // tanggal hari ini\n=NOW() // tanggal + waktu\n=TODAY()+7 // 7 hari lagi\nVolatile: berubah setiap kali sheet dihitung ulang.', 'excel'),
('date_functions', E'YEAR, MONTH, DAY:\n=YEAR(A1) // ambil tahun\n=MONTH(A1) // ambil bulan (1-12)\n=DAY(A1) // ambil tanggal\n=DATE(2024,12,25) // buat tanggal\n=DATEDIF(A1,B1,"D") // selisih hari\n=EOMONTH(A1,0) // akhir bulan', 'excel'),
('weekday', E'WEEKDAY & WEEKNUM & WORKDAY:\n=WEEKDAY(A1) // 1=Min,7=Sab\n=WEEKNUM(A1) // nomor minggu\n=WORKDAY(A1,10) // +10 hari kerja\n=NETWORKDAYS(A1,B1) // hitung hari kerja', 'excel'),

-- EXCEL: Conditional Aggregation
('sumif', E'SUMIF & SUMIFS:\n=SUMIF(A:A,"Selesai",B:B)\n=SUMIFS(C:C,A:A,">=1/1/2024",A:A,"<=31/12/2024",B:B,"Yes")\nSUMIF: 1 kriteria. SUMIFS: multi-kriteria.', 'excel'),
('countif', E'COUNTIF & COUNTIFS:\n=COUNTIF(A:A,"Selesai")\n=COUNTIFS(A:A,">5",B:B,"<10")\n=COUNTIF(A:A,"*"&B1&"*") // wildcard', 'excel'),
('averageif', E'AVERAGEIF & AVERAGEIFS:\n=AVERAGEIF(B:B,">0")\n=AVERAGEIFS(C:C,A:A,"Jan",B:B,">100")', 'excel'),

-- GOOGLE SHEETS Specific
('gsheet_query', E'QUERY: SQL-like query di Google Sheets.\n=QUERY(A1:D100,"SELECT A, SUM(C) WHERE B=\"Active\" GROUP BY A ORDER BY SUM(C) DESC",1)\nFungsi paling powerful di Google Sheets!\nBisa SELECT, WHERE, GROUP BY, ORDER BY, PIVOT, LABEL.', 'gsheet'),
('gsheet_filter', E'FILTER: Filter data dinamis.\n=FILTER(A1:C100,B1:B100="Selesai",C1:C100>100)\nLebih baik dari AutoFilter karena otomatis update.', 'gsheet'),
('gsheet_sort', E'SORT: Urutkan data.\n=SORT(A1:C100,2,TRUE) // kolom ke-2, ASC\n=SORT(A1:C100,3,FALSE,1,TRUE) // kolom 3 DESC, kolom 1 ASC', 'gsheet'),
('gsheet_unique', E'UNIQUE: Ambil nilai unik.\n=UNIQUE(A1:A100) // hapus duplikat\n=UNIQUE(A1:B100) // baris unik', 'gsheet'),
('gsheet_arrayformula', E'ARRAYFORMULA: Terapkan formula ke range.\n=ARRAYFORMULA(IF(A1:A>0,A1:A*B1:B,""))\n=ARRAYFORMULA(ROW(A1:A)) // nomor baris\nSangat powerful tapi bisa lambat.', 'gsheet'),
('gsheet_sparkline', E'SPARKLINE: Mini chart di dalam sel.\n=SPARKLINE(A1:A10) // line chart\n=SPARKLINE(A1:A10,{"charttype","bar"}) // bar\n=SPARKLINE(A1:A10,{"charttype","column";"color","blue"})', 'gsheet'),
('gsheet_import', E'IMPORT functions:\n=IMPORTHTML("URL","table",1)\n=IMPORTXML("URL","//div[@class=\"data\"]")\n=IMPORTDATA("URL")\n=IMPORTFEED("rss_url","title",,10)', 'gsheet'),

-- Advanced Excel
('formula_cheat_sheet', E'Rumus Excel/Sheets paling sering dipakai:\n\nJUMLAH: SUM, SUMIF, SUMIFS, SUMPRODUCT\nRATA-RATA: AVERAGE, AVERAGEIF, AVERAGEIFS\nHITUNG: COUNT, COUNTA, COUNTIF, COUNTIFS\nCARI: VLOOKUP, INDEX-MATCH, XLOOKUP\nLOGIKA: IF, IFS, AND, OR, NOT, IFERROR\nTEKS: LEFT, RIGHT, MID, LEN, TRIM, UPPER, LOWER\nTANGGAL: TODAY, NOW, YEAR, MONTH, DAY, DATEDIF\nROUND: ROUND, ROUNDUP, ROUNDDOWN\nFILTER: FILTER, SORT, UNIQUE, QUERY (Google Sheets)', 'excel'),
('pivot_table', E'Pivot Table: Ringkasan data interaktif.\n1. Select data > Insert > Pivot Table\n2. Drag field ke Rows/Columns/Values/Filters\n3. Bisa grouping, sorting, filtering\nAlternatif: =SUMIFS() atau QUERY() di Google Sheets.', 'excel'),
('data_validation', E'Data Validation: Batasi input sel.\n- Dropdown: Data Validation > List\n- Custom formula: =AND(A1>0,A1<100)\n- Error alert: pesan jika input salah\nGoogle Sheets: Data > Data validation > Drop-down.', 'excel'),

-- MATH
('math_algebra', E'Algebra Dasar:\n- Linear: ax + b = 0 => x = -b/a\n- Kuadrat: ax2 + bx + c = 0 => x = (-b +- sqrt(b2-4ac)) / 2a\n- Pythagoras: a2 + b2 = c2\n- Luas lingkaran: pi*r2\n- Volume bola: (4/3)*pi*r3\n- Volume tabung: pi*r2*h\n- Volume kerucut: (1/3)*pi*r2*h', 'math'),
('math_percentage', E'Persen & Perhitungan:\n- X% dari Y = (X/100) * Y\n- Persentase: (Bagian/Total) * 100\n- Kenaikan: Baru = Lama * (1 + Persen/100)\n- Diskon: Harga Akhir = Harga * (1 - Diskon/100)\n- Profit: ((Jual-Beli)/Beli) * 100\n- Pajak: Total = Harga * (1 + Pajak/100)\n- Bunga majemuk: FV = PV * (1 + r)^n', 'math'),
('math_statistics', E'Statistik Dasar:\n- Mean: sum(xi) / n\n- Median: nilai tengah\n- Modus: paling sering\n- Standar Deviasi: sqrt(sum((xi-mean)^2) / n)\n- Varians: sigma^2\n- Range: Max - Min\n- Korelasi (r): -1 sampai 1', 'math'),
('math_trigonometry', E'Trigonometri:\n- sin(x) = depan/miring\n- cos(x) = samping/miring\n- tan(x) = depan/samping\n- sin2(x) + cos2(x) = 1\n- Radian = derajat * pi / 180', 'math'),

-- CODING
('coding_python', E'Python:\n- Variable: x = 10, name = "Budi"\n- If: if x > 5: ...\n- For: for i in range(10)\n- List: [1,2,3]\n- Dict: {"a": 1}\n- Function: def greet(name): return f"Hi {name}"\n- Comprehension: [x**2 for x in range(10)]\n- Lambda: square = lambda x: x**2', 'coding'),
('coding_javascript', E'JavaScript ES6+:\n- const/let, Arrow functions\n- Destructuring: const {a,b} = obj\n- Spread: [...arr], {...obj}\n- Map/Filter/Reduce\n- Async/Await\n- Template literal: `Halo ${name}`\n- Optional chaining: obj?.value', 'coding'),
('coding_html_css', E'HTML/CSS:\nSemantic tags: header, nav, main, section, article, footer\nFlexbox: display:flex; justify-content:center; align-items:center\nGrid: display:grid; grid-template-columns:repeat(3,1fr)\nPosition: static, relative, absolute, fixed, sticky', 'coding'),
('coding_git', E'Git Commands:\ngit init, git add ., git commit -m "msg"\ngit push, git pull, git clone <url>\ngit branch <name>, git checkout <branch>\ngit merge <branch>, git log --oneline\ngit stash, git stash pop\ngit revert <commit>, git reset HEAD~1', 'coding'),
('coding_sql', E'SQL Basics:\nSELECT * FROM table WHERE condition\nINSERT INTO table (col) VALUES (val)\nUPDATE table SET col = val WHERE condition\nDELETE FROM table WHERE condition\nJOIN: SELECT * FROM a INNER JOIN b ON a.id = b.a_id\nGROUP BY, ORDER BY, HAVING, LIMIT', 'coding'),

-- WRITING
('writing_email', E'Email Professional:\n- Subjek: jelas dan singkat\n- Salam: "Yth. Bapak/Ibu" atau "Dear [Name]"\n- Isi: langsung ke poin, paragraf pendek\n- Penutup: "Terima kasih", "Hormat saya"\n- CC/BCC: hati-hati jangan salah kirim\n- Follow-up: tunggu 2-3 hari kerja', 'writing'),
('writing_cv', E'CV/Resume:\n1. Contact info (nama, email, HP)\n2. Summary (2-3 kalimat)\n3. Experience (reverse chronological)\n4. Education\n5. Skills (hard & soft)\n6. Projects (opsional)\nTips: 1-2 halaman, gunakan action verbs, quantifiable results.', 'writing'),
('writing_report', E'Laporan:\n- Pendahuluan: latar belaung & tujuan\n- Isi: data, analisis, temuan\n- Penutup: kesimpulan & rekomendasi\nGunakan heading, sub-heading, bullet points\nRasio: 60% data, 40% analisis', 'writing'),
