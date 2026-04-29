import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// Use memory storage (works in both local dev and Vercel serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (extname && mimetype) return cb(null, true)
    cb('Images only!')
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  try {
    // ── Production: Vercel Blob Storage ──
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const safeOriginal = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const filename = `products/${Date.now()}-${safeOriginal}`
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
      })
      return res.json({ success: true, url: blob.url })
    }

    // ── Local dev: write to disk ──
    const uploadsDir = path.join(process.cwd(), 'server', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const safeOriginalLocal = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filename = `image-${Date.now()}-${safeOriginalLocal}`
    fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer)

    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`
    res.json({ success: true, url })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ success: false, message: 'Upload failed' })
  }
})

export default router
