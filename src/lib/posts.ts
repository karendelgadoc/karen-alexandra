export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  sections: Section[];
}

export interface Section {
  heading?: string;
  headingLevel?: "h2" | "h3";
  italic?: boolean;
  body?: string;
  image?: string;
  imageAlt?: string;
  list?: string[];
}

// Legacy static posts kept only for seeding — see src/lib/posts-db.ts for DB queries
export const posts: Post[] = [
  {
    slug: "case-study-mia-the-new-yorker",
    title: "Case Study: Mia The New Yorker",
    date: "2025-08-19",
    category: "Case Studies",
    heroImage:
      "https://karenalexandra.com/wp-content/uploads/2025/09/Canon-0035-1024x726.jpg",
    heroAlt: "Karen Alexandra | Fashion E-Commerce Merchandiser",
    excerpt:
      "Mia The New Yorker is my first fashion e-commerce brand, inspired by my dog and Peruvian heritage — a hands-on digital merchandising laboratory launched October 2024.",
    sections: [
      {
        heading: "Mia The New Yorker — Fashion E-Commerce Store (2023–2025)",
        headingLevel: "h3",
        body: "Mia The New Yorker is my first fashion e-commerce brand and venture selling a physical product. The concept was inspired by my dog, Mia, who drew attention wearing a Peruvian sweater during walks in Williamsburg, Brooklyn. This organic product validation, combined with my Peruvian heritage and desire to create a brand connected to my roots, planted the seed for Mia The New Yorker.\n\nAfter almost two years of product development and planning, and partnering with a close friend in New York City, we officially launched the brand on October 1, 2024. I focused on buying, digital merchandising, and website building and management, while my partner handled photoshoots, creative content, and order fulfillment.",
      },
      {
        image:
          "https://karenalexandra.com/wp-content/uploads/2025/09/Mia-The-New-Yorker-Overview-1024x576.png",
        imageAlt: "Karen Alexandra | Fashion E-Commerce Merchandiser",
      },
      {
        heading: "E-Commerce & Digital Merchandising",
        headingLevel: "h2",
        italic: true,
        list: [
          "Product Selection & Assortment Strategy: Curated the initial collection of dog apparel with a focus on quality, aesthetics, and storytelling, blending lifestyle inspiration with functional design. I evaluated trends, supplier options, and customer appeal to build a cohesive product assortment.",
          "Digital Merchandising & Online Presentation: Designed the Shopify store, organized collections, created visually compelling product pages, and optimized the homepage and category pages for both aesthetics and conversion. Each product was styled and presented to align with a luxury-cool lifestyle brand ethos.",
          "Marketing & Storytelling Integration: Developed brand narratives and campaigns that highlighted product uniqueness and origin, creating a seamless link between product curation, lifestyle storytelling, and online shopping experience.",
          "Data-Driven Optimization: Tracked site traffic, product performance, and conversion rates to refine merchandising, layout, and promotional strategies. Iteratively improved product placement and collection organization based on user behavior insights.",
          "Cross-Functional Collaboration: Coordinated with my partner on creative content and photoshoots to ensure that visual merchandising and product storytelling aligned with brand vision and digital merchandising objectives.",
        ],
      },
      {
        body: "This project allowed me to translate traditional fashion merchandising principles into a digital-first environment, managing product curation, online presentation, and the entire customer journey on the Shopify platform. Mia The New Yorker was not only a business venture but also a hands-on digital merchandising laboratory, solidifying my ability to drive sales and engagement through curated online experiences.",
      },
    ],
  },
  {
    slug: "case-study-little-black-shell",
    title: "Case Study: Little Black Shell",
    date: "2025-08-11",
    category: "Case Studies",
    heroImage:
      "https://karenalexandra.com/wp-content/uploads/2025/09/Little-Black-Shell-Taupe-Leather-1-of-4.jpg",
    heroAlt: "Karen Alexandra | Fashion E-Commerce Merchandiser",
    excerpt:
      "Little Black Shell was a luxury fashion blog and strategic portfolio built while studying fashion merchandising and working at Nordstrom — growing to 30,000 Instagram followers.",
    sections: [
      {
        heading: "Little Black Shell — Luxury Fashion Blog (2014–2016)",
        headingLevel: "h2",
        body: "Little Black Shell was originally created as a strategic portfolio while I was studying fashion merchandising and working at Nordstrom, with the goal of standing out for luxury fashion internships. Through the blog, I developed hands-on expertise in curating product selections, presenting fashion pieces online, and creating compelling digital assortments.",
      },
      {
        image:
          "https://karenalexandra.com/wp-content/uploads/2025/09/Little-Black-Shell-Overview-1024x576.png",
        imageAlt: "Little Black Shell Overview",
      },
      {
        heading: "Digital Merchandising & Content Experience",
        headingLevel: "h2",
        italic: true,
        list: [
          "Product Curation & Storytelling: I learned to select and showcase products in a way that resonated with a specific audience, translating physical merchandising instincts to a digital platform. I built an online environment where fashion and lifestyle content naturally guided consumer attention and engagement.",
          "Digital Merchandising Execution: Grew Instagram to 30,000 followers and maintained the website as a curated showcase of fashion collections, creating a seamless experience between imagery, product styling, and brand messaging.",
          "Collaboration & Brand Partnerships: Partnered with leading brands including Shopbop, Citizens of Humanity, Agolde, Sisley Paris, Makeup Forever, ASOS, and River Island, aligning product storytelling with brand identity while optimizing content for audience engagement.",
          "Analytical & Iterative Approach: Tested which visual formats, product groupings, and narratives drove engagement, building early experience in data-informed merchandising decisions — skills directly applicable to optimizing e-commerce performance.",
        ],
      },
      {
        body: "This experience was foundational in translating my luxury merchandising instincts into a digital-first approach, bridging the gap between in-store curation and online presentation — an expertise I now bring into digital merchandising.",
      },
      {
        image:
          "https://karenalexandra.com/wp-content/uploads/2025/09/IMG_8505-2-683x1024.jpg",
        imageAlt: "Karen Alexandra",
      },
      {
        heading: "Lifestyle Traveler (2016–2021)",
        headingLevel: "h2",
        body: "After pivoting from fashion to luxury travel, I rebranded my blog as Lifestyle Traveler, further developing my skills in digital product storytelling, curated content experiences, and audience engagement.",
      },
      {
        list: [
          "Curated Luxury Experiences: Crafted visually compelling content to showcase destinations, hotels, and travel products, focusing on aspirational presentation and storytelling — skills directly translatable to luxury product merchandising online.",
          "Cross-Channel Optimization: Managed website and social media (Instagram growth to 30k followers, Pinterest to 3M monthly viewers), ensuring product visuals, captions, and content layouts were optimized for user engagement and conversions.",
          "Brand Collaboration & Merchandising Alignment: Partnered with global brands and hospitality groups (Four Seasons Hotels & Resorts, IHG, Shopbop, River Island, and tourism boards) to create content that highlighted products and services in a curated, aspirational context.",
          "Data-Driven Insights: Monitored engagement metrics to refine content presentation, testing layout, imagery, and product/service placement — early experience in optimizing digital merchandising performance.",
        ],
      },
      {
        body: "This project allowed me to refine the art of curating aspirational experiences digitally, preparing me to translate merchandising instincts into a luxury e-commerce context.",
      },
    ],
  },
];

