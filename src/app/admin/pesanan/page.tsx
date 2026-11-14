'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import { Order } from '@/types';
import { ShoppingBag, CheckCircle2, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.orders.getAll().then(setOrders);
  }, []);

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

        <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
              <tr>
                <th className="p-3">Nomor Pesanan</th>
                <th className="p-3">Pelanggan</th>
                <th className="p-3">Item Suku Cadang</th>
                <th className="p-3">Metode Pengiriman</th>
                <th className="p-3">Total Nilai</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9]">
              {orders.map(o => (
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
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
