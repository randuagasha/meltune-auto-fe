'use client';

import { useState, useEffect } from 'react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { api } from '@/services';
import { CartItem, Order } from '@/types';
import { ShoppingBag, Trash2, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, Loader2, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modalOverlayVariants, modalContentVariants, EASE_LUXURY } from '@/lib/motion';

export default function CustomerShopCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingMethod, setShippingMethod] = useState<'workshop_pickup' | 'express_courier'>('workshop_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'workshop_cash'>('qris');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCartAndOrders = () => {
    setCart(api.cart.get());
    api.orders.getAll().then(setOrders).catch(() => {});
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
    if (shippingMethod === 'express_courier' && !address.trim()) {
      setErrorMsg('Alamat pengiriman lengkap wajib diisi untuk opsi Kurir Ekspres.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      let createdOrder: Order;
      try {
        createdOrder = await api.orders.create({
          items: cart.map(c => ({
            productId: c.product.id,
            productName: c.product.name,
            price: c.product.price,
            quantity: c.quantity,
          })),
          shippingMethod,
          shippingAddress: shippingMethod === 'express_courier' ? address.trim() : undefined,
          paymentMethod,
        });
      } catch (err: any) {
        // Fallback demo simulation order
        createdOrder = {
          id: 'demo-' + Date.now(),
          orderNumber: 'MLT-ORD-' + Math.floor(100000 + Math.random() * 900000),
          userId: 'usr-demo',
          userName: 'Pelanggan MELTUNE',
          items: cart.map(c => ({
            productId: c.product.id,
            productName: c.product.name,
            price: c.product.price,
            quantity: c.quantity,
          })),
          subtotal,
          shippingFee,
          totalAmount: grandTotal,
          paymentMethod,
          shippingMethod,
          shippingAddress: shippingMethod === 'express_courier' ? address.trim() : undefined,
          status: 'completed',
          createdAt: new Date().toISOString(),
        };
      }
      api.cart.clear();
      setCart([]);
      setModalOrder(createdOrder);
      setShowModal(true);
      loadCartAndOrders();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses pesanan demo.');
    } finally {
      setSubmitting(false);
    }
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

        {/* DEMO CHECKOUT SUCCESS MODAL */}
        <AnimatePresence>
          {showModal && modalOrder && (
            <motion.div
              variants={modalOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded-lg max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-[#777871] hover:text-[#242522] p-1.5 rounded transition-colors"
                  title="Tutup Modal"
                >
                  <X size={18} />
                </button>

                <div className="text-center space-y-2 pt-1">
                  <motion.div
                    initial={{ scale: 0.7, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                    className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Mode Demo • Simulasi Checkout Sukses
                  </div>
                  <h3 className="text-xl font-extrabold text-[#242522] font-heading">
                    Pesanan Anda Berhasil Dibuat!
                  </h3>
                  <p className="text-xs text-[#777871] max-w-sm mx-auto leading-relaxed">
                    Transaksi telah disimulasikan secara sukses tanpa memerlukan integrasi payment gateway riil. Suku cadang siap disiapkan untuk kendaraan Anda.
                  </p>
                </div>

                <div className="bg-[#F5F4F0] border border-[#E4E1D9] rounded p-4 text-xs space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#777871]">Nomor Pesanan</span>
                    <span className="font-mono font-bold text-[#242522] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E4E1D9]">
                      {modalOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#777871]">Metode Pengambilan</span>
                    <span className="font-semibold text-[#242522]">
                      {modalOrder.shippingMethod === 'workshop_pickup' ? 'Ambil di Bengkel BSD' : 'Kurir Ekspres (Alamat Terdaftar)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#777871]">Metode Pembayaran</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                      {modalOrder.paymentMethod.replace('_', ' ')} (Demo Lunas)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E4E1D9] flex justify-between font-bold text-sm text-[#242522]">
                    <span>Total Pembayaran</span>
                    <span className="text-[#D96B3A] font-heading text-base">
                      Rp {modalOrder.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="border border-[#E4E1D9] rounded p-3 text-xs space-y-1.5 max-h-36 overflow-y-auto bg-white">
                  <div className="text-[11px] font-semibold text-[#777871] mb-1">Daftar Item:</div>
                  {modalOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#242522]">
                      <span className="truncate pr-2">{it.productName} ({it.quantity}x)</span>
                      <span className="font-semibold shrink-0">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-2.5 rounded transition-colors text-center shadow-xs"
                  >
                    Selesai & Belanja Lagi
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      <div className="w-14 h-14 rounded bg-[#ECEAE4] border border-[#E4E1D9] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={22} className="text-[#777871]" />
                        )}
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

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                disabled={cart.length === 0 || submitting}
                onClick={handleCheckout}
                className="w-full bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold py-3 rounded transition-colors disabled:opacity-40 inline-flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                <span>{submitting ? 'Memproses Pesanan...' : 'Proses Checkout Sekarang'}</span>
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
