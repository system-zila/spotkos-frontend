export interface Room {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  facilities: string[];
  gender: 'Putra' | 'Putri' | 'Campur';
  description: string;
  rules: string[];
  roomDetails: {
    size: string;
    capacity: string;
    bathroom: string;
    floor: string;
  };
  ownerInfo: {
    name: string;
    phone: string;
    responseTime: string;
  };
  address: string;
  nearbyPlaces: string[];
  availability: {
    totalRooms: number;
    availableRooms: number;
    floors: {
      name: string;
      totalRooms: number;
      availableRooms: number;
    }[];
  };
  paymentMethods: string[];
  reviews_list: {
    name: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Kost Melati Residence',
    location: 'Menteng, Jakarta Pusat',
    price: 2500000,
    rating: 4.9,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1703783010857-9bd7a7b97c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NzMwMDQ3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1703783010857-9bd7a7b97c50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NzMwMDQ3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTczMzgzNDUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar', 'Kursi', 'Parkir Motor', 'Dapur'],
    gender: 'Campur',
    description: 'Kost Melati Residence adalah hunian modern yang terletak di area strategis Menteng, Jakarta Pusat. Dengan desain interior yang nyaman dan fasilitas lengkap, kost ini cocok untuk mahasiswa dan profesional muda. Lokasi strategis dekat dengan pusat perbelanjaan, kampus, dan akses transportasi umum.',
    rules: [
      'Tidak diperbolehkan membawa hewan peliharaan',
      'Jam bertamu maksimal pukul 21.00 WIB',
      'Tamu menginap tidak diperbolehkan',
      'Dilarang keras merokok di dalam kamar',
      'Menjaga kebersihan dan ketenangan bersama',
      'Listrik dan air sudah termasuk dalam harga sewa'
    ],
    roomDetails: {
      size: '3 x 4 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 2-4'
    },
    ownerInfo: {
      name: 'Ibu Melati',
      phone: '0812-3456-7890',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Menteng Raya No. 45, Menteng, Jakarta Pusat, DKI Jakarta 10340',
    nearbyPlaces: [
      'Universitas Indonesia - 2.5 km',
      'Plaza Indonesia - 1.8 km',
      'Stasiun MRT Bundaran HI - 1.2 km',
      'Sarinah - 1.5 km',
      'Halte TransJakarta Menteng - 300 m'
    ],
    availability: {
      totalRooms: 20,
      availableRooms: 15,
      floors: [
        {
          name: 'Lantai 2',
          totalRooms: 10,
          availableRooms: 8
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 4',
          totalRooms: 5,
          availableRooms: 4
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Rina Pratiwi',
        rating: 5,
        date: '2 Maret 2026',
        comment: 'Kost sangat nyaman dan bersih! Pemilik kost juga ramah dan responsif. Lokasinya strategis dekat dengan kampus dan pusat kota. Recommended!'
      },
      {
        name: 'Budi Santoso',
        rating: 5,
        date: '28 Februari 2026',
        comment: 'Fasilitas lengkap, WiFi kenceng, AC dingin. Cocok untuk yang butuh tempat nyaman untuk kerja dan istirahat.'
      },
      {
        name: 'Siti Nurhaliza',
        rating: 4,
        date: '25 Februari 2026',
        comment: 'Overall bagus, cuma parkir motor kadang penuh kalau weekend. Tapi untuk fasilitasnya worth it dengan harganya.'
      }
    ]
  },
  {
    id: 2,
    name: 'Kost Permata Hijau',
    location: 'Dago, Bandung',
    price: 1800000,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc3MzA2MzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc3MzA2MzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTczMzgzNDUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kasur', 'Lemari', 'Kamar Mandi Luar', 'Listrik Pasca Bayar'],
    gender: 'Putri',
    description: 'Kost khusus putri dengan suasana yang aman dan nyaman di area Dago yang sejuk. Lingkungan tenang cocok untuk belajar dan beristirahat.',
    rules: [
      'Khusus untuk penghuni putri',
      'Jam bertamu maksimal pukul 20.00 WIB',
      'Tamu laki-laki hanya di ruang tamu',
      'Dilarang membawa hewan peliharaan',
      'Menjaga kebersihan kamar dan area bersama'
    ],
    roomDetails: {
      size: '3 x 3 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi luar (bersama)',
      floor: 'Lantai 1-3'
    },
    ownerInfo: {
      name: 'Ibu Permata',
      phone: '0813-2345-6789',
      responseTime: 'Cepat (< 2 jam)'
    },
    address: 'Jl. Dago Atas No. 88, Dago, Bandung, Jawa Barat 40135',
    nearbyPlaces: [
      'ITB - 3 km',
      'Unpad - 4 km',
      'Dago Pakar - 2 km',
      'Rumah Mode Factory Outlet - 1.5 km'
    ],
    availability: {
      totalRooms: 15,
      availableRooms: 10,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Putri Ayu',
        rating: 5,
        date: '5 Maret 2026',
        comment: 'Kost yang sangat nyaman dan aman untuk putri. Pemilik kost sangat perhatian dan ramah.'
      },
      {
        name: 'Dewi Lestari',
        rating: 4,
        date: '1 Maret 2026',
        comment: 'Lokasi strategis, suasana sejuk khas Bandung. Recommended untuk mahasiswi!'
      }
    ]
  },
  {
    id: 3,
    name: 'Kost Mutiara Mas',
    location: 'Tembalang, Semarang',
    price: 1200000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMDYzMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMDYzMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['Wi-Fi', 'Kasur', 'Lemari', 'Meja Belajar', 'Kamar Mandi Luar', 'Dapur', 'Listrik Pasca Bayar'],
    gender: 'Putra',
    description: 'Kost khusus putra yang berlokasi strategis dekat kampus Undip. Harga terjangkau dengan fasilitas memadai untuk mahasiswa.',
    rules: [
      'Khusus untuk penghuni putra',
      'Jam malam pukul 22.00 WIB',
      'Dilarang membuat keributan',
      'Menjaga kebersihan bersama',
      'Listrik token ditanggung penghuni'
    ],
    roomDetails: {
      size: '3 x 3.5 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi luar (bersama)',
      floor: 'Lantai 1-2'
    },
    ownerInfo: {
      name: 'Pak Mutiara',
      phone: '0856-7890-1234',
      responseTime: 'Normal (2-4 jam)'
    },
    address: 'Jl. Mutiara Raya No. 12, Tembalang, Semarang, Jawa Tengah 50275',
    nearbyPlaces: [
      'Universitas Diponegoro - 1 km',
      'Halte Trans Semarang - 500 m',
      'Pasar Tembalang - 800 m',
      'Alfamart - 200 m'
    ],
    availability: {
      totalRooms: 10,
      availableRooms: 5,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 2
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Ahmad Rizki',
        rating: 5,
        date: '7 Maret 2026',
        comment: 'Harga sangat terjangkau untuk mahasiswa. Dekat kampus jadi hemat ongkos transport!'
      },
      {
        name: 'Faisal Rahman',
        rating: 4,
        date: '3 Maret 2026',
        comment: 'Kamarnya lumayan luas dan bersih. WiFi stabil untuk kuliah online.'
      }
    ]
  },
  {
    id: 4,
    name: 'Kost Indah Permai',
    location: 'Gubeng, Surabaya',
    price: 1500000,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1627074899165-89603d93e12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBiZWRyb29tJTIwd2luZG93fGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1627074899165-89603d93e12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBiZWRyb29tJTIwd2luZG93fGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    gender: 'Putri',
    description: 'Kost khusus putri di lokasi strategis Gubeng, dekat dengan berbagai kampus dan pusat kota Surabaya.',
    rules: [
      'Khusus untuk penghuni putri',
      'Jam bertamu maksimal pukul 21.00 WIB',
      'Dilarang membawa hewan peliharaan',
      'Listrik dan air sudah termasuk'
    ],
    roomDetails: {
      size: '3.5 x 4 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 1-3'
    },
    ownerInfo: {
      name: 'Ibu Indah',
      phone: '0822-3456-7890',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Gubeng Kertajaya No. 55, Gubeng, Surabaya, Jawa Timur 60282',
    nearbyPlaces: [
      'Universitas Airlangga - 2 km',
      'ITS - 5 km',
      'Tunjungan Plaza - 3 km',
      'Stasiun Gubeng - 1.5 km'
    ],
    availability: {
      totalRooms: 12,
      availableRooms: 8,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 4,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 4,
          availableRooms: 2
        },
        {
          name: 'Lantai 3',
          totalRooms: 4,
          availableRooms: 3
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Maya Sari',
        rating: 5,
        date: '8 Maret 2026',
        comment: 'Kost yang sangat nyaman dan aman. Kamar mandi dalam sangat membantu!'
      }
    ]
  },
  {
    id: 5,
    name: 'Kost Asri Residence',
    location: 'Seturan, Yogyakarta',
    price: 1300000,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1614715661635-abb0547c125c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb3JtaXRvcnklMjByb29tfGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1614715661635-abb0547c125c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb3JtaXRvcnklMjByb29tfGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kasur', 'Lemari', 'Parkir Motor'],
    gender: 'Campur',
    description: 'Kost modern di area Seturan yang ramai dengan berbagai fasilitas umum. Cocok untuk mahasiswa dan pekerja muda.',
    rules: [
      'Jam bertamu maksimal pukul 21.00 WIB',
      'Dilarang membuat keributan',
      'Menjaga kebersihan bersama',
      'Listrik sudah termasuk'
    ],
    roomDetails: {
      size: '3 x 3.5 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi luar (bersama)',
      floor: 'Lantai 1-3'
    },
    ownerInfo: {
      name: 'Ibu Asri',
      phone: '0877-6543-2109',
      responseTime: 'Cepat (< 2 jam)'
    },
    address: 'Jl. Seturan Raya No. 78, Seturan, Yogyakarta, DIY 55281',
    nearbyPlaces: [
      'UGM - 3 km',
      'UPN - 2 km',
      'Hartono Mall - 1 km',
      'Alfamart - 100 m'
    ],
    availability: {
      totalRooms: 15,
      availableRooms: 10,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Budi Hartono',
        rating: 5,
        date: '9 Maret 2026',
        comment: 'Lokasi strategis banget, dekat kemana-mana. WiFi kenceng, cocok buat kerja remote!'
      }
    ]
  },
  {
    id: 6,
    name: 'Kost Mawar Sari',
    location: 'Kebayoran, Jakarta Selatan',
    price: 2200000,
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1759176171634-674f37841636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21mb3J0YWJsZSUyMGJlZHJvb20lMjBkZXNpZ258ZW58MXx8fHwxNzczMDYzMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1759176171634-674f37841636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21mb3J0YWJsZSUyMGJlZHJvb20lMjBkZXNpZ258ZW58MXx8fHwxNzczMDYzMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Parkir Motor'],
    gender: 'Putri',
    description: 'Kost khusus putri dengan fasilitas premium di area elite Kebayoran. Lingkungan aman dan nyaman.',
    rules: [
      'Khusus untuk penghuni putri',
      'Jam bertamu maksimal pukul 20.00 WIB',
      'Dilarang membawa hewan peliharaan',
      'Listrik dan air sudah termasuk'
    ],
    roomDetails: {
      size: '4 x 4 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 2-4'
    },
    ownerInfo: {
      name: 'Ibu Mawar',
      phone: '0821-9876-5432',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Kebayoran Baru No. 99, Kebayoran, Jakarta Selatan, DKI Jakarta 12180',
    nearbyPlaces: [
      'Blok M - 2 km',
      'MRT Blok M - 2.5 km',
      'Senayan City - 3 km',
      'Pasar Santa - 1.5 km'
    ],
    availability: {
      totalRooms: 10,
      availableRooms: 5,
      floors: [
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 2
        },
        {
          name: 'Lantai 4',
          totalRooms: 5,
          availableRooms: 0
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Dita Anggraini',
        rating: 5,
        date: '10 Maret 2026',
        comment: 'Kost yang sangat bagus! Kamar luas, fasilitas lengkap. Worth it dengan harganya.'
      }
    ]
  },
  {
    id: 7,
    name: 'Kost Bali Sunrise',
    location: 'Denpasar, Bali',
    price: 1600000,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMG1vZGVybiUyMGJlZHJvb20lMjBCYWxpJTIwdHJvcGljYWx8ZW58MXx8fHwxNzczMTUzNDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMG1vZGVybiUyMGJlZHJvb20lMjBCYWxpJTIwdHJvcGljYWx8ZW58MXx8fHwxNzczMTUzNDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Parkir Motor'],
    gender: 'Campur',
    description: 'Kost nyaman di pusat kota Denpasar dengan nuansa tropis khas Bali. Cocok untuk pekerja dan mahasiswa yang kuliah di Universitas Udayana. Lokasi strategis dekat pantai dan pusat kuliner.',
    rules: [
      'Jam bertamu maksimal pukul 22.00 WITA',
      'Dilarang membuat keributan setelah jam 23.00',
      'Menjaga kebersihan area bersama',
      'Parkir motor di tempat yang disediakan',
      'Listrik dan air sudah termasuk dalam harga sewa'
    ],
    roomDetails: {
      size: '3.5 x 4 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 1-2'
    },
    ownerInfo: {
      name: 'Pak Wayan',
      phone: '0819-8765-4321',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Teuku Umar No. 32, Denpasar, Bali 80114',
    nearbyPlaces: [
      'Universitas Udayana - 3 km',
      'Pantai Sanur - 5 km',
      'Mall Bali Galeria - 2 km',
      'RS Sanglah - 1.5 km',
      'Terminal Ubung - 4 km'
    ],
    availability: {
      totalRooms: 15,
      availableRooms: 10,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Kadek Arya',
        rating: 5,
        date: '6 Maret 2026',
        comment: 'Kost yang sangat nyaman dengan suasana Bali yang kental. AC dingin, WiFi kenceng, pemilik kost juga sangat ramah!'
      },
      {
        name: 'Putu Ratna',
        rating: 5,
        date: '2 Maret 2026',
        comment: 'Lokasinya strategis dekat kampus dan pantai. Kamar bersih dan luas. Sangat recommended!'
      },
      {
        name: 'Made Surya',
        rating: 4,
        date: '25 Februari 2026',
        comment: 'Overall bagus, harga terjangkau untuk fasilitas yang didapat. Parkir motor aman.'
      }
    ]
  },
  {
    id: 8,
    name: 'Kost Losari Residence',
    location: 'Panakkukang, Makassar',
    price: 1100000,
    rating: 4.6,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBiZWRyb29tJTIwYXBhcnRtZW50JTIwdXJiYW58ZW58MXx8fHwxNzczMTUzNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBiZWRyb29tJTIwYXBhcnRtZW50JTIwdXJiYW58ZW58MXx8fHwxNzczMTUzNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTczMzgzNDUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['Wi-Fi', 'Kasur', 'Lemari', 'Meja Belajar', 'Kamar Mandi Luar', 'Listrik Pasca Bayar'],
    gender: 'Putra',
    description: 'Kost khusus putra dengan harga sangat terjangkau di area Panakkukang, Makassar. Dekat dengan kampus Unhas dan pusat perbelanjaan. Lingkungan aman dan tenang.',
    rules: [
      'Khusus untuk penghuni putra',
      'Jam malam pukul 23.00 WITA',
      'Dilarang membawa hewan peliharaan',
      'Menjaga ketenangan dan kebersihan',
      'Listrik token ditanggung penghuni'
    ],
    roomDetails: {
      size: '3 x 3 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi luar (bersama)',
      floor: 'Lantai 1-2'
    },
    ownerInfo: {
      name: 'Pak Daeng',
      phone: '0852-4321-8765',
      responseTime: 'Normal (2-4 jam)'
    },
    address: 'Jl. Pettarani No. 67, Panakkukang, Makassar, Sulawesi Selatan 90231',
    nearbyPlaces: [
      'Universitas Hasanuddin - 4 km',
      'Mall Panakkukang - 1.5 km',
      'Pantai Losari - 5 km',
      'RS Wahidin - 3 km',
      'Indomaret - 100 m'
    ],
    availability: {
      totalRooms: 10,
      availableRooms: 5,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 2
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Andi Faisal',
        rating: 5,
        date: '8 Maret 2026',
        comment: 'Harga sangat murah untuk Makassar! Dekat kampus Unhas, WiFi stabil. Cocok untuk anak kost yang budget-nya terbatas.'
      },
      {
        name: 'Rizal Amri',
        rating: 4,
        date: '4 Maret 2026',
        comment: 'Kamarnya bersih dan rapi. Pemilik kost baik. Cuma kamar mandi bersama tapi masih oke lah.'
      }
    ]
  },
  {
    id: 9,
    name: 'Kost Thamrin Exclusive',
    location: 'Thamrin, Medan',
    price: 1400000,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc3R1ZGVudCUyMHJvb20lMjB3b29kZW4lMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzczMTUzNDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc3R1ZGVudCUyMHJvb20lMjB3b29kZW4lMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzczMTUzNDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar', 'Kursi', 'Dapur'],
    gender: 'Putri',
    description: 'Kost khusus putri dengan fasilitas lengkap di kawasan Thamrin, Medan. Lingkungan elite, aman, dan nyaman. Dekat dengan berbagai kampus ternama dan pusat kota.',
    rules: [
      'Khusus untuk penghuni putri',
      'Jam bertamu maksimal pukul 21.00 WIB',
      'Tamu laki-laki hanya di ruang tamu',
      'Dilarang membawa hewan peliharaan',
      'Listrik dan air sudah termasuk dalam harga sewa'
    ],
    roomDetails: {
      size: '3.5 x 3.5 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 1-3'
    },
    ownerInfo: {
      name: 'Ibu Thamrin',
      phone: '0813-6789-0123',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Thamrin No. 28, Medan, Sumatera Utara 20231',
    nearbyPlaces: [
      'Universitas Sumatera Utara - 2.5 km',
      'Sun Plaza - 1.5 km',
      'RS Columbia Asia - 2 km',
      'Merdeka Walk - 3 km',
      'Stasiun Medan - 4 km'
    ],
    availability: {
      totalRooms: 15,
      availableRooms: 10,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Sarah Lubis',
        rating: 5,
        date: '9 Maret 2026',
        comment: 'Kost yang sangat nyaman dan aman untuk putri. Fasilitas lengkap, kamar mandi dalam bersih. Pemilik kost sangat ramah!'
      },
      {
        name: 'Fitri Hasibuan',
        rating: 5,
        date: '5 Maret 2026',
        comment: 'Lokasi strategis dekat USU. WiFi kenceng dan AC dingin. Worth it dengan harganya!'
      },
      {
        name: 'Dina Siregar',
        rating: 4,
        date: '1 Maret 2026',
        comment: 'Kamar luas dan bersih. Satu-satunya kekurangan cuma parkirnya agak terbatas. Tapi overall sangat bagus.'
      }
    ]
  },
  {
    id: 10,
    name: 'Kost Brawijaya Inn',
    location: 'Lowokwaru, Malang',
    price: 1000000,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1671965448417-0582cb361168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhbmclMjBjaXR5JTIwSW5kb25lc2lhJTIwbW91bnRhaW58ZW58MXx8fHwxNzc2MTYzMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1671965448417-0582cb361168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhbmclMjBjaXR5JTIwSW5kb25lc2lhJTIwbW91bnRhaW58ZW58MXx8fHwxNzc2MTYzMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzMzODM0NTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['Wi-Fi', 'Kasur', 'Lemari', 'Meja Belajar', 'Parkir Motor', 'Dapur', 'Listrik Pasca Bayar'],
    gender: 'Putra',
    description: 'Kost putra yang sangat terjangkau di area kampus Universitas Brawijaya. Suasana sejuk khas Malang dan lingkungan mahasiswa yang kondusif untuk belajar.',
    rules: [
      'Khusus penghuni putra',
      'Jam malam pukul 22.00 WIB',
      'Dilarang merokok di dalam kamar',
      'Listrik token ditanggung penghuni',
      'Menjaga kebersihan bersama'
    ],
    roomDetails: {
      size: '3 x 3 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi luar (bersama)',
      floor: 'Lantai 1-2'
    },
    ownerInfo: {
      name: 'Pak Budi',
      phone: '0857-3210-6543',
      responseTime: 'Normal (2-4 jam)'
    },
    address: 'Jl. Soekarno-Hatta No. 15, Lowokwaru, Malang, Jawa Timur 65142',
    nearbyPlaces: [
      'Universitas Brawijaya - 1 km',
      'Mall Olympic Garden - 3 km',
      'Stasiun Malang - 5 km',
      'Indomaret - 100 m'
    ],
    availability: {
      totalRooms: 10,
      availableRooms: 5,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 2
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Rizky Pratama',
        rating: 5,
        date: '11 Maret 2026',
        comment: 'Murah banget dan dekat kampus UB. Suasana Malang yang adem bikin betah!'
      },
      {
        name: 'Andi Wijaya',
        rating: 4,
        date: '7 Maret 2026',
        comment: 'WiFi lumayan stabil, kamar bersih. Cocok buat anak UB yang budget-nya terbatas.'
      }
    ]
  },
  {
    id: 11,
    name: 'Kost Citra Malang',
    location: 'Klojen, Malang',
    price: 1250000,
    rating: 4.8,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1614715661635-abb0547c125c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb3JtaXRvcnklMjByb29tfGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1614715661635-abb0547c125c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb3JtaXRvcnklMjByb29tfGVufDF8fHx8MTc3MzA2MzE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3MzM4MzQ1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Parkir Motor'],
    gender: 'Putri',
    description: 'Kost putri premium di pusat kota Malang. Dekat dengan alun-alun dan pusat kuliner. Fasilitas lengkap dan keamanan 24 jam.',
    rules: [
      'Khusus penghuni putri',
      'Jam bertamu maksimal pukul 20.00 WIB',
      'Tamu laki-laki hanya di ruang tamu',
      'Dilarang membawa hewan peliharaan',
      'Listrik dan air termasuk sewa'
    ],
    roomDetails: {
      size: '3.5 x 3.5 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 1-3'
    },
    ownerInfo: {
      name: 'Ibu Citra',
      phone: '0878-5432-1098',
      responseTime: 'Cepat (< 1 jam)'
    },
    address: 'Jl. Ijen No. 45, Klojen, Malang, Jawa Timur 65119',
    nearbyPlaces: [
      'Alun-alun Malang - 1.5 km',
      'Universitas Negeri Malang - 2 km',
      'Mall Malang Town Square - 1 km',
      'RS Saiful Anwar - 2.5 km'
    ],
    availability: {
      totalRooms: 15,
      availableRooms: 10,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard'],
    reviews_list: [
      {
        name: 'Nadia Putri',
        rating: 5,
        date: '10 Maret 2026',
        comment: 'Kost putri terbaik di Malang! Kamar mandi dalam bersih, AC dingin, dan lokasi strategis di pusat kota.'
      },
      {
        name: 'Lia Kusuma',
        rating: 5,
        date: '6 Maret 2026',
        comment: 'Sangat aman dan nyaman. Pemilik kost perhatian. Recommended!'
      }
    ]
  },
  {
    id: 12,
    name: 'Kost Panorama Bandung',
    location: 'Coblong, Bandung',
    price: 1600000,
    rating: 4.6,
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc3MzA2MzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc3MzA2MzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTczMzgzNDUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    facilities: ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar', 'Laundry'],
    gender: 'Campur',
    description: 'Kost modern di area Coblong dekat kampus ITB. Suasana sejuk Bandung dan fasilitas lengkap untuk mahasiswa dan profesional muda.',
    rules: [
      'Jam bertamu maksimal pukul 21.00 WIB',
      'Dilarang membuat keributan setelah jam 22.00',
      'Menjaga kebersihan area bersama',
      'Listrik dan air sudah termasuk'
    ],
    roomDetails: {
      size: '3 x 4 meter',
      capacity: '1 orang',
      bathroom: 'Kamar mandi dalam',
      floor: 'Lantai 1-4'
    },
    ownerInfo: {
      name: 'Pak Panorama',
      phone: '0812-9876-5432',
      responseTime: 'Cepat (< 2 jam)'
    },
    address: 'Jl. Ganesha No. 20, Coblong, Bandung, Jawa Barat 40132',
    nearbyPlaces: [
      'ITB - 500 m',
      'Unpad - 4 km',
      'Paris Van Java Mall - 2 km',
      'Rumah Mode - 1.5 km'
    ],
    availability: {
      totalRooms: 20,
      availableRooms: 15,
      floors: [
        {
          name: 'Lantai 1',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 2',
          totalRooms: 5,
          availableRooms: 4
        },
        {
          name: 'Lantai 3',
          totalRooms: 5,
          availableRooms: 3
        },
        {
          name: 'Lantai 4',
          totalRooms: 5,
          availableRooms: 5
        }
      ]
    },
    paymentMethods: ['Visa', 'Mastercard', 'JCB'],
    reviews_list: [
      {
        name: 'Dimas Nugroho',
        rating: 5,
        date: '12 Maret 2026',
        comment: 'Super dekat ITB, tinggal jalan kaki. Kamar nyaman dan WiFi kenceng!'
      },
      {
        name: 'Anisa Rahma',
        rating: 4,
        date: '8 Maret 2026',
        comment: 'Suasana Bandung yang sejuk plus fasilitas lengkap. Recommended!'
      }
    ]
  }
];