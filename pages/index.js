import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import SEO from '../components/SEO';

export default function Index({ posts, globalData }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="mb-12 text-3xl text-center lg:text-5xl">
          {globalData.blogTitle}
        </h1>
        <ul className="w-full">
          {posts.map((post, index) => (
            <li
              key={index}
              className="transition bg-white border border-b-0 border-gray-800 md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 dark:border-white border-opacity-10 dark:border-opacity-10 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                href={post.link}
                className="block px-6 py-6 lg:py-10 lg:px-16 focus:outline-none focus:ring-4"
              >
                {/* Display the publication date */}
                {post.pubDate && (
                  <p className="mb-3 font-bold uppercase opacity-60">
                    {post.pubDate}
                  </p>
                )}
                
                {/* Display the title */}
                <h2 className="text-2xl md:text-3xl">{post.title}</h2>
                
                {/* Display the image below title and above description */}
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto my-4 rounded"
                  />
                )}
                
                {/* Display the description */}
                {post.description && (
                  <p className="mt-3 text-lg opacity-60">
                    {post.description}
                  </p>
                )}
                
                <ArrowIcon className="mt-4" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}
async function parseRssFeed(rssUrl) {
  try {
    const response = await fetch(rssUrl);
    const text = await response.text();

    // Parse the RSS XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // Loop through each <item>
    const items = xmlDoc.querySelectorAll("item");
    for (let item of items) {
      const title = item.querySelector("title").textContent;
      const link = item.querySelector("link").textContent;
      const description = item.querySelector("description").textContent;

      // Fetch the Open Graph image from the article page
      const imageUrl = await getImageFromPage(link);

      // Display formatted item with image
      console.log({
        title,
        link,
        imageUrl,  // This is the Open Graph image URL
        description: description.replace(/<!\[CDATA\[|\]\]>/g, "") // Remove CDATA
      });
    }
  } catch (error) {
    console.error("Error parsing the RSS feed:", error);
  }
}
async function getImageFromPage(articleUrl) {
  try {
    const response = await fetch(articleUrl);
    const text = await response.text();
    
    // Parse the HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Find the og:image meta tag
    const ogImage = doc.querySelector('meta[property="og:image"]');
    return ogImage ? ogImage.getAttribute('content') : null;
  } catch (error) {
    console.error("Error fetching the article page:", error);
    return null;
  }
}
export async function getStaticProps() {
  //const res = await fetch('https://feeds.bbci.co.uk/news/world/asia/rss.xml');
  const res= await fetch('https://news.google.com/rss/search?q=guwahati&hl=en-IN&gl=IN&ceid=IN:en');
  const rssText = await res.text();

  // Parse XML manually using regex to extract items
  const items = [...rssText.matchAll(/<item>(.*?)<\/item>/gs)].map((match) => {
    const item = match[1];
    
    // Helper function to clean CDATA tags
    const cleanCDATA = (str) => str?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();

    return {
      title: cleanCDATA(item.match(/<title>(.*?)<\/title>/)?.[1] || ''),
      link: item.match(/<link>(.*?)<\/link>/)?.[1] || '',
      pubDate: item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '',
      description: cleanCDATA(item.match(/<description>(.*?)<\/description>/)?.[1] || ''),
      image: item.match(/<media:thumbnail[^>]*url="([^"]+)"[^>]*>/)?.[1] || '', // Extract thumbnail URL
    };
  });

  const globalData = {
    name: 'Assamese Khaar Khuwa News',
    blogTitle: 'Latest News',
    footerText: '© 2024 Assamese Khaar Khuwa News',
  };

  return { props: { posts: items, globalData } };
}


