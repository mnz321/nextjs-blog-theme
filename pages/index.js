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
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto mb-4 rounded"
                  />
                )}
                {post.pubDate && (
                  <p className="mb-3 font-bold uppercase opacity-60">
                    {post.pubDate}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl">{post.title}</h2>
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

export async function getStaticProps() {
  const res = await fetch('https://feeds.bbci.co.uk/news/world/asia/rss.xml');
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
    blogTitle: 'Latest Assamese News',
    footerText: '© 2024 Assamese Khaar Khuwa News',
  };

  return { props: { posts: items, globalData } };
}
