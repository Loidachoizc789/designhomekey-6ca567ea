import { Helmet } from "react-helmet-async";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}

const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/eYs6YXAZ9gZLsgQ9VzAYz4s2Gx62/uploads/1769290787813-ChatGPT Image Jan 25, 2026, 04_19_34 AM_upscayl_4x_upscayl-standard-4x (2).png";

const SEOHead = ({
  title = "DesignHomeKey - Thiết kế 3D, 2D & Virtual Production",
  description = "Dịch vụ thiết kế phim trường 3D, thiết kế 2D, model 3D và nội ngoại thất chuyên nghiệp. Virtual Production sets cho livestream, talkshow & events.",
  keywords = "thiết kế 3D, phim trường 3D, virtual production, thiết kế 2D, model 3D, nội thất, ngoại thất, livestream, talkshow, events, DesignHomeKey",
  image,
  url = "https://unreal-stage-hub.lovable.app",
  type = "website",
}: SEOHeadProps) => {
  const { value: ogSetting } = useSiteSetting("og_image");
  const { value: twSetting } = useSiteSetting("twitter_image");
  const { value: faviconSetting } = useSiteSetting("favicon");

  const ogImage = (ogSetting as any)?.url || image || DEFAULT_IMAGE;
  const twitterImage = (twSetting as any)?.url || image || ogImage;
  const faviconUrl = (faviconSetting as any)?.url || "/favicon.png";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DesignHomeKey",
    url: url,
    logo: ogImage,
    description: description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-962-968-388",
      contactType: "customer service",
      availableLanguage: ["Vietnamese", "English"],
    },
    sameAs: [
      "https://www.facebook.com/61587057484656",
      "https://zalo.me/0962968388",
    ],
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Virtual Production & 3D Design",
    provider: {
      "@type": "Organization",
      name: "DesignHomeKey",
    },
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dịch vụ thiết kế",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thiết kế 3D / Phim trường 3D",
            description: "Virtual production sets cho livestream, talkshow & events",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thiết kế 2D",
            description: "Thiết kế đồ họa 2D chuyên nghiệp",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Model 3D / Assets",
            description: "Tạo model và assets 3D chất lượng cao",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nội ngoại thất",
            description: "Thiết kế và render nội ngoại thất",
          },
        },
      ],
    },
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="DesignHomeKey" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <link rel="icon" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="DesignHomeKey" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
