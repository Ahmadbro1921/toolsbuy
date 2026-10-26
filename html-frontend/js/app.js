/**
 * ToolsBuy - Core Client Database & Interactive Application Script
 * Provides localStorage persistence between checkout, user dashboard, and admin desk.
 */

// Default Seed Data
const DEFAULT_TOOLS = [
  { id: "tool-helium10", name: "Helium 10 Diamond", cat: "Amazon FBA", price: 2000, desc: "Cerebro reverse ASIN, Black Box product finder, Freedom Ticket course." },
  { id: "tool-junglescout", name: "Jungle Scout", cat: "Amazon FBA", price: 1500, desc: "Sales estimator, Opportunity Finder, Product Tracker." },
  { id: "tool-keepa", name: "Keepa Pro", cat: "Amazon FBA", price: 1000, desc: "Real-time Amazon price history, BSR rank tracking, sales velocity." },
  { id: "tool-chatgpt", name: "ChatGPT Plus (GPT-4o)", cat: "AI Models", price: 1500, desc: "GPT-4o, Canvas, advanced data analysis, DALL-E 3 image generation." },
  { id: "tool-claude", name: "Claude 3.5 Sonnet", cat: "AI Models", price: 1500, desc: "Artifacts, superior coding analysis, fast reasoning." },
  { id: "tool-midjourney", name: "Midjourney v6", cat: "AI Models", price: 1200, desc: "State of the art photorealistic AI image generation." },
  { id: "tool-perplexity", name: "Perplexity Pro", cat: "AI Models", price: 1000, desc: "Interactive web search with real-time academic and live citations." },
  { id: "tool-semrush", name: "Semrush Guru", cat: "SEO & Traffic", price: 1500, desc: "Keyword Magic Tool, backlink audit, competitor organic research." },
  { id: "tool-canva", name: "Canva Pro", cat: "Design & Creative", price: 500, desc: "Unlimited premium templates, brand kit, background remover." },
  { id: "tool-coursera", name: "Coursera Plus", cat: "Education", price: 1000, desc: "Professional certificates from Google, IBM, and top universities." },
  { id: "tool-netflix", name: "Netflix 4K Ultra HD", cat: "Entertainment", price: 500, desc: "Premium 4K Ultra HD streaming movies & series." },
  { id: "tool-prime", name: "Amazon Prime Video", cat: "Entertainment", price: 500, desc: "Amazon Originals, blockbuster movies, ad-free playback." },
];

const DEFAULT_PACKAGES = [
  {
    id: "pkg-basic",
    name: "Basic Bundle",
    price: 3500,
    badge: "Starter",
    desc: "Essential pack for Amazon beginners and content creators.",
    tools: ["Helium 10 Diamond", "H10 Freedom Ticket", "ChatGPT Plus", "Canva Pro", "Netflix 4K"],
  },
  {
    id: "pkg-standard",
    name: "Standard Bundle",
    price: 4000,
    badge: "Most Popular",
    desc: "Our top-selling pack for Amazon FBA sellers, copywriters & agencies.",
    tools: ["Helium 10 Diamond", "Jungle Scout", "ChatGPT Plus", "Claude 3.5 Sonnet", "Canva Pro", "Netflix 4K", "Prime Video"],
  },
  {
    id: "pkg-premium",
    name: "Premium Bundle",
    price: 5000,
    badge: "Best Value",
    desc: "Complete power-suite: Amazon hunting, Top AI models, SEO & Education.",
    tools: ["Helium 10 Diamond", "Keepa Pro", "Jungle Scout", "ChatGPT Plus", "Claude 3.5", "Midjourney v6", "Semrush Guru", "Canva Pro", "Coursera", "Netflix", "Prime Video"],
  },
];

const DEFAULT_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "ORD-9281",
    name: "Alex Developer",
    phone: "+92 300 1234567",
    email: "user@toolsbuy.com",
    packageName: "Standard Bundle",
    amount: 4000,
    method: "EasyPaisa",
    tid: "TRX8829104",
    status: "verified",
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
  },
  {
    id: "ord-2",
    orderNumber: "ORD-9304",
    name: "Hamza Malik",
    phone: "+92 312 9988776",
    email: "hamza@example.com",
    packageName: "Premium Bundle",
    amount: 5000,
    method: "JazzCash",
    tid: "JC99102837",
    status: "pending",
    date: new Date(Date.now() - 3600000 * 3).toLocaleDateString(),
  },
];

const DEFAULT_SUBSCRIPTION = {
  active: true,
  packageName: "Standard Bundle",
  expiresInDays: 28,
  tools: [
    "Helium 10 Diamond",
    "Jungle Scout",
    "Keepa Pro",
    "ChatGPT Plus (GPT-4o)",
    "Claude 3.5 Sonnet",
    "Canva Pro",
    "Netflix 4K Ultra HD",
  ],
};

const DEFAULT_TICKETS = [
  {
    id: "tck-1",
    number: "TCK-4102",
    subject: "How do I launch Helium 10 Cerebro?",
    category: "General",
    status: "Open",
    messages: [
      { sender: "user", name: "Alex Developer", text: "Hello! I clicked Launch on Helium 10, how do I open Cerebro?", time: "2 hours ago" },
      { sender: "admin", name: "ToolsBuy Support", text: "Hi Alex! In the launched browser window, click Tools > Cerebro at the top menu.", time: "1 hour ago" },
    ],
  },
];

// Persistent Database Layer
const DB = {
  getTools: () => JSON.parse(localStorage.getItem("tb_tools") || JSON.stringify(DEFAULT_TOOLS)),
  getPackages: () => JSON.parse(localStorage.getItem("tb_packages") || JSON.stringify(DEFAULT_PACKAGES)),
  getOrders: () => JSON.parse(localStorage.getItem("tb_orders") || JSON.stringify(DEFAULT_ORDERS)),
  saveOrders: (orders) => localStorage.setItem("tb_orders", JSON.stringify(orders)),
  getSubscription: () => JSON.parse(localStorage.getItem("tb_sub") || JSON.stringify(DEFAULT_SUBSCRIPTION)),
  saveSubscription: (sub) => localStorage.setItem("tb_sub", JSON.stringify(sub)),
  getTickets: () => JSON.parse(localStorage.getItem("tb_tickets") || JSON.stringify(DEFAULT_TICKETS)),
  saveTickets: (tickets) => localStorage.setItem("tb_tickets", JSON.stringify(tickets)),
};

// Clipboard Helper
function copyText(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const originalText = btnElement.innerText;
      btnElement.innerText = "Copied!";
      btnElement.style.color = "#10a37f";
      setTimeout(() => {
        btnElement.innerText = originalText;
        btnElement.style.color = "";
      }, 2000);
    }
  });
}

// Global Modal Handler
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

// Tool Launcher Action (Simulated Cloud Browser Session)
function launchToolModal(toolName) {
  const titleEl = document.getElementById("launchToolTitle");
  const frameEl = document.getElementById("launchFrameInfo");
  if (titleEl) titleEl.innerText = toolName;
  if (frameEl) {
    frameEl.innerText = `Establishing high-speed isolated cloud session for ${toolName}... Authenticated & Cookie-Synced.`;
  }
  openModal("launchModal");
}

// FAQ Accordion Initialization
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((other) => other.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    }
  });

  // Mobile Drawer Toggle
  const mobileBtn = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "70px";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.backgroundColor = "#0b0f17";
      navLinks.style.padding = "20px";
      navLinks.style.borderBottom = "1px solid #1e293b";
    });
  }
});
