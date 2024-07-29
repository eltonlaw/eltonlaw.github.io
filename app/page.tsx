import { NextPage } from 'next';
import Blog from 'app/blog/page';
import OpenSource from 'app/open_source/page';
import Wiki from 'app/wiki/page';

const HomePage: NextPage = ({characters}: any) => {
  return (
    <div>
      <Blog/>
      <OpenSource/>
    </div>
  )
}

export default HomePage
