import { NextPage } from 'next';
import Blog from 'app/blog/page';
import Wiki from 'app/wiki/page';

const HomePage: NextPage = ({characters}: any) => {
  return (
    <div>
      <Blog/>
      <Wiki/>
    </div>
  )
}

export default HomePage
