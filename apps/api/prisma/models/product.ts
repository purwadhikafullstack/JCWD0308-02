import { Status } from '@prisma/client';

export function listProducts(superAdminId: string, categoryId: string) {
  return [
    {
      title: 'Indomie Goreng',
      slug: 'indomie-goreng',
      description: 'Mie enak digoreng',
      price: 3000,
      packPrice: 50000,
      weight: 100,
      weightPack: 4000,
      discountPrice: 2500,
      discountPackPrice: 47000,
      packQuantity: 48,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Roti Tawar Sari Roti',
      slug: 'roti-tawar',
      description: 'Roti tawar yang lembut',
      price: 12000,
      packPrice: 60000,
      weight: 200,
      weightPack: 4000,
      discountPrice: 10000,
      discountPackPrice: 55000,
      packQuantity: 5,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Sereal Simba',
      slug: 'sereal-simba',
      description: 'Sereal simba sehat untuk sarapan',
      price: 15000,
      packPrice: 70000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 13000,
      discountPackPrice: 65000,
      packQuantity: 5,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Kopi Kapal Api',
      slug: 'kopi-kapal-api',
      description: 'Kopi hitam pekat',
      price: 2000,
      packPrice: 20000,
      weight: 20,
      weightPack: 200,
      discountPrice: 1800,
      discountPackPrice: 17000,
      packQuantity: 10,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Teh Hijau Tong Tji',
      slug: 'teh-hijau-tong-tji',
      description: 'Teh hijau organik',
      price: 5000,
      packPrice: 45000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 4500,
      discountPackPrice: 42000,
      packQuantity: 10,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Susu Kedelai Vsoy',
      slug: 'susu-kedelai-vsoy',
      description: 'Susu kedelai sehat',
      price: 7000,
      packPrice: 60000,
      weight: 500,
      weightPack: 1000,
      discountPrice: 6500,
      discountPackPrice: 58000,
      packQuantity: 10,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Bantal Clarissa',
      slug: 'bantal-clarissa',
      description: 'Bantal tidur yang nyaman',
      price: 40000,
      packPrice: 150000,
      weight: 500,
      weightPack: 3000,
      discountPrice: 38000,
      discountPackPrice: 140000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Sprei Kintakun',
      slug: 'sprei-kintakun',
      description: 'Sprei berkualitas tinggi',
      price: 100000,
      packPrice: 400000,
      weight: 1000,
      weightPack: 5000,
      discountPrice: 95000,
      discountPackPrice: 380000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Vitamin C Vitacimin',
      slug: 'vitamin-c-vitacimin',
      description: 'Vitamin C untuk daya tahan tubuh',
      price: 10000,
      packPrice: 200000,
      weight: 10,
      weightPack: 2000,
      discountPrice: 45000,
      discountPackPrice: 180000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Minyak Kayu Putih Cap Lang',
      slug: 'minyak-kayu-putih-cap-lang',
      description: 'Minyak kayu putih untuk kehangatan',
      price: 25000,
      packPrice: 100000,
      weight: 20,
      weightPack: 1000,
      discountPrice: 22000,
      discountPackPrice: 90000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Totole Kaldu Jamur',
      slug: 'totole-kaldu-jamur',
      description: 'Kaldu jamur berkualitas',
      price: 10000,
      packPrice: 40000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 9000,
      discountPackPrice: 36000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: "Jay's Kaldu Sapi",
      slug: 'jays-kaldu-sapi',
      description: 'Kaldu sapi pilihan',
      price: 12000,
      packPrice: 48000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 11000,
      discountPackPrice: 44000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: "Jay's Kaldu Ayam",
      slug: 'jays-kaldu-ayam',
      description: 'Kaldu ayam segar',
      price: 10000,
      packPrice: 40000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 9000,
      discountPackPrice: 36000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Spaghetti La Fonte',
      slug: 'spaghetti-la-fonte',
      description: 'Spaghetti al dente',
      price: 15000,
      packPrice: 60000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 13000,
      discountPackPrice: 52000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Pocari Sweat',
      slug: 'pocari-sweat',
      description: 'Minuman isotonic',
      price: 12000,
      packPrice: 48000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 10000,
      discountPackPrice: 40000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Le Minerale',
      slug: 'le-minerale',
      description: 'Air mineral murni',
      price: 8000,
      packPrice: 32000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 7000,
      discountPackPrice: 28000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Minyak Telon Konicare',
      slug: 'minyak-telon-konicare',
      description: 'Minyak telon untuk bayi',
      price: 20000,
      packPrice: 80000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 18000,
      discountPackPrice: 72000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Neurobion',
      slug: 'neurobion',
      description: 'Vitamin neurobion kompleks',
      price: 25000,
      packPrice: 100000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 22000,
      discountPackPrice: 90000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Tolak Angin',
      slug: 'tolak-angin',
      description: 'Obat tolak angin herbal',
      price: 15000,
      packPrice: 60000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 13000,
      discountPackPrice: 52000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Noroid',
      slug: 'noroid',
      description: 'Salep noroid untuk kulit',
      price: 18000,
      packPrice: 72000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 16000,
      discountPackPrice: 64000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Sangibion',
      slug: 'sangibion',
      description: 'Obat darah tinggi',
      price: 20000,
      packPrice: 80000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 18000,
      discountPackPrice: 72000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Mylanta',
      slug: 'mylanta',
      description: 'Obat maag',
      price: 12000,
      packPrice: 48000,
      weight: 20,
      weightPack: 500,
      discountPrice: 10000,
      discountPackPrice: 40000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Olatte Rasa Pir',
      slug: 'olatte-rasa-pir',
      description: 'Minuman ringan dengan rasa pir yang menyegarkan',
      price: 7000,
      packPrice: 28000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 6500,
      discountPackPrice: 26000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Nipis Madu',
      slug: 'nipis-madu',
      description: 'Minuman madu dengan rasa lezat',
      price: 10000,
      packPrice: 40000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 9000,
      discountPackPrice: 36000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Guling Clarissa',
      slug: 'guling-clarissa',
      description: 'Guling empuk untuk kenyamanan tidur',
      price: 250000,
      packPrice: 1000000,
      weight: 1000,
      weightPack: 5000,
      discountPrice: 220000,
      discountPackPrice: 900000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'SoKlin Pembersih Lantai Sereh & Geranium',
      slug: 'soklin-pembersih-lantai-sereh-geranium',
      description: 'Pembersih lantai dengan aroma segar sereh dan geranium',
      price: 15000,
      packPrice: 60000,
      weight: 500,
      weightPack: 3000,
      discountPrice: 13000,
      discountPackPrice: 52000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'SoKlin Pewangi Comfort Blue',
      slug: 'soklin-pewangi-comfort-blue',
      description: 'Pewangi pakaian dengan aroma nyaman',
      price: 12000,
      packPrice: 48000,
      weight: 500,
      weightPack: 3000,
      discountPrice: 10000,
      discountPackPrice: 40000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Ekonomi Pencuci Piring Power Liquid Siwak',
      slug: 'ekonomi-pencuci-piring-power-liquid-siwak',
      description: 'Pencuci piring cair dengan keharuman siwak',
      price: 8000,
      packPrice: 32000,
      weight: 500,
      weightPack: 3000,
      discountPrice: 7000,
      discountPackPrice: 28000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
    {
      title: 'Ekonomi Sabun Colek',
      slug: 'ekonomi-sabun-colek',
      description: 'Sabun cuci dengan formula lembut',
      price: 5000,
      packPrice: 20000,
      weight: 200,
      weightPack: 1000,
      discountPrice: 4500,
      discountPackPrice: 18000,
      packQuantity: 4,
      superAdminId,
      status: Status.PUBLISHED,
      categoryId,
    },
  ];
}
