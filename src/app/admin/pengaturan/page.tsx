'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    workshopName: 'MELTUNE AUTO Service & Parts',
    address: 'Kawasan Otomotif BSD Blok B3 No. 12, Pagedangan, Tangerang Selatan, Banten 15310',
    phone: '+62 21 5590 8820',
    whatsapp: '+62 811 9876 543',
    operatingHours: 'Senin - Sabtu: 08:30 - 17:30 WIB (Minggu Libur)',
    maxCapacityPerSlot: 2,
    totalBays: 4,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getSettings().then(data => {
      if (data) {
        setSettings({
          workshopName: data.workshopName || 'MELTUNE AUTO Service & Parts',
          address: data.address || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          operatingHours: data.operatingHours || 'Senin - Sabtu: 08:30 - 17:30 WIB (Minggu Libur)',
          maxCapacityPerSlot: data.maxBookingsPerSlot || 2,
          totalBays: 4,
        });
      }
    }).catch(err => {
      setErrorMsg(err.message || 'Gagal memuat pengaturan workshop');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.admin.updateSettings({
        workshopName: settings.workshopName,
        address: settings.address,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        operatingHours: settings.operatingHours,
        maxBookingsPerSlot: settings.maxCapacityPerSlot,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Pengaturan Workshop & Konfigurasi Sistem
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Informasi alamat operasional fisik, jam buka, dan pembatasan kapasitas lift workbay.
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Pengaturan workshop berhasil diperbarui dan tersimpan di database.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#242522] mb-1">Nama Resmi Workshop</label>
            <input
              type="text"
              required
              value={settings.workshopName}
              onChange={e => setSettings({ ...settings, workshopName: e.target.value })}
              className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#242522] mb-1">Alamat Fisik Workshop</label>
            <textarea
              rows={2}
              required
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#242522] mb-1">Telepon Workshop</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#242522] mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#242522] mb-1">Jam Buka Layanan</label>
            <input
              type="text"
              required
              value={settings.operatingHours}
              onChange={e => setSettings({ ...settings, operatingHours: e.target.value })}
              className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E4E1D9]">
            <div>
              <label className="block font-semibold text-[#242522] mb-1">
                Kapasitas Mobil Maksimal Per Slot Waktu
              </label>
              <input
                type="number"
                min={1}
                max={4}
                required
                value={settings.maxCapacityPerSlot}
                onChange={e => setSettings({ ...settings, maxCapacityPerSlot: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A]"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                Mencegah overbooking pada slot waktu yang sama.
              </span>
            </div>
            <div>
              <label className="block font-semibold text-[#242522] mb-1">Jumlah Workbay Fisik</label>
              <input
                type="number"
                disabled
                value={settings.totalBays}
                className="w-full px-3 py-2 bg-[#ECEAE4] border border-[#E4E1D9] rounded text-[#777871] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#777871] mt-0.5 block">
                4 lift & pit hidrolik aktif.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4E1D9]">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D96B3A] hover:bg-[#BF582D] text-white font-semibold px-6 py-2.5 rounded transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Pengaturan Workshop'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
