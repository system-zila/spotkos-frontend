export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
    }[];
    conclusion: string;
  };
}

export const articles: Article[] = [
  {
    id: 'tips-mencari-kos-aman',
    title: '7 Tips Mencari Kos yang Aman dan Nyaman',
    excerpt: 'Panduan lengkap mulai dari cek lokasi, fasilitas keamanan, hingga membaca ulasan penghuni sebelumnya. Pastikan kos impianmu aman dan nyaman!',
    image: 'https://images.unsplash.com/photo-1586739050530-2fddeb1770d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBzYWZldHklMjB0aXBzfGVufDF8fHx8MTc3MzA2OTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tips & Trik',
    date: '5 Maret 2026',
    readTime: '5 menit',
    author: 'Tim SpotKos',
    content: {
      intro: 'Mencari kos yang aman dan nyaman adalah prioritas utama bagi setiap mahasiswa atau pekerja yang akan merantau. Keputusan memilih tempat tinggal tidak boleh sembarangan karena akan menjadi rumah kedua kamu selama berbulan-bulan atau bahkan bertahun-tahun. Berikut adalah 7 tips penting yang harus kamu perhatikan.',
      sections: [
        {
          heading: '1. Cek Lokasi dan Lingkungan Sekitar',
          content: 'Pastikan lokasi kos berada di area yang aman dan strategis. Cek kondisi lingkungan sekitar, apakah ada penerangan jalan yang cukup di malam hari, akses transportasi umum, dan jarak ke kampus atau tempat kerja. Jangan ragu untuk berkeliling area tersebut pada siang dan malam hari untuk merasakan suasananya.'
        },
        {
          heading: '2. Perhatikan Sistem Keamanan',
          content: 'Kos yang baik harus memiliki sistem keamanan yang memadai. Cek apakah ada CCTV, satpam, sistem kunci ganda, atau akses kartu untuk masuk. Tanyakan juga kepada pemilik kos tentang prosedur keamanan jika ada tamu yang berkunjung.'
        },
        {
          heading: '3. Baca Review dari Penghuni Sebelumnya',
          content: 'Manfaatkan platform seperti SpotKos untuk membaca ulasan jujur dari penghuni sebelumnya. Perhatikan keluhan yang sering muncul dan bagaimana pemilik kos meresponsnya. Review dari orang lain bisa memberikan gambaran nyata yang tidak terlihat saat survey.'
        },
        {
          heading: '4. Cek Kondisi Fasilitas Kamar',
          content: 'Saat survey, periksa kondisi kamar secara detail. Cek kebersihan, ventilasi udara, pencahayaan, kondisi kasur dan lemari, serta ada tidaknya kerusakan. Pastikan juga ada jendela yang bisa dibuka untuk sirkulasi udara yang baik.'
        },
        {
          heading: '5. Tanyakan Aturan dan Kebijakan Kos',
          content: 'Setiap kos memiliki aturan yang berbeda. Tanyakan detail tentang jam malam, kebijakan tamu, aturan penggunaan listrik dan air, serta kebijakan pembatalan kontrak. Pastikan semua aturan tertulis jelas dalam kontrak sewa.'
        },
        {
          heading: '6. Perhatikan Kondisi Kamar Mandi',
          content: 'Kamar mandi adalah salah satu area penting yang sering diabaikan. Cek sistem pemanas air, kebersihan, saluran air, dan ada tidaknya bau tidak sedap. Jika kamar mandi dalam, pastikan ada ventilasi yang baik untuk mencegah lembab.'
        },
        {
          heading: '7. Pastikan Kualitas Koneksi Internet',
          content: 'Di era digital ini, koneksi internet yang stabil adalah kebutuhan penting. Test kecepatan WiFi di kamar yang akan kamu sewa. Tanyakan berapa banyak pengguna yang menggunakan jaringan yang sama dan apakah ada batasan kuota.'
        }
      ],
      conclusion: 'Dengan mengikuti 7 tips di atas, kamu bisa menemukan kos yang tidak hanya aman tetapi juga nyaman untuk ditinggali. Jangan terburu-buru dalam memutuskan, luangkan waktu untuk survey beberapa kos dan bandingkan. Ingat, kos yang baik adalah investasi untuk kenyamanan dan produktivitas kamu selama merantau. Selamat mencari kos impian!'
    }
  },
  {
    id: 'cara-hidup-hemat-anak-kos',
    title: 'Cara Hidup Hemat Sebagai Anak Kos',
    excerpt: 'Strategi jitu mengatur keuangan: budgeting, masak sendiri, berbagi biaya dengan teman, dan tips hemat listrik & air. Nabung tetap jalan!',
    image: 'https://images.unsplash.com/photo-1633158829556-6ea20ad39b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXZpbmclMjBtb25leSUyMGJ1ZGdldCUyMHN0dWRlbnR8ZW58MXx8fHwxNzczMDY5MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Keuangan',
    date: '2 Maret 2026',
    readTime: '6 menit',
    author: 'Tim SpotKos',
    content: {
      intro: 'Hidup sebagai anak kos memang penuh tantangan, terutama dalam mengatur keuangan. Dengan uang saku yang terbatas, kamu harus pintar-pintar mengatur pengeluaran agar kebutuhan terpenuhi dan masih bisa menabung. Berikut strategi jitu untuk hidup hemat tanpa mengurangi kualitas hidup kamu.',
      sections: [
        {
          heading: 'Buat Budget Bulanan yang Realistis',
          content: 'Langkah pertama adalah membuat perencanaan keuangan bulanan. Catat semua pemasukan dan keluarkan secara detail. Gunakan aplikasi keuangan atau spreadsheet sederhana. Alokasikan dana untuk kebutuhan pokok (makan, transportasi) sebesar 60%, keinginan 20%, dan tabungan 20%. Disiplin mengikuti budget ini adalah kunci kesuksesan finansial.'
        },
        {
          heading: 'Masak Sendiri untuk Menghemat Biaya Makan',
          content: 'Makan di luar setiap hari bisa menguras kantong. Cobalah memasak sendiri minimal untuk sarapan dan makan malam. Beli bahan makanan di pasar tradisional yang lebih murah. Masak dalam porsi besar dan simpan untuk beberapa hari. Dengan masak sendiri, kamu bisa menghemat hingga 50% biaya makan bulanan.'
        },
        {
          heading: 'Berbagi Biaya dengan Teman Kos',
          content: 'Manfaatkan sistem patungan dengan teman kos untuk berbagai keperluan. Beli langganan streaming atau aplikasi premium bersama-sama. Patungan untuk beli bahan makanan dalam jumlah besar agar dapat harga lebih murah. Sharing transportasi saat pergi ke kampus atau berbelanja juga bisa menghemat biaya.'
        },
        {
          heading: 'Hemat Penggunaan Listrik',
          content: 'Listrik adalah salah satu pengeluaran rutin yang bisa dikontrol. Matikan lampu dan elektronik saat tidak digunakan. Gunakan lampu LED yang lebih hemat energi. Atur suhu AC pada 24-25 derajat dan gunakan timer. Cabut charger setelah perangkat terisi penuh. Kebiasaan kecil ini bisa menghemat tagihan listrik hingga 30%.'
        },
        {
          heading: 'Bijak Menggunakan Air',
          content: 'Mandi dengan shower lebih hemat daripada menggunakan gayung. Batasi waktu mandi maksimal 10 menit. Matikan keran saat menyikat gigi atau menyabun. Perbaiki segera jika ada keran yang bocor. Penggunaan air yang bijak tidak hanya menghemat biaya tetapi juga ramah lingkungan.'
        },
        {
          heading: 'Manfaatkan Promo dan Diskon',
          content: 'Selalu cari promo sebelum berbelanja. Gunakan aplikasi e-wallet yang sering memberikan cashback. Ikuti akun media sosial merchant favorit untuk mendapatkan info promo terbaru. Beli kebutuhan bulanan saat ada promo big sale. Namun ingat, beli promo hanya untuk barang yang memang kamu butuhkan, bukan karena murah.'
        },
        {
          heading: 'Hindari Gaya Hidup Konsumtif',
          content: 'Bedakan antara kebutuhan dan keinginan. Tidak perlu mengikuti semua tren atau lifestyle teman. Belanja pakaian secukupnya, bukan setiap kali ada yang baru. Kurangi nongkrong di kafe mahal, lebih baik kumpul di kos sambil masak bareng. Ingat, hidup hemat bukan berarti pelit, tapi bijak mengatur prioritas.'
        }
      ],
      conclusion: 'Hidup hemat sebagai anak kos adalah tentang membuat pilihan cerdas setiap hari. Dengan menerapkan tips di atas secara konsisten, kamu tidak hanya bisa memenuhi kebutuhan sehari-hari tetapi juga memiliki tabungan untuk keperluan darurat atau rencana masa depan. Mulai dari sekarang, jadilah anak kos yang cerdas finansial!'
    }
  },
  {
    id: 'tempat-makan-murah-kampus',
    title: 'Rekomendasi Tempat Makan Murah Dekat Kampus',
    excerpt: 'Daftar kuliner terjangkau di sekitar kampus UI, UGM, ITB, dan Unair. Mulai dari warteg, angkringan, hingga kantin tersembunyi yang enak!',
    image: 'https://images.unsplash.com/photo-1762417420714-f15910736033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZmZvcmRhYmxlJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzczMDY5MDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Kuliner',
    date: '28 Februari 2026',
    readTime: '7 menit',
    author: 'Tim SpotKos',
    content: {
      intro: 'Sebagai mahasiswa, menemukan tempat makan yang enak tapi tetap ramah di kantong adalah kebahagiaan tersendiri. Dari hasil riset dan rekomendasi mahasiswa di berbagai kampus besar Indonesia, berikut daftar tempat makan murah yang wajib kamu coba!',
      sections: [
        {
          heading: 'Area Kampus UI Depok',
          content: 'Sekitar UI Depok, ada banyak pilihan tempat makan murah yang legendaris. Warteg Bahari di belakang FIB UI menyediakan nasi dengan 3 lauk hanya Rp15.000-20.000. Kantin Teknik yang terkenal dengan menu variatif dan harga bersahabat mulai Rp12.000. Jangan lewatkan juga Nasi Goreng Babeh Dolok di Kober Mie Setan yang legendaris, porsi jumbo hanya Rp18.000. Untuk cemilan, Martabak Mini Apeng dengan harga Rp5.000 per potong selalu ramai pembeli.'
        },
        {
          heading: 'Area Kampus UGM Yogyakarta',
          content: 'Yogyakarta surga kuliner murah! Di area UGM, kamu bisa makan kenyang di Angkringan Lik Man dengan budget Rp10.000-15.000 sudah dapat nasi kucing, sate, dan teh hangat. Gudeg Yu Djum yang terkenal dengan gudeg kering khas Jogja, satu porsi lengkap Rp20.000. Soto Kadipiro di Jl. Gejayan menawarkan soto ayam lezat dengan harga Rp15.000. Untuk gorengan dan kopi, Angkringan Tugu yang buka 24 jam adalah pilihan favorit anak UGM.'
        },
        {
          heading: 'Area Kampus ITB Bandung',
          content: 'Sekitar kampus ITB, Warung Nasi Ibu Imas di Jalan Tamansari terkenal dengan menu lengkap dan harga ekonomis Rp12.000-18.000. Batagor Kingsley yang legendaris di Bandung, porsi 10 biji cuma Rp20.000. Kantin Ganesha ITB menyediakan berbagai pilihan dengan harga mahasiswa-friendly mulai Rp10.000. Mie Kocok Mang Dadeng dengan kuah kaldu sapi yang gurih, satu mangkok Rp18.000 sudah bikin kenyang.'
        },
        {
          heading: 'Area Kampus Unair Surabaya',
          content: 'Mahasiswa Unair dimanjakan dengan kuliner khas Surabaya yang terjangkau. Rawon Setan di Jl. Embong Malang, meskipun ramai, harga tetap murah Rp15.000-20.000 per porsi. Nasi Pecel Bu Kaji di area Kampus C dengan lauk lengkap hanya Rp10.000. Sate Klopo Ondomohen yang unik dengan kelapa parut, 10 tusuk Rp25.000. Untuk takjil dan cemilan, Tahu Tek Genteng di Jl. Genteng Besar seharga Rp12.000 sangat recommended.'
        },
        {
          heading: 'Tips Berburu Kuliner Murah',
          content: 'Beberapa tips agar kamu bisa menikmati kuliner murah lebih hemat: Datang di jam tidak ramai untuk menghindari antrian panjang dan kadang dapat porsi lebih. Ikuti akun Instagram warung langganan untuk tahu promo atau menu spesial. Ajak teman untuk patungan pesan porsi besar yang biasanya lebih ekonomis. Bawa kotak makan sendiri jika ingin take away, beberapa tempat memberikan diskon. Manfaatkan aplikasi cashback untuk pembayaran digital.'
        },
        {
          heading: 'Kantin Kampus yang Underrated',
          content: 'Jangan remehkan kantin kampus! Banyak kantin kampus yang sebenarnya menyediakan makanan enak dan murah tapi kurang terekspos. Coba eksplorasi semua kantin di kampus kamu. Biasanya kantin di fakultas yang lebih sepi memiliki harga lebih murah dan pelayanan lebih cepat. Kantin teknik, kedokteran, atau fakultas lain sering punya menu signature mereka sendiri yang wajib dicoba.'
        },
        {
          heading: 'Aplikasi dan Promo Cashback',
          content: 'Manfaatkan aplikasi food delivery untuk mendapatkan promo. Meskipun ada ongkir, sering ada promo gratis ongkir atau diskon besar. GoPay, OVO, dan Dana sering bagi-bagi voucher makan. Gabung di komunitas telegram atau WhatsApp group info promo kuliner di kotamu. Kadang kamu bisa makan di tempat yang biasanya mahal dengan harga super murah berkat promo.'
        }
      ],
      conclusion: 'Dengan panduan di atas, kamu tidak perlu khawatir kehabisan budget untuk makan. Kuncinya adalah eksplorasi tempat baru, manfaatkan promo, dan jangan malu untuk bertanya rekomendasi ke senior atau teman. Selamat berburu kuliner murah dan enak di sekitar kampus!'
    }
  },
  {
    id: 'checklist-memilih-kos',
    title: 'Checklist Sebelum Memilih Kos: Jangan Sampai Salah!',
    excerpt: 'Hal penting yang wajib dicek: jarak ke kampus, fasilitas kamar, aturan kos, kondisi kamar mandi, ketersediaan parkir, dan koneksi internet.',
    image: 'https://images.unsplash.com/photo-1687511778945-160bbc17df96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVja2xpc3QlMjBwbGFubmluZyUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NzMwNjkwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Panduan',
    date: '25 Februari 2026',
    readTime: '8 menit',
    author: 'Tim SpotKos',
    content: {
      intro: 'Memilih kos bukan keputusan yang bisa dilakukan sembarangan. Banyak mahasiswa yang terburu-buru memilih kos dan akhirnya menyesal karena ternyata tidak sesuai ekspektasi. Agar tidak salah pilih, gunakan checklist lengkap ini saat kamu survey kos.',
      sections: [
        {
          heading: 'Lokasi dan Akses Transportasi',
          content: 'Cek jarak kos ke kampus atau tempat kerja, idealnya maksimal 30 menit perjalanan. Pastikan ada akses transportasi umum seperti angkot, bus, atau ojek online yang mudah. Perhatikan kondisi jalan, apakah sering macet atau banjir saat hujan. Cek juga ketersediaan minimarket, ATM, dan warung makan di sekitar kos. Area yang strategis akan menghemat waktu dan biaya transportasi kamu.'
        },
        {
          heading: 'Fasilitas Kamar yang Wajib Ada',
          content: 'Buat daftar fasilitas minimal yang kamu butuhkan: kasur dengan kualitas yang baik, lemari pakaian dengan ukuran cukup untuk semua barang, meja dan kursi belajar yang nyaman, lampu baca yang terang, stop kontak yang cukup (minimal 3-4), jendela untuk ventilasi dan cahaya alami. Cek kondisi cat dinding, lantai, dan langit-langit. Pastikan tidak ada kerusakan atau kebocoran yang bisa mengganggu kenyamanan.'
        },
        {
          heading: 'Aturan dan Kebijakan Kos',
          content: 'Tanyakan secara detail semua aturan kos: jam malam atau jam berkunjung tamu, kebijakan tamu menginap (khusus untuk pasangan atau saudara), aturan tentang memasak di kamar, kebijakan hewan peliharaan, aturan penggunaan area bersama, prosedur jika ingin pindah atau mengakhiri kontrak lebih awal. Pastikan semua aturan masuk akal dan bisa kamu ikuti. Baca kontrak dengan teliti sebelum menandatangani.'
        },
        {
          heading: 'Kondisi Kamar Mandi',
          content: 'Kamar mandi sering diabaikan padahal sangat penting. Cek apakah kamar mandi dalam atau luar, jika luar berapa orang yang berbagi. Pastikan ada water heater yang berfungsi, tekanan air yang cukup kuat, saluran pembuangan lancar tidak mampet, ada exhaust fan atau ventilasi yang baik, kebersihan dan tidak berbau. Flush closet harus berfungsi dengan baik. Coba nyalakan shower dan cek tekanan airnya.'
        },
        {
          heading: 'Ketersediaan Parkir',
          content: 'Jika kamu punya motor atau mobil, parkir adalah hal krusial. Cek apakah ada area parkir khusus yang aman dengan kapasitas cukup, ada atap atau tidak (penting untuk lindungi kendaraan dari hujan), ada penjaga atau CCTV untuk keamanan, apakah biaya parkir sudah termasuk atau tambahan. Jika parkir terbatas, tanyakan alternatif parkir di sekitar kos dan biayanya.'
        },
        {
          heading: 'Kualitas Koneksi Internet',
          content: 'Di era digital, internet stabil adalah kebutuhan vital. Test kecepatan WiFi menggunakan aplikasi speed test (minimal 10 Mbps untuk streaming dan meeting online), cek apakah sinyal kuat di semua sudut kamar, tanyakan berapa pengguna yang berbagi jaringan yang sama, apakah ada kuota atau unlimited, apakah ada downtime rutin atau sering bermasalah. Jika WiFi buruk, cek kualitas sinyal operator seluler untuk data backup.'
        },
        {
          heading: 'Sistem Keamanan',
          content: 'Keamanan adalah prioritas utama. Pastikan ada sistem keamanan yang memadai: CCTV di area-area strategis, satpam atau penjaga kos yang aktif 24 jam, kunci kamar yang aman (idealnya ada kunci ganda), akses masuk yang terkontrol (tidak sembarang orang bisa masuk), penerangan yang cukup di malam hari, jalur evakuasi dan alat pemadam kebakaran. Tanyakan histori keamanan kos tersebut kepada penghuni lama.'
        },
        {
          heading: 'Biaya dan Sistem Pembayaran',
          content: 'Klarifikasi semua biaya dengan detail: harga sewa bulanan atau tahunan, uang deposit (biasanya 1-2 bulan sewa), biaya listrik dan air (termasuk atau terpisah), biaya parkir, biaya tambahan lainnya (kebersihan, keamanan, maintenance). Tanyakan sistem pembayaran: tanggal jatuh tempo, metode pembayaran yang diterima, denda jika telat bayar, prosedur pengembalian deposit saat pindah. Pastikan semua biaya tertulis jelas di kontrak untuk menghindari masalah di kemudian hari.'
        }
      ],
      conclusion: 'Dengan menggunakan checklist lengkap ini, kamu bisa membuat keputusan yang tepat dalam memilih kos. Jangan terburu-buru, luangkan waktu untuk survey minimal 3-5 kos untuk perbandingan. Bawa teman atau keluarga saat survey untuk mendapat perspektif lain. Ingat, kos yang tepat akan menjadi rumah kedua yang nyaman dan mendukung aktivitas kamu. Selamat berburu kos!'
    }
  }
];
