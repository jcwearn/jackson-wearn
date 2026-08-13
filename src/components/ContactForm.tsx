import React, { useState } from 'react'

type ToastType = 'success' | 'error'

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [toast, setToast] = useState<{
    message: string
    type: ToastType
    visible: boolean
  } | null>(null)

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, visible: true })

    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null)) // Start fade-out
      setTimeout(() => setToast(null), 500) // Remove after fade-out
    }, 3000) // Show toast for 3 seconds
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast('Form submitted successfully!', 'success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        showToast('Form submission failed.', 'error')
      }
    } catch {
      showToast('Error submitting form.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full max-w-lg mx-auto p-6 text-center overflow-visible relative text-black dark:text-white">
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded z-50 transition-opacity duration-500 ${
            toast.visible ? 'opacity-100' : 'opacity-0'
          } ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          {toast.message}
        </div>
      )}
      <h2 className="text-xl font-bold">Contact Me</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
        <input
          onChange={handleChange}
          value={formData.name}
          type="text"
          name="name"
          id="name"
          placeholder="Your Name"
          required
          className="p-2 border rounded w-full"
        />
        <input
          onChange={handleChange}
          value={formData.email}
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          required
          className="p-2 border rounded w-full"
        />
        <textarea
          onChange={handleChange}
          value={formData.message}
          placeholder="Your Message"
          name="message"
          id="message"
          required
          className="p-2 border rounded w-full"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 dark:bg-gray-900 text-white p-2 rounded flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </section>
  )
}

export default ContactForm
