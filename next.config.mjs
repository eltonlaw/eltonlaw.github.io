import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
// import rehypeMathjax from 'rehype-mathjax'
import rehypeKatex from 'rehype-katex'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    // rehypePlugins: [rehypeMathjax],
    rehypePlugins: [rehypeKatex],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
