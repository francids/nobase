import { Hono } from 'hono';
import { Layout } from './components/Layout';

const overviewRoutes = new Hono();

overviewRoutes.get('/', (c) => {
  type Product = {
    title: string;
    url: string;
  };

  const products: Product[] = [
    { title: 'Collections', url: '/dashboard/collections' },
    { title: 'Files', url: '/dashboard/files' },
    { title: 'Users', url: '/dashboard/users' },
    { title: 'API', url: '/' },
  ];

  const ProductFC = (product: Product) => (
    <a
      href={product.url}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        background: 'none',
        boxShadow: 'none',
      }}
    >
      <article style={{ padding: '2rem' }}>
        <strong>{product.title}</strong>
      </article>
    </a>
  );

  return c.html(
    <Layout style={{ userSelect: 'none' }} title="Overview">
      <h1>Overview</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
      >
        {products.map((product) => (
          <ProductFC {...product} />
        ))}
      </div>
    </Layout>
  );
});

export default overviewRoutes;
