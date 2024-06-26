export const courierServices: Record<
  string,
  { service: string; description: string }[]
> = {
  jne: [
    { service: 'OKE', description: 'Ongkos Kirim Ekonomis' },
    { service: 'REG', description: 'Layanan Reguler' },
  ],
  tiki: [
    { service: 'ECO', description: 'Economy Service' },
    { service: 'REG', description: 'Regular Service' },
    { service: 'ONS', description: 'Over Night Service' },
  ],
  pos: [
    { service: 'Pos Reguler', description: 'Pos Reguler' },
    { service: 'POS Kargo', description: 'Pos Kargo' },
  ],
};

export const formattedCourierNames: Record<string, string> = {
  jne: 'JNE',
  tiki: 'TIKI',
  pos: 'POS',
};
