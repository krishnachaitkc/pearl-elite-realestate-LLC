import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  // ADMIN USER
  // ============================================================
  const hashedPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pearlgateelite.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@pearlgateelite.com",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ============================================================
  // SITE SETTINGS — phone numbers stored here, NOT hardcoded
  // ============================================================
  const settings = [
    { key: "company_name", value: "Pearl Gate Elite Real Estate LLC", label: "Company Name", group: "general" },
    { key: "company_tagline", value: "Your Gateway to Premium UAE Properties", label: "Tagline", group: "general" },
    { key: "phone_primary", value: "0545005113", label: "Primary Phone", group: "contact" },
    { key: "phone_secondary", value: "0581718701", label: "Secondary Phone", group: "contact" },
    { key: "whatsapp_number", value: "971545005113", label: "WhatsApp Number (with country code)", group: "contact" },
    { key: "email_primary", value: "info@pearlgateelite.com", label: "Primary Email", group: "contact" },
    { key: "email_enquiries", value: "info@pearlgateelite.com", label: "Enquiries Email", group: "contact" },
    { key: "address", value: "Dubai, United Arab Emirates", label: "Address", group: "contact" },
    { key: "logo_url", value: "", label: "Logo URL", group: "branding" },
    { key: "favicon_url", value: "", label: "Favicon URL", group: "branding" },
    { key: "social_facebook", value: "", label: "Facebook URL", group: "social" },
    { key: "social_instagram", value: "", label: "Instagram URL", group: "social" },
    { key: "social_twitter", value: "", label: "Twitter/X URL", group: "social" },
    { key: "social_linkedin", value: "", label: "LinkedIn URL", group: "social" },
    { key: "social_youtube", value: "", label: "YouTube URL", group: "social" },
    { key: "business_hours", value: "Mon–Fri: 9am–6pm | Sat: 10am–4pm | Sun: Closed", label: "Business Hours", group: "general" },
    { key: "seo_default_title", value: "Pearl Gate Elite Real Estate | Premium UAE Properties", label: "Default SEO Title", group: "seo" },
    { key: "seo_default_description", value: "Discover premium properties in Dubai and across UAE. Buy, rent or invest with Pearl Gate Elite Real Estate — your trusted property partner.", label: "Default SEO Description", group: "seo" },
    { key: "google_maps_embed", value: "", label: "Google Maps Embed URL", group: "general" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ Site settings: ${settings.length} records`);

  // ============================================================
  // HOMEPAGE SECTIONS
  // ============================================================
  const sections = [
    { key: "hero_title", value: "Find Your Perfect\nProperty in UAE" },
    { key: "hero_subtitle", value: "Discover exclusive properties across Dubai and the UAE. Premium residences, investment opportunities and commercial spaces curated for discerning buyers." },
    { key: "hero_cta_primary", value: "Browse Properties" },
    { key: "hero_cta_secondary", value: "Contact Us" },
    { key: "stats_transactions", value: "500+" },
    { key: "stats_transactions_label", value: "Successful Transactions" },
    { key: "stats_properties", value: "1,200+" },
    { key: "stats_properties_label", value: "Properties Listed" },
    { key: "stats_clients", value: "800+" },
    { key: "stats_clients_label", value: "Happy Clients" },
    { key: "stats_experience", value: "10+" },
    { key: "stats_experience_label", value: "Years Experience" },
    { key: "why_us_title", value: "Why Choose Pearl Gate Elite" },
    { key: "why_us_subtitle", value: "We combine market expertise with personalised service to deliver exceptional real estate experiences across the UAE." },
    { key: "cta_title", value: "Ready to Find Your Dream Property?" },
    { key: "cta_subtitle", value: "Let our experts guide you to the perfect investment or home in the UAE." },
    { key: "about_title", value: "About Pearl Gate Elite" },
    { key: "about_subtitle", value: "Your trusted partner for premium real estate across the UAE." },
    {
      key: "about_story",
      value:
        "Founded with a vision to redefine the real estate experience in the UAE, Pearl Gate Elite Real Estate LLC has grown into one of Dubai's most trusted property consultancies. We combine deep market knowledge with a client-first approach to help buyers, sellers, and investors achieve their property goals.\n\nOur team of experienced agents brings together expertise across residential, commercial, and off-plan developments — from iconic towers in Downtown Dubai to serene villas on Palm Jumeirah.",
    },
    {
      key: "about_mission",
      value:
        "To deliver exceptional real estate experiences by providing expert guidance, transparent transactions, and personalised service that exceeds client expectations.",
    },
    {
      key: "about_vision",
      value:
        "To be the UAE's most trusted and respected real estate partner, known for integrity, innovation, and outstanding results.",
    },
    {
      key: "about_values",
      value: JSON.stringify([
        { title: "10+ Years Experience", description: "Over a decade of expertise navigating the UAE property market with consistent results." },
        { title: "1,200+ Properties", description: "An extensive portfolio spanning Dubai Marina, Downtown, Palm Jumeirah, and beyond." },
        { title: "Expert Agent Team", description: "Multilingual professionals dedicated to finding your perfect property match." },
        { title: "Top Investment Returns", description: "We identify high-yield opportunities and guide you to maximum investment returns." },
        { title: "Transparent Transactions", description: "Full transparency throughout the process — no hidden fees, no surprises." },
        { title: "End-to-End Support", description: "From property search to handover, we are with you at every step." },
      ]),
    },
    { key: "about_seo_title", value: "About Us | Pearl Gate Elite Real Estate" },
    {
      key: "about_seo_description",
      value: "Learn about Pearl Gate Elite Real Estate — your trusted UAE property partner with 10+ years of experience, 1,200+ listings, and expert agents.",
    },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { key: section.key },
      update: {},
      create: section,
    });
  }
  console.log(`✅ Homepage sections: ${sections.length} records`);

  // ============================================================
  // AMENITIES
  // ============================================================
  const amenities = [
    { name: "Swimming Pool", icon: "waves", category: "Recreation" },
    { name: "Gym", icon: "dumbbell", category: "Recreation" },
    { name: "Parking", icon: "car", category: "Utilities" },
    { name: "24/7 Security", icon: "shield", category: "Security" },
    { name: "Concierge", icon: "user-check", category: "Services" },
    { name: "Balcony", icon: "home", category: "Features" },
    { name: "Built-in Wardrobes", icon: "archive", category: "Features" },
    { name: "Central A/C", icon: "wind", category: "Utilities" },
    { name: "Children's Play Area", icon: "smile", category: "Recreation" },
    { name: "BBQ Area", icon: "flame", category: "Recreation" },
    { name: "Sauna", icon: "droplets", category: "Recreation" },
    { name: "Jacuzzi", icon: "waves", category: "Recreation" },
    { name: "Tennis Court", icon: "circle-dot", category: "Recreation" },
    { name: "Squash Court", icon: "circle-dot", category: "Recreation" },
    { name: "Retail Outlets", icon: "shopping-bag", category: "Services" },
    { name: "Restaurant", icon: "utensils", category: "Services" },
    { name: "Maid's Room", icon: "home", category: "Features" },
    { name: "Study Room", icon: "book-open", category: "Features" },
    { name: "Private Garden", icon: "tree-pine", category: "Features" },
    { name: "View of Sea", icon: "waves", category: "Views" },
    { name: "View of Burj Khalifa", icon: "building-2", category: "Views" },
    { name: "Community View", icon: "map", category: "Views" },
    { name: "Smart Home", icon: "cpu", category: "Technology" },
    { name: "EV Charging", icon: "zap", category: "Technology" },
    { name: "High Speed Internet", icon: "wifi", category: "Technology" },
    { name: "Pets Allowed", icon: "heart", category: "Policies" },
    { name: "Shared Pool", icon: "waves", category: "Recreation" },
    { name: "Private Pool", icon: "waves", category: "Recreation" },
    { name: "Elevator", icon: "arrow-up", category: "Utilities" },
    { name: "Storage Room", icon: "archive", category: "Features" },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }
  console.log(`✅ Amenities: ${amenities.length} records`);

  // ============================================================
  // OFFICE LOCATION
  // ============================================================
  await prisma.officeLocation.upsert({
    where: { id: "main-office" },
    update: {},
    create: {
      id: "main-office",
      name: "Pearl Gate Elite Real Estate — Main Office",
      address: "Dubai, United Arab Emirates",
      phone: "0545005113",
      email: "info@pearlgateelite.com",
      hours: "Mon–Fri: 9am–6pm | Sat: 10am–4pm",
      isPrimary: true,
      published: true,
    },
  });
  console.log(`✅ Office location seeded`);

  // ============================================================
  // SAMPLE TESTIMONIALS
  // ============================================================
  const testimonials = [
    {
      name: "Ahmed Al Rashidi",
      role: "Property Investor",
      content: "Pearl Gate Elite helped me find an excellent investment property in Dubai Marina. Their market knowledge and professionalism exceeded my expectations.",
      rating: 5,
      featured: true,
      published: true,
      order: 1,
    },
    {
      name: "Sarah Johnson",
      role: "Expat Resident",
      content: "Moving to Dubai was made so much easier with Pearl Gate Elite. They found us a beautiful apartment in JBR that perfectly matched our budget and lifestyle.",
      rating: 5,
      featured: true,
      published: true,
      order: 2,
    },
    {
      name: "Mohammed Al Fahim",
      role: "Business Owner",
      content: "Exceptional service from start to finish. The team at Pearl Gate Elite are true professionals who genuinely care about their clients' needs.",
      rating: 5,
      featured: true,
      published: true,
      order: 3,
    },
    {
      name: "Priya Sharma",
      role: "First-time Buyer",
      content: "I was nervous about buying my first property in Dubai, but Pearl Gate Elite made the entire process seamless and transparent. Highly recommend!",
      rating: 5,
      featured: false,
      published: true,
      order: 4,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log(`✅ Testimonials: ${testimonials.length} records`);

  // ============================================================
  // FAQs
  // ============================================================
  const faqs = [
    {
      question: "Can foreigners buy property in Dubai?",
      answer: "Yes, foreigners can purchase freehold properties in designated areas across Dubai. These areas include popular locations like Dubai Marina, Downtown Dubai, Palm Jumeirah, and many more.",
      category: "Buying",
      order: 1,
      published: true,
    },
    {
      question: "What is the process for buying a property in Dubai?",
      answer: "The process typically involves: selecting a property, signing a Memorandum of Understanding (MOU), paying a 10% deposit, transferring the title deed at the Dubai Land Department (DLD), and completing the handover.",
      category: "Buying",
      order: 2,
      published: true,
    },
    {
      question: "What fees are involved when buying a property in Dubai?",
      answer: "Typical fees include: Dubai Land Department (DLD) transfer fee of 4%, agency fee of 2%, mortgage registration fee (if applicable), and any service charges set by the developer.",
      category: "Buying",
      order: 3,
      published: true,
    },
    {
      question: "What is an off-plan property?",
      answer: "Off-plan properties are properties that are purchased directly from a developer before or during construction. They often offer attractive payment plans and the opportunity to buy at pre-completion prices.",
      category: "General",
      order: 4,
      published: true,
    },
    {
      question: "What documents do I need to rent a property in Dubai?",
      answer: "To rent a property in Dubai, you typically need: a valid passport, UAE residence visa, Emirates ID, and proof of income (salary certificate or bank statements).",
      category: "Renting",
      order: 5,
      published: true,
    },
    {
      question: "How do I schedule a property viewing?",
      answer: "You can schedule a viewing directly through our website by clicking 'Request Viewing' on any property page, calling us, or sending a WhatsApp message. Our team will arrange a convenient time for you.",
      category: "General",
      order: 6,
      published: true,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq }).catch(() => {});
  }
  console.log(`✅ FAQs: ${faqs.length} records`);

  // ============================================================
  // LOCATIONS
  // ============================================================
  const locations = [
    {
      slug: "dubai-marina",
      name: "Dubai Marina",
      description: "Dubai Marina is a stunning waterfront community with skyscrapers, restaurants, and the famous Marina Walk. One of Dubai's most sought-after residential areas.",
      highlights: ["Waterfront living", "World-class dining", "Vibrant nightlife", "Marina Walk", "Metro access"],
      published: true,
      order: 1,
    },
    {
      slug: "downtown-dubai",
      name: "Downtown Dubai",
      description: "Home to the iconic Burj Khalifa and Dubai Mall, Downtown Dubai is the city's beating heart — a prestigious address offering luxury living at its finest.",
      highlights: ["Burj Khalifa views", "Dubai Mall access", "Prestigious address", "Central location", "Luxury lifestyle"],
      published: true,
      order: 2,
    },
    {
      slug: "palm-jumeirah",
      name: "Palm Jumeirah",
      description: "The iconic palm-shaped island is one of the world's most recognisable man-made landmarks, offering ultra-luxury villas, apartments and hotels.",
      highlights: ["Private beach access", "Sea views", "Ultra-luxury residences", "World-famous landmark", "Exclusive community"],
      published: true,
      order: 3,
    },
    {
      slug: "jumeirah-village-circle",
      name: "Jumeirah Village Circle (JVC)",
      description: "JVC is a family-friendly community offering affordable yet quality living with parks, schools, and excellent connectivity across Dubai.",
      highlights: ["Family-friendly", "Affordable pricing", "Parks and greenery", "Central location", "Strong rental yields"],
      published: true,
      order: 4,
    },
    {
      slug: "business-bay",
      name: "Business Bay",
      description: "A thriving business and residential hub adjacent to Downtown Dubai, offering modern apartments with stunning canal and city views.",
      highlights: ["Canal views", "Close to Downtown", "Business hub", "Modern apartments", "Investment hotspot"],
      published: true,
      order: 5,
    },
    {
      slug: "arabian-ranches",
      name: "Arabian Ranches",
      description: "A prestigious gated villa community offering spacious homes in a serene, green setting — perfect for families seeking space and privacy.",
      highlights: ["Gated community", "Golf course", "Spacious villas", "Family lifestyle", "Peaceful environment"],
      published: true,
      order: 6,
    },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });
  }
  console.log(`✅ Locations: ${locations.length} records`);

  // ============================================================
  // DEVELOPERS
  // ============================================================
  const developers = [
    {
      slug: "emaar-properties",
      name: "Emaar Properties",
      description: "Emaar Properties is one of the world's largest real estate developers, responsible for iconic projects like Downtown Dubai and Burj Khalifa.",
      website: "https://www.emaar.com",
      featured: true,
      published: true,
    },
    {
      slug: "damac-properties",
      name: "DAMAC Properties",
      description: "DAMAC Properties is a leading luxury real estate developer in the Middle East, delivering luxury residential, commercial and leisure properties.",
      website: "https://www.damacproperties.com",
      featured: true,
      published: true,
    },
    {
      slug: "nakheel",
      name: "Nakheel",
      description: "Nakheel is a world-leading developer and a major contributor to Dubai's iconic palm-shaped islands and other landmark projects.",
      website: "https://www.nakheel.com",
      featured: true,
      published: true,
    },
    {
      slug: "meraas",
      name: "Meraas",
      description: "Meraas is a Dubai-based developer known for innovative mixed-use destinations that blend lifestyle, retail and residential spaces.",
      website: "https://www.meraas.com",
      featured: false,
      published: true,
    },
    {
      slug: "sobha-realty",
      name: "Sobha Realty",
      description: "Sobha Realty is known for developing luxury properties with exceptional quality craftsmanship and attention to detail across Dubai.",
      website: "https://www.sobharealty.com",
      featured: true,
      published: true,
    },
  ];

  for (const dev of developers) {
    await prisma.developer.upsert({
      where: { slug: dev.slug },
      update: {},
      create: dev,
    });
  }
  console.log(`✅ Developers: ${developers.length} records`);

  // ============================================================
  // AGENTS
  // ============================================================
  const agents = [
    {
      slug: "sarah-al-mansouri",
      name: "Sarah Al Mansouri",
      designation: "Senior Property Consultant",
      phone: "0545005113",
      whatsapp: "971545005113",
      email: "sarah@pearlgateelite.com",
      bio: "Sarah brings over 8 years of experience in Dubai's luxury real estate market. Specialising in high-end residential properties across Dubai Marina and Palm Jumeirah.",
      languages: ["English", "Arabic"],
      featured: true,
      active: true,
      order: 1,
    },
    {
      slug: "james-wilson",
      name: "James Wilson",
      designation: "Investment Property Specialist",
      phone: "0581718701",
      whatsapp: "971581718701",
      email: "james@pearlgateelite.com",
      bio: "James specialises in off-plan and investment properties, helping international investors navigate Dubai's property market with confidence.",
      languages: ["English", "French"],
      featured: true,
      active: true,
      order: 2,
    },
    {
      slug: "aisha-al-rashid",
      name: "Aisha Al Rashid",
      designation: "Residential Property Consultant",
      phone: "0545005113",
      whatsapp: "971545005113",
      email: "aisha@pearlgateelite.com",
      bio: "Aisha is passionate about helping families find their perfect home in Dubai. With expertise in JVC, Arabian Ranches and Business Bay.",
      languages: ["English", "Arabic", "Urdu"],
      featured: true,
      active: true,
      order: 3,
    },
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { slug: agent.slug },
      update: {},
      create: agent,
    });
  }
  console.log(`✅ Agents: ${agents.length} records`);

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Admin login: admin@pearlgateelite.com");
  console.log("🔑 Password: Admin@123456");
  console.log("⚠️  Change your password after first login!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
