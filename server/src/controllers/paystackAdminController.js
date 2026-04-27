
/**
 * Paystack Admin Proxy Controller
 * 
 * SECURITY AUDIT:
 * - All methods are protected by adminOnly middleware in routes.
 * - Proxies requests to Paystack using the Secret Key.
 */
const PaystackAdmin = {
  /**
   * List all transactions from Paystack
   */
  async listTransactions(req, res) {
    try {
      const response = await fetch('https://api.paystack.co/transaction', {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      })
      const data = await response.json()
      
      if (!data.status) {
        return res.status(400).json({ success: false, message: data.message })
      }
      
      res.json({ success: true, data: data.data })
    } catch (err) {
      console.error('Paystack Admin API Error:', err)
      res.status(500).json({ success: false, message: 'Failed to fetch transactions' })
    }
  },

  /**
   * List all customers from Paystack
   */
  async listCustomers(req, res) {
    try {
      const response = await fetch('https://api.paystack.co/customer', {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      })
      const data = await response.json()
      
      if (!data.status) {
        return res.status(400).json({ success: false, message: data.message })
      }
      
      res.json({ success: true, data: data.data })
    } catch (err) {
      console.error('Paystack Admin API Error:', err)
      res.status(500).json({ success: false, message: 'Failed to fetch customers' })
    }
  }
}

export default PaystackAdmin
