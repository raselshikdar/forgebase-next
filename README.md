# 🔥 Forgebase-Next

**Forgebase** — A modern full-stack personal digital portfolio template with blog, projects, products, and gallery.

👉 Live Demo: https://v0-forgebase-2.vercel.app/

Forgebase-Next is a polished, production-ready personal website template built with the latest modern technologies.  
It combines **portfolio showcase**, **dynamic blogging**, **product cards/store**, and **gallery features** into one cohesive personal brand platform.

---

## 📌 Features

🎨 **Full Website Experience**
- Homepage with hero, featured projects, blog previews, and featured products  
- About/Skills/Experience sections  
- Responsive on mobile & desktop

✍️ **Blog System**
- List of blog posts
- Dedicated blog pages with progress bar & table of contents
- Like, comment, view, and share indicators
- Rich text content with Waline comments

🧠 **Project & Work Showcase**
- Professional project cards
- Tech stack display
- Project detail pages

🛍️ **Store / Product Catalog**
- Product listing & detail cards
- Ready for future e-commerce integration

🖼️ **Gallery**
- Visual showcase for work/creative assets

⚙️ **Admin Ready**
- Built for Supabase backend (auth + storage + db)
- Easy content management (blogs, products)

🚀 **Performance & UX**
- Smooth page transitions
- Loading indicators on slow operations
- Dark/Light mode support

---

## 🧱 Built With

Below are the core technologies used in Forgebase:

| Category | Technologies |
|----------|--------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth, Database, Storage) |
| Comment System | Waline |
| Deployment | Vercel |

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 🔹 Prerequisites
Make sure you have installed:
- Node.js (v18+)
- npm or yarn
- Supabase project (for backend)

---

### 💻 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raselshikdar/forgebase-next.git
   ```
   
2. **Install dependencies**
```bash
cd forgebase
npm install
# OR
yarn install
```

3. **Environment Variables**
Create a .env.local file and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. **Start Development Server**
```bash
npm run dev
# OR
yarn dev
```

Your site should now be running at http://localhost:3000.

---

## 🛠️ Customization & Admin

Forgebase is designed to be easily customizable:

- Add/edit blog posts via Supabase tables
- Manage products in Supabase
- Customize homepage sections with modular components

If you want to add more features—like internationalization, advanced search, or payment integration—you can extend the template freely.

---

## 📈 Demo Links
✔️ Live Site: https://v0-forgebase-2.vercel.app/
(This link shows the deployed version of this project)

---

## 🤝 Contributing

Thank you for your interest in contributing to Forgebase!
To help improve the project:

1.Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/[your-feature]
```
3. Commit your changes
```bash
git commit -m "Add some feature"
```
4. Push the branch
```bash
git push origin feature/[your-feature]
```
5. Open a Pull Request

---

## 🧾 License
This project is licensed under the MIT License — see the [LICENSE](https://github.com/raselshikdar/forgebase-next/blob/main/LICENSE) file for details.

---

## 📬 Connect
If you have questions, want to report a bug, or request a feature, feel free to open an issue here on GitHub.

---

Made with ❤️ by [**Rasel Shikdar**](https://github.com/raselshikdar).
