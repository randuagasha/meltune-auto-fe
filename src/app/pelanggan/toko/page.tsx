'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { CartItem, Order } from '@/types';
import { ShoppingBag, Trash2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CustomerShopCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingMethod, setShippingMethod] = useState<'workshop_pickup' | 'express_courier'>('workshop_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'workshop_cash'>('qris');
  const [address, setAddress] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<Order | null>(null);

  const loadCartAndOrders = () => {
    setCart(api.cart.get());
    api.orders.getAll().then(setOrders);
  };

  useEffect(() => {
    loadCartAndOrders();
  }, []);

  const handleRemove = (id: string) => {
    const updated = api.cart.remove(id);
    setCart(updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'express_courier' ? 25000 : 0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const newOrder = await api.orders.create({
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
      })),
      shippingMethod,
      shippingAddress: shippingMethod === 'express_courier' ? address : undefined,
      paymentMethod,
    });
    setCheckoutSuccess(newOrder);
    loadCartAndOrders();
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#242522] font-heading">
            Keranjang & Pesanan Suku Cadang
          </h1>
          <p className="text-xs text-[#777871] mt-0.5">
            Suku cadang dan oli resmi langsung disiapkan di konter bengkel atau dikirim ke alamat Anda.
          </p>
        </div>

        {checkoutSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-950 font-heading">
              Pesanan {checkoutSuccess.orderNumber} Berhasil Dibuat
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Total pembayaran Rp {checkoutSuccess.totalAmount.toLocaleString('id-ID')} via {checkoutSuccess.paymentMethod.toUpperCase()}.
              {checkoutSuccess.shippingMethod === 'workshop_pickup'
                ? ' Silakan tunjukkan nomor pesanan saat berkunjung ke bengkel.'
                : ' Kurir workshop akan segera mengirimkan suku cadang ke alamat Anda.'}
            </p>
            <button
              onClick={() => setCheckoutSuccess(null)}
              className="text-xs font-semibold text-emerald-900 underline"
            >
              Tutup pemberitahuan
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
            <h2 className="text-base font-bold text-[#242522] font-heading flex items-center justify-between">
              <span>Item di Keranjang ({cart.length})</span>
              <a href="/produk" className="text-xs font-semibold text-[#D96B3A] hover:underline">
                + Tambah Produk Lain
              </a>
            </h2>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#777871] bg-[#F5F4F0] rounded">
                Keranjang Anda masih kosong. Silakan kunjungi katalog suku cadang.
              </div>
            ) : (
              <div className="divide-y divide-[#E4E1D9]">
                {cart.map(item => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded bg-neutral-900 overflow-hidden shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#242522]">{item.product.name}</h4>
                        <div className="text-[11px] text-[#777871] mt-0.5">
                          Rp {item.product.price.toLocaleString('id-ID')} x {item.quantity} unit
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-bold text-[#242522] font-heading">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-5 bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
            <h2 className="text-base font-bold text-[#242522] font-heading">
              Ringkasan Pembayaran
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#242522] mb-1">Metode Pengambilan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('workshop_pickup')}
                    className={`p-2.5 rounded border text-left text-xs ${
                      shippingMethod === 'workshop_pickup'
                        ? 'border-[#D96B3A] bg-orange-50 font-bold text-[#242522]'
                        : 'border-[#E4E1D9] bg-[#F5F4F0]'
                    }`}
                  >
                    Ambil di Workshop (Gratis)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMethod('express_courier')}
                    className={`p-2.5 rounded border text-left text-xs ${
                      shippingMethod === 'express_courier'
                        ? 'border-[#D96B3A] bg-orange-50 font-bold text-[#242522]'
                        : 'border-[#E4E1D9] bg-[#F5F4F0]'
                    }`}
                  >
                    Kurir Ekspres (+Rp 25.000)
                  </button>
                </div>
              </div>

              {shippingMethod === 'express_courier' && (
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Alamat Lengkap Pengiriman</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Jalan, nomor rumah, RT/RW, kecamatan, kota..."
                    className="w-full p-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#242522] mb-1">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded focus:outline-none focus:border-[#D96B3A]"
                >
                  <option value="qris">QRIS Instan (BCA, Mandiri, GoPay, OVO)</option>
                  <option value="bank_transfer">Virtual Account Bank Transfer</option>
                  <option value="workshop_cash">Bayar Tunai di Kasir Workshop</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E4E1D9] space-y-1.5">
                <div className="flex justify-between text-[#777871]">
                  <span>Subtotal Produk</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#777871]">
                  <span>Biaya Pengantaran</span>
                  <span>Rp {shippingFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-2 border-t border-[#E4E1D9] flex justify-between font-bold text-sm text-[#242522]">
                  <span>Total Transaksi</span>
                  <span className="text-[#D96B3A] font-heading text-base">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors disabled:opacity-40"
              >
                Proses Checkout Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Past Orders Table */}
        <div className="bg-[#FFFFFF] p-6 rounded border border-[#E4E1D9] space-y-4">
          <h2 className="text-base font-bold text-[#242522] font-heading">
            Riwayat Pesanan Suku Cadang Anda
          </h2>

          {orders.length === 0 ? (
            <div className="text-xs text-[#777871] text-center py-4">Belum ada transaksi sebelumnya.</div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div
                  key={o.id}
                  className="p-4 bg-[#F5F4F0] border border-[#E4E1D9] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#242522]">{o.orderNumber}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px] capitalize">
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[#777871] mt-1">
                      {o.items.map(i => `${i.productName} (${i.quantity}x)`).join(', ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-[#242522] font-heading text-sm">
                      Rp {o.totalAmount.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-[#777871]">{new Date(o.createdAt).toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
