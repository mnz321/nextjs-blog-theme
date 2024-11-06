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

  // Parse XML to extract data
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');

  // Extract the data you want from each RSS item
  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    pubDate: item.querySelector('pubDate')?.textContent,
    description: item.querySelector('description')?.textContent,
  }));

  const globalData = {
    name: 'Your Blog Name',
    blogTitle: 'Latest Asia News',
    footerText: '© 2024 Your Blog Name',
  };

  return { props: { posts, globalData } };
}
