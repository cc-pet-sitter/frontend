import React, { useState, FormEvent } from "react";

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the data to your backend or a service
    // For this demo, we just show a success message
    setSuccessMessage("Thank you for contacting us! We will get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6 text-gray-700">
        If you have any questions, concerns, or need help, please fill out the form below and we will
        get back to you as soon as possible.
      </p>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#D87607] focus:border-[#D87607]"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#D87607] focus:border-[#D87607]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Message
          </label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 h-32 focus:outline-none focus:ring-1 focus:ring-[#D87607] focus:border-[#D87607]"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary py-2 px-4 rounded font-bold w-full focus:outline-none focus:ring-2 focus:ring-[#D87607] focus:ring-offset-2"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;