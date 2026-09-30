# Project Guidance

## User Preferences

- UI Bahasa Indonesia
- Format angka Rupiah (Rp)
- Responsif dan nyaman dipakai di HP
- Single-user, tanpa login/multi-akun

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Backend numeric fields (Rupiah, Id, Timestamp, qty, stock, sold, balance) arrive as bigint in TypeScript; route them through lib/format helpers rather than rendering raw.
- This app defines success/warning only as CSS utilities (.text-success, .bg-success-soft) plus oklch vars, not as Tailwind palette colors, so bg-success and border-warning/40 silently no-op.
- Enhanced migration chain allows only one pending migration (check-limit=1); fold a pending baseline into the latest pending file rather than adding a second.
- moc 1.16.0 has no triple-quoted multiline strings; build long static text with Text.join(lines.values(), "\n").
- Motoko List.List is invariant — use full record types in signatures, not structural subsets.
- Local funcs used inside an include Expose(...) block must be defined before the include in the actor body.
- All mutation hooks invalidate the full query key set because one write (transaction/restock) affects stock, cash, and dashboard simultaneously.
- The import parser trims spaces but not carriage returns, so CRLF pastes from Windows/Excel can skip the final numeric column.
