// ==========================================================================
// HUSNAIN FASHION - Master Product Catalog
// Premium Pakistani Men's Clothing (Summer & Winter Collections)
// ==========================================================================

var PRODUCTS_DATA = [
    // ----------------------------------------------------------------------
    // CATEGORY: SHIRTS
    // Subcategories: Casual, Formal, Polo, Cotton, Printed
    // ----------------------------------------------------------------------
    {
        id: "HF-SH-01",
        name: "Imperial Oxford Casual Shirt",
        category: "shirts",
        subCategory: "casual-shirts",
        season: "summer",
        originalPrice: 2899,
        discountPrice: 2299,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 142,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "Woven from 100% long-staple combed cotton, this Oxford casual shirt combines relaxed comfort with sharp Pakistani tailoring. Ideal for casual Fridays and evening gatherings in Lahore or Karachi.",
        fabric: "100% Breathable Combed Cotton Oxford",
        fit: "Slim Modern Fit",
        care: "Machine wash cold, warm iron, do not bleach",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Sky Blue", hex: "#7ba4c9", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
            { name: "Crisp White", hex: "#f8f9fa", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "Olive Sage", hex: "#5b6e56", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Dusty Beige", hex: "#d8c7b5", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-02",
        name: "Royal Executive White Formal Shirt",
        category: "shirts",
        subCategory: "formal-shirts",
        season: "all-season",
        originalPrice: 3899,
        discountPrice: 2999,
        discountBadge: "23% OFF",
        isSpecialOffer: true,
        rating: 5.0,
        reviewsCount: 218,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "The quintessential gentleman's formal shirt. Crafted using 120s two-ply Giza Egyptian cotton with a spread cutaway collar, French double cuffs, and Mother of Pearl finish buttons.",
        fabric: "120s Two-Ply Egyptian Giza Cotton",
        fit: "Tailored Fit",
        care: "Dry clean recommended or gentle hand wash",
        images: [
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Pure White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "French Blue", hex: "#355e8a", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
            { name: "Powder Pink", hex: "#ebd3d6", image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80" },
            { name: "Silver Grey", hex: "#bcbcc0", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-03",
        name: "Luxe Pique Cotton Polo Shirt",
        category: "shirts",
        subCategory: "polo-shirts",
        season: "summer",
        originalPrice: 2499,
        discountPrice: 1899,
        discountBadge: "24% OFF",
        isSpecialOffer: false,
        rating: 4.8,
        reviewsCount: 96,
        isBestseller: false,
        isNewArrival: true,
        featured: true,
        description: "Heavyweight 240 GSM organic pique cotton with ribbed collar and tipped sleeves. Embroidered with the signature Husnain Fashion golden crest on the chest.",
        fabric: "100% Organic Pique Cotton (240 GSM)",
        fit: "Athletic Regular Fit",
        care: "Cold machine wash inside out",
        images: [
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Navy Blue", hex: "#0c1d36", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80" },
            { name: "Burgundy Wine", hex: "#5d1524", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80" },
            { name: "Jet Black", hex: "#111111", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80" },
            { name: "Forest Green", hex: "#1b382b", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-04",
        name: "Breezy Multani Cotton Summer Shirt",
        category: "shirts",
        subCategory: "cotton-shirts",
        season: "summer",
        originalPrice: 2199,
        discountPrice: 1699,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.7,
        reviewsCount: 88,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Sourced from premier cotton mills of Multan and Punjab. Ultra-light, airy, and moisture-wicking to keep you effortlessly cool throughout sweltering Pakistani summer days.",
        fabric: "Pure Multani Cotton & Slub Yarn",
        fit: "Relaxed Summer Fit",
        care: "Easy wash, air dry in shade",
        images: [
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Sand Beige", hex: "#dfd2be", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" },
            { name: "Mint Sage", hex: "#a8c0ab", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Pristine White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "Chambray Blue", hex: "#6384a6", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-05",
        name: "Karachi Sunset Artisan Printed Shirt",
        category: "shirts",
        subCategory: "printed-shirts",
        season: "summer",
        originalPrice: 2799,
        discountPrice: 2199,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 64,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Statement Cuban collar resort shirt featuring subtle contemporary botanical and geometric motifs. Silky rayon-cotton blend that moves with unmatched fluidity.",
        fabric: "Premium Viscose Rayon Cotton Blend",
        fit: "Camp Collar Relaxed Fit",
        care: "Gentle cold cycle, iron inside out",
        images: [
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Indigo Mosaic", hex: "#1e375a", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80" },
            { name: "Golden Flora", hex: "#c49a45", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
            { name: "Monochrome Botanical", hex: "#262626", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-06",
        name: "Savile Row Herringbone Formal Shirt",
        category: "shirts",
        subCategory: "formal-shirts",
        season: "winter",
        originalPrice: 3499,
        discountPrice: 2799,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 173,
        isBestseller: true,
        isNewArrival: false,
        featured: false,
        description: "Subtle textured herringbone weave in thick luxury cotton. Perfect under three-piece suits and tailored winter blazers for Pakistani weddings and corporate galas.",
        fabric: "100% Compact Herringbone Cotton",
        fit: "Slim Structured Fit",
        care: "Professional press or dry clean",
        images: [
            "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Powder Blue", hex: "#9bb8d3", image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80" },
            { name: "Classic White", hex: "#ffffff", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "Lavender Mist", hex: "#cdc6d9", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },

    // ----------------------------------------------------------------------
    // CATEGORY: TROUSERS
    // Subcategories: Formal, Casual, Chinos, Cotton, Jeans
    // ----------------------------------------------------------------------
    {
        id: "HF-TR-01",
        name: "Bespoke Italian Pleated Formal Trousers",
        category: "trousers",
        subCategory: "formal-trousers",
        season: "all-season",
        originalPrice: 4499,
        discountPrice: 3499,
        discountBadge: "22% OFF",
        isSpecialOffer: false,
        rating: 4.9,
        reviewsCount: 110,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "Double front pleats with brass side-adjusters eliminating the need for belts. Engineered with a crisp permanent crease and curtained waistband for maximum drape and poise.",
        fabric: "Poly-Viscose Wool-Touch Blend (Wrinkle Resistant)",
        fit: "Tapered Italian Fit",
        care: "Dry clean only",
        images: [
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Charcoal Grey", hex: "#363636", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80" },
            { name: "Midnight Navy", hex: "#111c2e", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Espresso Brown", hex: "#3e2d26", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
            { name: "Cream Ivory", hex: "#e8e3d5", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-02",
        name: "Tailored Smart Stretch Chinos",
        category: "trousers",
        subCategory: "chinos",
        season: "summer",
        originalPrice: 3499,
        discountPrice: 2899,
        discountBadge: "17% OFF",
        isSpecialOffer: false,
        rating: 4.8,
        reviewsCount: 156,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "The ultimate Pakistani wardrobe essential. 98% mercerized twill cotton infused with 2% elastane for unrestricted movement during commute, meetings, and dinners.",
        fabric: "98% Mercerized Cotton Twill, 2% Spandex",
        fit: "Slim Fit",
        care: "Cold machine wash with similar colors",
        images: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Khaki Camel", hex: "#c29b68", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
            { name: "Dark Navy", hex: "#162238", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
            { name: "Olive Green", hex: "#48533c", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
            { name: "Slate Grey", hex: "#636972", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80" },
            { name: "Off White", hex: "#f1eee7", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-03",
        name: "Raw Selvedge Denim Heritage Jeans",
        category: "trousers",
        subCategory: "jeans",
        season: "all-season",
        originalPrice: 4299,
        discountPrice: 3299,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 189,
        isBestseller: true,
        isNewArrival: false,
        featured: false,
        description: "13.5 oz authentic shuttle loom denim woven in Lahore. Copper rivets, YKK antique brass fly, and genuine leather back patch with gold embossing.",
        fabric: "13.5 oz Raw Cotton Denim with 1% Flex",
        fit: "Modern Straight / Tapered Ankle",
        care: "Wash rarely, inside out in cold water",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Deep Indigo", hex: "#1a2c4e", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
            { name: "Washed Vintage Blue", hex: "#4c6e94", image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80" },
            { name: "Onyx Black", hex: "#1a1a1a", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-04",
        name: "Everyday Stretch Cotton Trousers",
        category: "trousers",
        subCategory: "cotton-trousers",
        season: "summer",
        originalPrice: 2999,
        discountPrice: 2499,
        discountBadge: "16% OFF",
        isSpecialOffer: false,
        rating: 4.6,
        reviewsCount: 75,
        isBestseller: false,
        isNewArrival: false,
        featured: false,
        description: "Soft peached finish cotton with an elasticated hidden flex waistband. Designed for active professionals seeking polished appeal with sweatpants-level comfort.",
        fabric: "97% Peached Cotton, 3% Elastane",
        fit: "Comfort Regular Taper",
        care: "Machine wash warm, tumble dry low",
        images: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Beige Tan", hex: "#cbba9f", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
            { name: "Charcoal Ash", hex: "#4b4f56", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
            { name: "Navy Marine", hex: "#1f2a3e", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-05",
        name: "Urban Drawstring Casual Trousers",
        category: "trousers",
        subCategory: "casual-trousers",
        season: "summer",
        originalPrice: 3299,
        discountPrice: 2699,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.7,
        reviewsCount: 84,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Contemporary casual trousers with metallic tipped cotton drawstrings and clean ankle cuffs. Ideal pairing with loafers or minimal sneakers.",
        fabric: "Linen-Cotton Breathable Blend",
        fit: "Relaxed Taper",
        care: "Cold wash, hang dry",
        images: [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Oatmeal Stone", hex: "#d5cbbf", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Classic Black", hex: "#181818", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80" },
            { name: "Dusty Olive", hex: "#525749", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },

    // ----------------------------------------------------------------------
    // CATEGORY: COATS & WINTER COLLECTION
    // Subcategories: Formal Coats, Winter Coats, Blazers, Jackets, Wool Coats
    // ----------------------------------------------------------------------
    {
        id: "HF-CT-01",
        name: "Mayfair Camel Pure Wool Overcoat",
        category: "coats-winter",
        subCategory: "wool-coats",
        season: "winter",
        originalPrice: 14999,
        discountPrice: 11999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 5.0,
        reviewsCount: 167,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "The crown jewel of our Winter Collection. Made from 100% heavyweight virgin Australian wool with premium cupro satin lining. Notch lapels, horn buttons, and handcrafted tailored shoulders.",
        fabric: "100% Virgin Australian Wool, Satin Jacquard Lining",
        fit: "Tailored Overcoat Cut (Wear over suits or knitwear)",
        care: "Specialist dry clean only",
        images: [
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Camel Tan", hex: "#b48b55", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" },
            { name: "Charcoal Heather", hex: "#2f3136", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80" },
            { name: "Obsidian Black", hex: "#111111", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-02",
        name: "Savile Navy Double-Breasted Blazer",
        category: "coats-winter",
        subCategory: "blazers",
        season: "winter",
        originalPrice: 9999,
        discountPrice: 7999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 132,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "Iconic navy double-breasted blazer with embossed vintage gold buttons, wide peak lapels, and double back vents. A must-have for weddings in Islamabad, Lahore, and Karachi.",
        fabric: "Structured Wool-Rich Blend (80% Wool, 20% Silk-Touch Poly)",
        fit: "Sartorial Slim Fit",
        care: "Dry clean only",
        images: [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Royal Navy", hex: "#0b1b36", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Forest Emerald", hex: "#133126", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
            { name: "Burgundy Velvet", hex: "#4b1322", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-03",
        name: "Highland Thermal Quilted Winter Coat",
        category: "coats-winter",
        subCategory: "winter-coats",
        season: "winter",
        originalPrice: 10999,
        discountPrice: 8499,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 94,
        isBestseller: false,
        isNewArrival: true,
        featured: true,
        description: "Engineered for chilly northern winters, Murree retreats, and cold nights. Water-repellent matte outer shell packed with hypoallergenic micro-down thermal filling.",
        fabric: "Windproof Micro-Ripstop Outer, Down Alternative Core",
        fit: "Regular Winter Shell",
        care: "Gentle cold cycle or dry clean",
        images: [
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Matte Black", hex: "#1f1f1f", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80" },
            { name: "Steel Olive", hex: "#3b4737", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" },
            { name: "Deep Navy", hex: "#14243b", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-04",
        name: "Vintage Suede Bomber Jacket",
        category: "coats-winter",
        subCategory: "jackets",
        season: "winter",
        originalPrice: 7999,
        discountPrice: 5999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 121,
        isBestseller: true,
        isNewArrival: false,
        featured: true,
        description: "Crafted from supple faux goat suede with thick ribbed collar and hem. Features antique gold hardware and dual interior zippered security pockets.",
        fabric: "Premium Micro-Suede Leather with Quilted Satin Lining",
        fit: "Bomber Fit",
        care: "Specialist suede clean",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Cognac Tan", hex: "#9b6034", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" },
            { name: "Coffee Chocolate", hex: "#3b281c", image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80" },
            { name: "Pitch Black", hex: "#1a1a1a", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-05",
        name: "Windsor Check Formal Wool Coat",
        category: "coats-winter",
        subCategory: "formal-coats",
        season: "winter",
        originalPrice: 13999,
        discountPrice: 10999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 81,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Subtle Glen check pattern woven in Yorkshire wool blend. Single-breasted 3-button closure with velvet undercollar detail.",
        fabric: "75% Wool, 20% Polyamide, 5% Cashmere",
        fit: "Executive Tailored Fit",
        care: "Dry clean only",
        images: [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Grey Glen Plaid", hex: "#525254", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" },
            { name: "Navy Houndstooth", hex: "#1e2a3c", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" },
            { name: "Warm Taupe Check", hex: "#877868", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-06",
        name: "Artisan Leather Biker Jacket",
        category: "coats-winter",
        subCategory: "jackets",
        season: "winter",
        originalPrice: 9499,
        discountPrice: 7499,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 104,
        isBestseller: false,
        isNewArrival: false,
        featured: false,
        description: "Handcrafted in Sialkot, renowned for world-class leather mastery. Asymmetrical heavy brass zipper, notched lapel snap buttons, and padded diamond-stitched shoulders.",
        fabric: "Full-Grain Genuine Cowhide Leather",
        fit: "Rider Slim Fit",
        care: "Leather specialist treatment",
        images: [
            "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Stealth Black", hex: "#141414", image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80" },
            { name: "Distressed Whiskey", hex: "#5a3a24", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-07",
        name: "Belgravia Single-Breasted Linen Blazer",
        category: "coats-winter",
        subCategory: "blazers",
        season: "summer",
        originalPrice: 7999,
        discountPrice: 6499,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 62,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Unstructured, half-lined lightweight linen-cotton blazer. The ideal choice for summer garden weddings, rooftop soirees, and outdoor banquets in Pakistan.",
        fabric: "65% Pure Flax Linen, 35% Combed Cotton",
        fit: "Unstructured Modern Fit",
        care: "Dry clean only",
        images: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Warm Sand", hex: "#d8c5aa", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
            { name: "Pale Sky", hex: "#b4c7dc", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Ivory Ecru", hex: "#ede7da", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-08",
        name: "Nordic Double-Breasted Wool Peacoat",
        category: "coats-winter",
        subCategory: "wool-coats",
        season: "winter",
        originalPrice: 11999,
        discountPrice: 9499,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 118,
        isBestseller: true,
        isNewArrival: false,
        featured: false,
        description: "Heavy 32 oz Melton wool peacoat engineered to block freezing gusts. Anchored by anchor-engraved matte buttons and deep fleece-lined handwarmer pockets.",
        fabric: "80% Melton Wool, 20% Nylon for Durability",
        fit: "Classic Peacoat Silhouette",
        care: "Dry clean only",
        images: [
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Midnight Navy", hex: "#0e1a2f", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80" },
            { name: "Charcoal Black", hex: "#232323", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" },
            { name: "Camel", hex: "#ab8657", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },

    // Additional products to round out all categories thoroughly:
    {
        id: "HF-SH-07",
        name: "Monaco Riviera Striped Casual Shirt",
        category: "shirts",
        subCategory: "casual-shirts",
        season: "summer",
        originalPrice: 2399,
        discountPrice: 1999,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.7,
        reviewsCount: 52,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Vertical Bengal striped cotton shirt with a soft spread collar. Crisp, breathable, and effortlessly sophisticated with chinos.",
        fabric: "100% Fine Combed Cotton",
        fit: "Regular Modern",
        care: "Machine wash cold",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Blue & White Stripe", hex: "#4b79a1", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" },
            { name: "Beige & White Stripe", hex: "#baa791", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "Olive & White Stripe", hex: "#63745a", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-06",
        name: "Executive Wool-Blend Charcoal Trousers",
        category: "trousers",
        subCategory: "formal-trousers",
        season: "winter",
        originalPrice: 3999,
        discountPrice: 3199,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 97,
        isBestseller: false,
        isNewArrival: false,
        featured: false,
        description: "Flat-front tailored trousers designed for corporate boardrooms and winter weddings. Lined to the knee for zero friction against the skin.",
        fabric: "60% Wool, 38% Poly, 2% Elastane",
        fit: "Executive Slim Straight",
        care: "Dry clean recommended",
        images: [
            "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Charcoal Grey", hex: "#3a3a3a", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80" },
            { name: "Dark Navy", hex: "#152033", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Deep Heather", hex: "#4f4f52", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-09",
        name: "Karachi Evening Velvet Formal Blazer",
        category: "coats-winter",
        subCategory: "blazers",
        season: "winter",
        originalPrice: 9999,
        discountPrice: 7999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 5.0,
        reviewsCount: 140,
        isBestseller: true,
        isNewArrival: true,
        featured: true,
        description: "Opulent micro-pile velvet blazer tailored with satin shawl lapels. Designed specifically for Pakistani winter wedding receptions, mehendis, and Qawwali nights.",
        fabric: "Pure Micro-Velvet with Silk Lapel Trim",
        fit: "Sartorial Modern Fit",
        care: "Specialist dry clean only",
        images: [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Emerald Green", hex: "#0e3427", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80" },
            { name: "Royal Midnight Blue", hex: "#0b152d", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
            { name: "Burgundy Maroon", hex: "#4a0e1c", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-10",
        name: "Sherpa Lined Aviator Winter Jacket",
        category: "coats-winter",
        subCategory: "jackets",
        season: "winter",
        originalPrice: 8999,
        discountPrice: 7199,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 89,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Rugged exterior shell backed with ultra-warm plush sherpa fleece lining. Features double throat latch buckles and heavy-duty front zip.",
        fabric: "Waxed Weatherproof Canvas & Heavy Faux Sherpa",
        fit: "Relaxed Aviator Fit",
        care: "Wipe with damp cloth or specialist dry clean",
        images: [
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Raw Umber Brown", hex: "#4d3423", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80" },
            { name: "Coal Black", hex: "#161616", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" },
            { name: "Military Olive", hex: "#3e4738", image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-08",
        name: "Signature Johnny Collar Knit Polo",
        category: "shirts",
        subCategory: "polo-shirts",
        season: "summer",
        originalPrice: 2499,
        discountPrice: 1999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 78,
        isBestseller: true,
        isNewArrival: true,
        featured: false,
        description: "Open Johnny collar knit polo shirt crafted in fine gauge Egyptian cotton. Retro European aesthetic tailored for contemporary Pakistani gentlemen.",
        fabric: "100% Mercerized Fine Gauge Knit Cotton",
        fit: "Trim Modern Fit",
        care: "Hand wash cold, dry flat",
        images: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Biscuit Beige", hex: "#d2bca5", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80" },
            { name: "Midnight Navy", hex: "#131e33", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80" },
            { name: "Olive Moss", hex: "#47523f", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-09",
        name: "Paisley Heritage Printed Silk-Touch Shirt",
        category: "shirts",
        subCategory: "printed-shirts",
        season: "summer",
        originalPrice: 2899,
        discountPrice: 2399,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.7,
        reviewsCount: 47,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Intricate Persian and Mughal-inspired paisley print on featherlight silk-touch modal. A head-turner at formal brunches and soirees.",
        fabric: "Silky Modal & Combed Cotton Blend",
        fit: "Tailored Resort Fit",
        care: "Gentle machine wash inside out",
        images: [
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Royal Gold Paisley", hex: "#c99738", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
            { name: "Midnight Navy Paisley", hex: "#162544", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80" },
            { name: "Deep Ruby Paisley", hex: "#561a29", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-TR-07",
        name: "Vintage Stone-Washed Slim Jeans",
        category: "trousers",
        subCategory: "jeans",
        season: "all-season",
        originalPrice: 3899,
        discountPrice: 2999,
        discountBadge: "23% OFF",
        isSpecialOffer: false,
        rating: 4.8,
        reviewsCount: 134,
        isBestseller: true,
        isNewArrival: false,
        featured: false,
        description: "Artisan whiskered denim with micro-distressing and 4-way comfort stretch. Tailored through the thigh with a clean slim leg opening.",
        fabric: "98% Ring-Spun Denim Cotton, 2% Lycra",
        fit: "Slim Fit",
        care: "Cold wash inside out",
        images: [
            "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Vintage Light Wash", hex: "#6d93b8", image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80" },
            { name: "Dark Indigo", hex: "#192842", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
            { name: "Carbon Washed Grey", hex: "#3b3d41", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-11",
        name: "Diplomat Peak Lapel Formal Overcoat",
        category: "coats-winter",
        subCategory: "formal-coats",
        season: "winter",
        originalPrice: 14999,
        discountPrice: 11999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 5.0,
        reviewsCount: 77,
        isBestseller: false,
        isNewArrival: true,
        featured: false,
        description: "Impeccably tailored longline formal coat designed to be worn over tuxedos and bespoke sherwanis. Italian cashmere and wool blend with velvet lapel inlay.",
        fabric: "90% Cashmere-Wool Blend, 10% Mulberry Silk",
        fit: "Sartorial Longline Fit",
        care: "Specialist dry clean only",
        images: [
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Jet Black", hex: "#111111", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" },
            { name: "Midnight Blue", hex: "#0c172a", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" },
            { name: "Camel", hex: "#ae8654", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-CT-12",
        name: "Glacier Peak Down Parka Winter Coat",
        category: "coats-winter",
        subCategory: "winter-coats",
        season: "winter",
        originalPrice: 12999,
        discountPrice: 9999,
        discountBadge: "20% OFF",
        isSpecialOffer: true,
        rating: 4.9,
        reviewsCount: 114,
        isBestseller: true,
        isNewArrival: false,
        featured: false,
        description: "Engineered with 700 fill-power duck down and water-resistant Teflon-coated nylon. Detachable faux fur hood trim and internal snow skirt for extreme northern climates.",
        fabric: "Waterproof Micro-Ripstop Nylon, 700 Fill Down",
        fit: "Expedition Warmth Fit",
        care: "Gentle cold cycle or specialist down cleaner",
        images: [
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Arctic Navy", hex: "#0f1e36", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80" },
            { name: "Stealth Black", hex: "#171717", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" },
            { name: "Gunmetal Olive", hex: "#3f4a3e", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: "HF-SH-10",
        name: "Multan Handloom Slub Cotton Shirt",
        category: "shirts",
        subCategory: "cotton-shirts",
        season: "summer",
        originalPrice: 2299,
        discountPrice: 1799,
        discountBadge: "10% OFF",
        isSpecialOffer: true,
        rating: 4.8,
        reviewsCount: 61,
        isBestseller: false,
        isNewArrival: false,
        featured: false,
        description: "Traditional handloom-inspired slub weave that breathes effortlessly in the warmest Pakistani weather. Natural coconut shell buttons and mandarin band collar.",
        fabric: "100% Multani Slub Cotton Yarn",
        fit: "Band Collar Casual Fit",
        care: "Gentle cold wash, line dry in shade",
        images: [
            "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80"
        ],
        colors: [
            { name: "Clay Terracotta", hex: "#a45b46", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80" },
            { name: "Raw Cotton Cream", hex: "#f5f0e6", image: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80" },
            { name: "Indigo Slate", hex: "#364e6b", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"]
    }
];

// Sample Pakistani Customer Reviews
const CUSTOMER_REVIEWS = [
    {
        name: "Hamza Tariq",
        city: "Lahore, DHA Phase 5",
        rating: 5,
        date: "2 days ago",
        verified: true,
        product: "Mayfair Camel Pure Wool Overcoat",
        title: "Supreme quality, felt like wearing bespoke Savile Row",
        comment: "Ordered this for my brother's wedding in Islamabad. The wool fabric is thick, luxurious, and the camel color matches the photos 100%. Free delivery arrived in 24 hours via TCS in Lahore. Husnain Fashion is unmatched in Pakistan!"
    },
    {
        name: "Bilal Sheikh",
        city: "Karachi, Clifton",
        rating: 5,
        date: "5 days ago",
        verified: true,
        product: "Royal Executive White Formal Shirt",
        title: "Best formal shirt in Pakistan hands down",
        comment: "I usually buy imported shirts, but this Egyptian Giza cotton shirt blew me away. The cutaway collar stands perfectly under a tie or open, and the double cuffs feel regal. Cash on Delivery was seamless."
    },
    {
        name: "Zainab & Daniyal Raza",
        city: "Islamabad, F-7/2",
        rating: 5,
        date: "1 week ago",
        verified: true,
        product: "Karachi Evening Velvet Formal Blazer",
        title: "Stunning velvet texture & master fit",
        comment: "Got this for a winter Qawwali night. Everyone asked where I bought it! The velvet pile is deep emerald and doesn't crease. Order tracking kept me updated every step of the journey."
    },
    {
        name: "Usman Ghani",
        city: "Faisalabad",
        rating: 4.8,
        date: "2 weeks ago",
        verified: true,
        product: "Bespoke Italian Pleated Formal Trousers",
        title: "Side-adjusters are a game changer",
        comment: "Never wearing regular belted formal pants again. The brass adjusters and double pleats give that timeless Italian mafia silhouette. Fabric is wrinkle-resistant and breathable."
    },
    {
        name: "Dr. Aamir Qureshi",
        city: "Peshawar, Hayatabad",
        rating: 5,
        date: "3 weeks ago",
        verified: true,
        product: "Luxe Pique Cotton Polo Shirt",
        title: "Bought 3 with the 15% discount!",
        comment: "Took advantage of the Buy 3 Get 15% OFF offer. All three colors (Navy, Burgundy, Black) are vibrant. The golden embroidered crest looks very rich. Fast delivery to KPK."
    }
];

// Major Pakistani Cities for checkout shipping calculations and autocomplete
const PAKISTANI_CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", 
    "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", 
    "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur", 
    "Sheikhupura", "Gujrat", "Mardan", "Kasur", "Rahim Yar Khan", "Sahiwal"
];
