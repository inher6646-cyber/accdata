# Bisnis Online — Buku Usaha Harian

Aplikasi pencatatan bisnis online untuk UMKM. Kelola produk, transaksi penjualan,
restock, dan arus kas dalam satu tempat, lengkap dengan ringkasan dashboard.

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Motoko (canister Internet Computer) dengan penyimpanan data on-chain
- **Bahasa antarmuka**: Indonesia, format angka Rupiah (Rp), responsif untuk HP

## Prasyarat

- **Node.js** >= 16 dan **pnpm** >= 7
- **Motoko toolchain** (`mops`) untuk backend — lihat <https://mops.one>

## Menjalankan Secara Lokal

### 1. Install dependensi

Dari root repository:

```bash
pnpm install
```

Lalu install dependensi backend Motoko:

```bash
mops install
```

> Catatan: `mops.toml` berada di root repository, jadi perintah `mops` dijalankan
> dari root.

### 2. Build backend dan regenerate bindings

Bindings TypeScript frontend dihasilkan dari file `.did` backend, jadi build
backend terlebih dahulu:

```bash
mops build
```

Setelah itu regenerate bindings dari root repository:

```bash
pnpm bindgen
```

### 3. Jalankan frontend (dev server)

```bash
cd src/frontend
pnpm dev
```

Vite akan menampilkan URL lokal (biasanya <http://localhost:5173>).

## Build untuk Produksi

Build seluruh workspace dari root repository:

```bash
pnpm build
```

Atau build frontend saja:

```bash
cd src/frontend
pnpm build
```

Hasil build frontend berada di `src/frontend/dist`.

## Perintah Berguna

Dijalankan dari root repository:

| Perintah         | Fungsi                                        |
| ---------------- | --------------------------------------------- |
| `pnpm typecheck` | Cek tipe TypeScript di seluruh workspace      |
| `pnpm check`     | Jalankan lint (Biome) di seluruh workspace    |
| `pnpm fix`       | Perbaiki otomatis masalah lint                |
| `pnpm build`     | Build semua paket                             |
| `pnpm bindgen`   | Regenerate bindings dari `backend.did`        |

Dijalankan dari `src/frontend`:

| Perintah         | Fungsi                          |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Jalankan dev server Vite        |
| `pnpm typecheck` | Cek tipe TypeScript             |
| `pnpm check`     | Lint dengan Biome               |
| `pnpm fix`       | Perbaiki otomatis masalah lint  |
| `pnpm build`     | Build produksi ke `dist/`       |

Dijalankan dari root repository (backend):

| Perintah          | Fungsi                          |
| ----------------- | ------------------------------- |
| `mops install`    | Install dependensi Motoko       |
| `mops check --fix`| Cek dan perbaiki kode Motoko    |
| `mops build`      | Build canister backend          |

## Struktur Proyek

```
.
├── mops.toml              # Konfigurasi backend Motoko
├── package.json           # Script workspace (build/typecheck/check/fix/bindgen)
├── src/
│   ├── backend/           # Kode canister Motoko (main.mo, types/, mixins/)
│   └── frontend/          # Aplikasi React + TypeScript
└── pnpm-workspace.yaml
```
