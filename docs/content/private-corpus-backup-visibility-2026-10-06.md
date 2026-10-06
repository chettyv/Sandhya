# Corpus backup visibility — 6 October 2026

GitHub currently reports `chettyv/Sandhya` as **public**. An authenticated repository API request returned HTTP200 with `private:false`. A separate request without authentication returned the same result. The existing chapter16 release endpoint also returned HTTP200 and listed three assets without authentication. This establishes current access; it does not establish who changed visibility or when.

The chapter17 uploader stopped at the private-destination guard in `scripts/private-corpus/common.py` before creating a release or uploading corpus files. The chapter17 release endpoint returned HTTP404. The guard remains enabled.

Chapter17 is imported and verified **on this PC** as document12500/body1238205,6,990 stored characters. Exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes, foreign keys and an idempotent repeat import passed. The current database has1,238,205 bodies,12,500 documents and171 PDF assets. SHA256: `1c7aae36d0b110024e55aa36e070698ccb7757368e90bd0287b8facaf0aeec73`,9,783,201,792 bytes.

The local chapter17 archive has25 individually verified files,3,309,802 source bytes,2,855,316 compressed bytes. Its sealed manifest is at `content/_staging/transfer/private-corpus-2026-10-06-carya17/manifest.json`; manifest SHA256: `af595646753d44cf5039397b7d399c202fb83c22b2dcace9374d830e74b4e171`. It contains the body/evidence/scripts/reports,fifteen newer previews and chapter18 opening evidence. It has **not** been uploaded or verified remotely. Do not mistake the prepared local archive for a completed backup.

The latest published and verified restore checkpoint is chapter16 across24 releases, with1,238,204 bodies and12,499 documents. Older statements calling those releases “private” describe their previously verified visibility; current public access supersedes that visibility claim. On another PC, restore throughchapter16 only until the chapter17 delta has actually been published to an approved private destination.

The user has been asked whether to make the existing repository private or use a separate private corpus repository. No visibility change, migration, release deletion or public corpus upload is authorized by elapsed waiting time. The remaining corpus collection goal stays active; source reading/local acquisition can continue while the destination decision is pending.
