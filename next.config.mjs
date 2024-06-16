import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
// import rehypeMathjax from 'rehype-mathjax'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import createMDX from '@next/mdx'
import hljs from 'highlight.js';
import langArm from 'highlight.js/lib/languages/armasm';
import langC from 'highlight.js/lib/languages/c';
import langBash from 'highlight.js/lib/languages/bash';
import langMakefile from 'highlight.js/lib/languages/makefile';


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
    rehypePlugins: [
        rehypeKatex,
        [rehypeHighlight, { languages: { arm: langArm, c: langC, bash: langBash, makefile: langMakefile } }]
    ],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
