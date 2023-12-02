import type { GetStaticProps, NextPage } from 'next';
import { MDXProvider } from '@mdx-js/react';

import AppContainer from '../components/AppContainer.tsx';
import Post1 from './posts/2020-12-07-custom-rpi-01.mdx';
import Post2 from './posts/2022-09-19-custom-rpi-02.mdx';

const Blog = () => {
  return (
    <div>
      <MDXProvider>
        <Post2 />
        <Post1 />
      </MDXProvider>
    </div>
  )
}

const Home: NextPage = ({characters}: any) => {
  return (
    <AppContainer title="Elton Law" description="Personal blog of Elton Law">
      <Blog/>
    </AppContainer>
  )
}

export const getStaticProps: GetStaticProps = async(context) => {
  return {
    props: {
      characters: "123",
    }
  };
}

export default Home
