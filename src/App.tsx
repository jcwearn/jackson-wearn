import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaSun, FaMoon } from "react-icons/fa";

const Header: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  return (
    <header className="w-full text-center p-6 bg-gray-300 dark:bg-gray-900 text-black dark:text-white">
      <div className="relative w-24 h-24 mx-auto">
        <img
          src="/profile.jpg"
          alt="Jackson"
          className="w-full h-full rounded-full dark:grayscale"
        />
        <img
          src="/sunglasses.png"
          alt="Sunglasses"
          className={`absolute top-5 left-8 w-1/3 h-1/3 transition-opacity duration-300 ${!darkMode ? "opacity-100" : "opacity-0"
            }`}
        />
      </div>
      <h1 className="text-2xl font-bold mt-4">Jackson Wearn</h1>
      <p className="text-lg">Senior Software Engineer @ Mailchimp</p>
    </header>
  );
}

const Bio: React.FC = () => (
  <section className="w-full max-w-2xl mx-auto p-6 text-left mt-4">
    <p className="text-black dark:text-gray-300 text-lg">
      Hi, I'm Jackson, a seasoned software engineer with a strong passion for backend architecture. While I have worn many hats and can comfortably work across the full stack, my expertise and interests lie in designing scalable and efficient backend systems. In recent years, I’ve worked extensively with Go, which has become my preferred language. Currently, my work revolves around PHP for backend development and JavaScript/TypeScript with React for the frontend.
    </p>
    <br />
    <p className="text-black dark:text-gray-300 text-lg">
      Beyond coding, I have a deep appreciation for outdoor adventures and strategic games. I spend my free time mountain biking, hiking, camping, and, most recently, rollerblading. I also love board games and experimenting with vegetarian cooking.
    </p>
    <br />
    <p className="text-black dark:text-gray-300 text-lg">
      If you're interested in discussing technology, backend architecture, or any of my hobbies, feel free to reach out!
    </p>
  </section>
);

const Contact: React.FC = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error", visible: boolean } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  type ToastType = "success" | "error";

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null)); // Start fade-out
      setTimeout(() => setToast(null), 500); // Remove after fade-out
    }, 3000); // Show toast for 3 seconds
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Form submitted successfully!", "success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        showToast("Form submission failed.", "error");
      }
    } catch (error) {
      showToast("Error submitting form.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-lg mx-auto p-6 text-center overflow-visible relative text-black dark:text-white">
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded z-50 transition-opacity duration-500 ${toast.visible ? "opacity-100" : "opacity-0"
            } ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
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
          className="bg-blue-500 dark:dark:bg-gray-900 text-white p-2 rounded flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </section>
  )
};

const Footer: React.FC = () => (
  <footer className="w-full text-center p-6 bg-gray-300 dark:bg-gray-900 dark:text-white mt-auto">
    <div className="flex justify-center space-x-4">
      <a href="https://www.linkedin.com/in/jackson-wearn/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin size={24} />
      </a>
      <a href="https://github.com/jcwearn" target="_blank" rel="noopener noreferrer">
        <FaGithub size={24} />
      </a>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800 test-black dark:text-white">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
      <Header darkMode={darkMode} />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl px-6 mx-auto">
        <Bio />
        <Contact />
      </div>
      <Footer />
    </div>
  )
};

export default App;
