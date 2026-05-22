import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Anorthic Studio',
    short_name: 'Anorthic',
    description: 'AI Workflow Automation, Web Development, and Branding',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4e9d5',
    theme_color: '#cb272c',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
