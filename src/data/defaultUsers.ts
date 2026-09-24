import { UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_kepsek_01',
    username: 'kepsek',
    password: 'kepsek78',
    nama: 'Maikel Paul Wally, S.Pd',
    nip: '197812232003121006',
    jabatan: 'Kepala Sekolah (Penanggung Jawab BOSP)',
    pangkat: 'Pembina / IV a',
    role: 'KEPSEK',
    isActive: true,
    email: 'smpn7sentani@gmail.com',
    phone: '081234567890',
    lastLogin: '2026-08-26 15:30'
  },
  {
    id: 'user_bendahara_01',
    username: 'bendahara',
    password: 'bendaharaspenju',
    nama: 'Rahel Natalia Done,S.Pd.K',
    nip: '198812272024212036',
    jabatan: 'Bendahara BOSP',
    pangkat: 'Penata Muda / III a',
    role: 'BENDAHARA',
    isActive: true,
    email: 'raheldone@gmail.com',
    phone: '081398765432',
    lastLogin: '2026-08-26 14:15'
  }
];
