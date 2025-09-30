import { useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { motion } from "framer-motion";
import BrandNname from "../Assects/logo_green.png";
import Footer from "../Components/Footer.js";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-white text-gray-900 min-h-screen transition-colors duration-300">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
            {/* Logo */}
            <div
              onClick={() => scroll.scrollToTop()}
              className="cursor-pointer flex items-center"
            >
              <img
                src={BrandNname}
                alt="Italics brand logo"
                className="h-12 w-auto object-contain"
                style={{ minWidth: "120px" }}
              />
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-6">
              <Link
                to="features"
                smooth
                duration={500}
                offset={-70}
                className="hover:text-blue-500 cursor-pointer"
              >
                Features
              </Link>
              <Link
                to="pricing"
                smooth
                duration={500}
                offset={-70}
                className="hover:text-blue-500 cursor-pointer"
              >
                Pricing
              </Link>
              <Link
                to="contact"
                smooth
                duration={500}
                offset={-70}
                className="hover:text-blue-500 cursor-pointer"
              >
                Contact
              </Link>
              {/* Login link */}
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </nav>

            {/* Hamburger (Mobile Only) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl"
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white px-6 py-4 space-y-4 shadow-lg"
            >
              <Link
                to="features"
                smooth
                duration={500}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-blue-500 cursor-pointer"
              >
                Features
              </Link>
              <Link
                to="pricing"
                smooth
                duration={500}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-blue-500 cursor-pointer"
              >
                Pricing
              </Link>
              <Link
                to="contact"
                smooth
                duration={500}
                offset={-70}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-blue-500 cursor-pointer"
              >
                Contact
              </Link>
              {/* Login link inside mobile menu */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </motion.div>
          )}
        </header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 px-6 bg-gradient-to-r from-[#4ECCA3] to-teal-600 text-white"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Write Different. Write
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
              className="font-extrabold italic text-6xl text-[#4ECCA3] ml-2 drop-shadow-[0_0_15px_rgba(78,204,163,0.8)]"
            >
              ITALICS.
            </motion.span>
          </h2>

          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            A modern blogging platform for writers who want to stand out.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
          >
            Get Started
          </button>
        </motion.section>

        {/* Features */}
        <section
          id="features"
          className="max-w-7xl mx-auto py-20 px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: "📝 Easy Writing",
              desc: "Write blogs with our clean and distraction-free editor.",
            },
            {
              title: "🌍 Share Globally",
              desc: "Publish your stories and reach readers worldwide.",
            },
            {
              title: "⚡ Fast & Secure",
              desc: "Experience blazing-fast load times with full security.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-lg shadow bg-gray-50"
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Pricing */}
        <motion.section
          id="pricing"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-100 py-20 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-10">Pricing Plans</h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {["Free", "Pro", "Enterprise"].map((plan, i) => (
                <motion.div
                  key={plan}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`p-6 rounded-lg shadow bg-white ${
                    plan === "Pro" ? "border-2 border-blue-600" : ""
                  }`}
                >
                  <h4 className="text-xl font-bold mb-4">{plan}</h4>
                  <p className="mb-4">
                    {plan === "Free"
                      ? "$0/month"
                      : plan === "Pro"
                      ? "$9/month"
                      : "Custom"}
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan === "Free" && (
                      <>
                        <li>✔ Write & Publish</li>
                        <li>✔ Basic Themes</li>
                      </>
                    )}
                    {plan === "Pro" && (
                      <>
                        <li>✔ Custom Themes</li>
                        <li>✔ Analytics</li>
                        <li>✔ Priority Support</li>
                      </>
                    )}
                    {plan === "Enterprise" && (
                      <>
                        <li>✔ Team Management</li>
                        <li>✔ API Access</li>
                        <li>✔ Dedicated Support</li>
                      </>
                    )}
                  </ul>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {plan === "Enterprise"
                      ? "Contact Us"
                      : plan === "Pro"
                      ? "Go Pro"
                      : "Start Free"}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto py-20 px-6 text-center"
        >
          <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
          <p className="mb-8">
            We’d love to hear from you. Drop us a message below.
          </p>
          <form className="grid gap-4 text-left">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded bg-gray-100 w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded bg-gray-100 w-full"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="p-3 rounded bg-gray-100 w-full"
            ></textarea>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </motion.section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
