import { Router } from 'express'
import { body } from 'express-validator'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'

const router = Router()

router.get('/', listProducts)
router.get('/:id', getProduct)

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().isLength({ max: 200 }),
    body('slug').trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().isLength({ max: 8000 }),
    body('priceCents').isInt({ min: 0 }),
    body('image').optional().isLength({ max: 2000 }),
    body('sku').optional().trim().isLength({ max: 64 }),
  ],
  createProduct
)

router.patch(
  '/:id',
  protect,
  adminOnly,
  [
    body('name').optional().trim().notEmpty(),
    body('slug').optional().trim().notEmpty(),
    body('description').optional(),
    body('priceCents').optional().isInt({ min: 0 }),
    body('image').optional(),
    body('sku').optional(),
    body('active').optional().isBoolean(),
  ],
  updateProduct
)

router.delete('/:id', protect, adminOnly, deleteProduct)

export default router
