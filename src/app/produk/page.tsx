'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/services';
import { ProductItem } from '@/types';
import { Search, ShoppingBag, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    api.products.getAll().then(setProducts);
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'engine_oil', label: 'Oli Mesin' },
    { id: 'parts', label: 'Suku Cadang' },
    { id: 'car_care', label: 'Car Care & Detailing' },
    { id: 'accessories', label: 'Alat & Aksesori' },
  ];

  const handleAddToCart = (product: ProductItem) => {
    api.cart.add(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
                TORSI Store & Parts
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242522] font-heading mt-1">
                Suku Cadang & Fluida Otomotif Terkurasi
              </h1>
              <p className="text-sm text-[#777871] mt-2">
                100% Produk Original dari distributor resmi. Tersedia untuk pengambilan di bengkel atau pengiriman ekspres.
              </p>
            </div>
            <Link
              href="/pelanggan/toko"
              className="bg-[#242522] text-[#F5F4F0] px-4 py-2.5 rounded text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#383a35] transition-colors"
            >
              <ShoppingBag size={14} />
              <span>Lihat Keranjang & Checkout</span>
            </Link>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded border border-[#E4E1D9] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777871]" />
              <input
                type="text"
                placeholder="Cari oli, filter, minyak rem..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F5F4F0] border border-[#E4E1D9] rounded text-xs text-[#242522] placeholder:text-[#777871] focus:outline-none focus:border-[#D96B3A]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors font-medium ${
                    category === cat.id
                      ? 'bg-[#D96B3A] text-white'
                      : 'bg-[#ECEAE4] text-[#242522] hover:bg-[#E4E1D9]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-[#FFFFFF] border border-[#E4E1D9] rounded overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-square overflow-hidden bg-neutral-900 relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[#242522]/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      Stok: {product.stock} unit
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-[#D96B3A] font-semibold">
                      {product.category.replace('_', ' ')}
                    </div>
                    <h3 className="text-base font-bold text-[#242522] font-heading line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#777871] leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#777871]">Harga Satuan</div>
                      <div className="text-base font-extrabold text-[#242522] font-heading">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`text-xs font-semibold px-3.5 py-2 rounded transition-colors inline-flex items-center gap-1.5 ${
                        addedId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#D96B3A] hover:bg-[#BF582D] text-white'
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check size={14} />
                          <span>Ditambahkan</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>+ Keranjang</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Supply Assurance */}
          <div className="mt-16 bg-[#FFFFFF] border border-[#E4E1D9] p-8 rounded">
            <div className="flex items-start gap-4">
              <ShieldCheck size={28} className="text-[#D96B3A] shrink-0" />
              <div>
                <h4 className="text-base font-bold text-[#242522] font-heading">
                  Jaminan Penjualan Resmi TORSI (Bukan Multi-Vendor)
                </h4>
                <p className="text-xs text-[#777871] mt-1 leading-relaxed max-w-3xl">
                  Seluruh barang dalam katalog ini dijual langsung oleh workshop TORSI. Kami tidak mengizinkan penjual pihak ketiga. Setiap batch oli dan suku cadang memiliki nomor lot manufaktur yang dapat diverifikasi keasliannya saat servis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
