'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/services';
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  Users,
  ShoppingBag,
  Award,
  ArrowUpRight,
} from 'lucide-react';

const initialStats = {
  dailyRevenue: 0,
  monthlyRevenue: 0,
  yearlyRevenue: 0,
  totalBookings: 0,
  completedBookings: 0,
  pendingBookings: 0,
  cancelledBookings: 0,
  totalCustomers: 0,
  totalMechanics: 0,
  productSales: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [popularServices, setPopularServices] = useState<Array<{ name: string; bookings: number; share: number; revenue: number }>>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<Array<{ month: string; total: number; service: number; parts: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getAdminAnalytics().then(data => {
      if (data?.overview) {
        setStats({
          dailyRevenue: data.overview.dailyRevenue || 0,
          monthlyRevenue: data.overview.monthlyRevenue || 0,
          yearlyRevenue: data.overview.yearlyRevenue || 0,
          totalBookings: data.overview.totalBookings || 0,
          completedBookings: data.overview.completedBookings || 0,
          pendingBookings: data.overview.pendingBookings || 0,
          cancelledBookings: data.overview.cancelledBookings || 0,
          totalCustomers: data.overview.totalCustomers || 0,
          totalMechanics: data.overview.totalMechanics || 0,
          productSales: data.overview.productSalesCount || 0,
        });
      }
      if (data?.popularServices) {
        setPopularServices(
          data.popularServices.map((s: any) => ({
            name: s.name,
            bookings: s.bookingsCount || 0,
            share: s.sharePercent || 0,
            revenue: s.revenue || 0,
          }))
        );
      }
      if (data?.revenueTrends) {
        setMonthlyTrends(
          data.revenueTrends.map((t: any) => ({
            month: t.month,
            total: (t.serviceRevenue || 0) + (t.partsRevenue || 0),
            service: t.serviceRevenue || 0,
            parts: t.partsRevenue || 0,
          }))
        );
      }
    }).catch(() => {
      // In case of network error, retains clean empty state
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D96B3A]">
            Eksekutif Workshop MELTUNE AUTO BSD
          </span>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading mt-1">
            Analitik Performa & Finansial Bisnis
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Pendapatan jasa bengkel, penjualan suku cadang, okupansi workbay, dan loyalitas pelanggan.
          </p>
        </div>

        {/* Revenue KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <span className="text-xs text-[#777871]">Pendapatan Hari Ini</span>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#242522] font-heading">
                Rp {stats.dailyRevenue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-0.5 mt-0.5 font-medium">
                <ArrowUpRight size={13} />
                <span>+12% vs rata-rata harian</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <span className="text-xs text-[#777871]">Pendapatan Bulan Ini</span>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#D96B3A] font-heading">
                Rp {stats.monthlyRevenue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-[#777871] mt-0.5">Target: Rp 40.000.000 (87%)</div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <span className="text-xs text-[#777871]">Total Reservasi Selesai</span>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#242522] font-heading">
                {stats.completedBookings} / {stats.totalBookings}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                {stats.totalBookings > 0
                  ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}% tingkat penyelesaian`
                  : '0% tingkat penyelesaian'}
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded border border-[#E4E1D9] flex flex-col justify-between">
            <span className="text-xs text-[#777871]">Pelanggan & Mekanik Aktif</span>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-[#242522] font-heading">
                {stats.totalCustomers} Cust • {stats.totalMechanics} Tech
              </div>
              <div className="text-[11px] text-[#777871] mt-0.5">4 Lift Workbay Beroperasi</div>
            </div>
          </div>
        </div>

        {/* Revenue Trends Clean Visualization */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#242522] font-heading">
                Tren Pendapatan Bulanan (Jasa Servis vs Penjualan Suku Cadang)
              </h2>
              <p className="text-xs text-[#777871]">Proporsi omzet workshop fisik dan toko produk MELTUNE AUTO.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#242522]" />
                <span className="text-[#242522]">Jasa Servis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#D96B3A]" />
                <span className="text-[#242522]">Suku Cadang</span>
              </div>
            </div>
          </div>

          {monthlyTrends.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded border border-[#E4E1D9]">
              Belum ada data tren omzet tercatat untuk periode ini.
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-3 items-end h-48 pt-6 border-b border-[#E4E1D9]">
              {monthlyTrends.map((item, i) => {
                const maxVal = Math.max(...monthlyTrends.map(t => t.total), 1);
                const serviceHeight = maxVal > 0 ? (item.service / maxVal) * 100 : 0;
                const partsHeight = maxVal > 0 ? (item.parts / maxVal) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] text-[#777871] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(item.total / 1000000).toFixed(1)}Jt
                    </div>
                    <div className="w-full max-w-[42px] flex flex-col rounded overflow-hidden">
                      <div style={{ height: `${partsHeight}px` }} className="bg-[#D96B3A] w-full" />
                      <div style={{ height: `${serviceHeight}px` }} className="bg-[#242522] w-full" />
                    </div>
                    <span className="text-xs font-bold text-[#242522] mt-2 font-heading">{item.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular Services Table */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading">
            Distribusi Layanan Terpopuler
          </h2>

          {popularServices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded border border-[#E4E1D9]">
              Belum ada data pengerjaan layanan tercatat dalam sistem.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F4F0] text-[#777871] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Nama Paket Servis</th>
                    <th className="p-3">Total Pengerjaan</th>
                    <th className="p-3">Pangsa Pasar</th>
                    <th className="p-3 text-right">Total Akumulasi Omzet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E1D9]">
                  {popularServices.map((srv, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F4F0]">
                      <td className="p-3 font-bold text-[#242522]">{srv.name}</td>
                      <td className="p-3 text-[#777871]">{srv.bookings} Kendaraan</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#ECEAE4] h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${srv.share}%` }}
                              className="bg-[#D96B3A] h-full rounded-full"
                            />
                          </div>
                          <span className="font-semibold text-[#242522]">{srv.share}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold font-heading text-[#242522]">
                        Rp {srv.revenue.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
