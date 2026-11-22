'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Order } from '@/types';
import { ShoppingBag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ORDER_STATUSES: Order['status'][] = [
  'pending',
  'processing',
  'ready_for_pickup',
  'shipped',
  'completed',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadOrders = () => {
    setLoading(true);
    api.orders.getAll()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    setErrorMsg(null);
    try {
      await api.orders.updateStatus(id, newStatus);
      setSuccessMsg(`Status pesanan berhasil diubah menjadi ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setSuccessMsg(null), 3500);
      loadOrders();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui status pesanan');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Manajemen Pesanan Store & Suku Cadang
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Monitoring pesanan retail pelanggan, penyiapan paket di workshop, dan pengiriman kurir.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Nomor Pesanan</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Item Suku Cadang</th>
                <th className="p-3">Metode Pengiriman</th>
                <th className="p-3">Total Nilai</th>
                <th className="p-3">Status Saat Ini</th>
                <th className="p-3 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#777871]">
                    Memuat pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#777871]">
                    Belum ada pesanan suku cadang.
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-[#F5F4F0]">
                    <td className="p-3 font-mono font-bold text-[#242522]">{o.orderNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#242522]">{o.userName}</div>
                      <div className="text-[11px] text-[#777871]">{o.userPhone}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-[#242522]">
                        {o.items.map(i => `${i.productName} (${i.quantity}x)`).join(', ')}
                      </div>
                    </td>
                    <td className="p-3 capitalize text-[#777871]">
                      {o.shippingMethod.replace('_', ' ')}
                    </td>
                    <td className="p-3 font-bold font-heading text-[#242522]">
                      Rp {o.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'ready_for_pickup' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-neutral-100 text-[#777871]'
                      }`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value as Order['status'])}
                        className="px-2 py-1 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[11px] font-medium text-[#242522] focus:outline-none focus:border-[#D96B3A]"
                      >
                        {ORDER_STATUSES.map(st => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
