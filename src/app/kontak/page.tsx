'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE_LUXURY, fadeInUp, fadeInScale } from '@/lib/motion';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            className="max-w-2xl mb-12"
          >
            <span className="text-xs uppercase tracking-widest text-[#D96B3A] font-semibold">
              Hubungi Workshop
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242522] font-heading mt-1">
              Konsultasi & Kunjungan Fisik Workshop
            </h1>
            <p className="text-sm text-[#777871] mt-2">
              Tim mekanik dan layanan pelanggan siap melayani pertanyaan seputar diagnostik mesin, ketersediaan suku cadang, dan booking jadwal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Workshop details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_LUXURY }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] space-y-6 shadow-2xs">
                <h3 className="text-lg font-bold text-[#242522] font-heading">
                  Informasi Operasional Workshop
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#D96B3A] shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#242522]">Alamat Fisik Workshop</div>
                      <p className="text-xs text-[#777871] mt-0.5 leading-relaxed">
                        Kawasan Otomotif BSD Blok B3 No. 12, Pagedangan, Tangerang Selatan, Banten 15310
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[#D96B3A] shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#242522]">Jam Buka Layanan</div>
                      <p className="text-xs text-[#777871] mt-0.5">
                        Senin - Sabtu: 08:30 - 17:30 WIB
                      </p>
                      <p className="text-xs text-[#777871]">
                        Hari Minggu & Hari Libur Nasional: Tutup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#D96B3A] shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#242522]">Telepon Langsung</div>
                      <p className="text-xs text-[#777871] mt-0.5">
                        +62 21 5590 8820
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare size={18} className="text-[#D96B3A] shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#242522]">WhatsApp Servis & Darurat</div>
                      <p className="text-xs text-[#777871] mt-0.5">
                        +62 811 9876 543 (Respon Cepat)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#D96B3A] shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-[#242522]">Email Korespondensi</div>
                      <p className="text-xs text-[#777871] mt-0.5">
                        layanan@meltune.id
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E1D9]">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <a
                      href="https://wa.me/628119876543?text=Halo%20MELTUNE%20AUTO,%20saya%20ingin%20konsultasi%20kendaraan"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#242522] hover:bg-[#383a35] text-white text-xs font-semibold py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <MessageSquare size={15} />
                      <span>Chat WhatsApp Workshop</span>
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-[#FFFFFF] border border-[#E4E1D9] rounded p-4 overflow-hidden shadow-2xs">
                <div className="aspect-16/9 bg-[#ECEAE4] rounded flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <MapPin size={28} className="text-[#D96B3A]" />
                  <span className="text-xs font-bold text-[#242522] font-heading">
                    Lokasi Workshop MELTUNE AUTO BSD
                  </span>
                  <span className="text-[11px] text-[#777871] max-w-xs">
                    5 Menit dari Exit Tol BSD Timur. Patokan: Samping Sentra Otomotif Modern BSD Blok B3.
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Direct inquiry form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_LUXURY }}
              className="lg:col-span-7"
            >
              <div className="bg-[#FFFFFF] p-8 rounded border border-[#E4E1D9] shadow-2xs">
                <h3 className="text-lg font-bold text-[#242522] font-heading mb-6">
                  Kirim Pesan Pertanyaan Cepat
                </h3>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="submitted-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: EASE_LUXURY }}
                      className="bg-[#ECEAE4] p-8 rounded text-center space-y-3"
                    >
                      <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                      <h4 className="text-base font-bold text-[#242522] font-heading">
                        Pesan Anda Berhasil Diterima
                      </h4>
                      <p className="text-xs text-[#777871] max-w-sm mx-auto">
                        Mekanik atau customer support MELTUNE AUTO akan menghubungi nomor WhatsApp Anda dalam kurun waktu operasional maksimal 30 menit.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-2 text-xs font-semibold text-[#D96B3A] underline"
                      >
                        Kirim pesan lain
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="contact-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#242522] mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#242522] mb-1">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Contoh: 081234567890"
                            className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#242522] mb-1">
                          Kendaraan (Merek, Model & Tahun)
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle}
                          onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                          placeholder="Contoh: Honda Civic Turbo 2021"
                          className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#242522] mb-1">
                          Pesan atau Kendala Mobil
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Ceritakan kendala, suara aneh, atau paket servis yang Anda butuhkan..."
                          className="w-full px-3 py-2 text-xs bg-[#F5F4F0] border border-[#E4E1D9] rounded text-[#242522] focus:outline-none focus:border-[#D96B3A] transition-colors"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-[#D96B3A] hover:bg-[#BF582D] text-white text-xs font-semibold px-6 py-3 rounded transition-colors inline-flex items-center gap-2 shadow-xs"
                      >
                        <Send size={14} />
                        <span>Kirim Pertanyaan ke Workshop</span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
