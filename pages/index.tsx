import Link from 'next/link';
import { BiPlus } from 'react-icons/bi'
import Head from 'next/head';
import useUser from '@libs/client/useUser';
import useSWR from 'swr';
import Item from '@components/item';
import { Posting } from '@prisma/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface PostingWithFav extends Posting {
  _count: { favs: number }
}

interface PostingsResponse {
  ok: boolean,
  postings: PostingWithFav[];
}

export default function Home() {
  const { user, isLoading } = useUser();
  const { data, error } = useSWR<PostingsResponse>('/api/tweet');
  const router = useRouter();
  useEffect(() => {
    if (error) {
      console.log('error가 있다!', error)
      router.push('/before-login')
    }
    if (data) {
      console.log('data가 있다!', data)
    }
  })
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      {isLoading ? <span>Loading...</span>
        :
        <div className="flex flex-col space-y-5 divide-y">
          {!data?.postings?.length &&
            <div className='flex flex-col'>
              <span className='py-10 text-center'>게시물이 존재하지 않습니다. 😢</span>
              <span className='py-10 text-center'>+ 버튼을 눌러 첫번째 게시물을 만들어 보세요!</span>
            </div>}
          {data?.postings?.map((posting) => (
            <Item
              id={posting.id}
              key={posting.id}
              title={posting.title}
              description={posting.description}
              createAt={posting.createdAt}
              hearts={posting._count.favs}
              comments={1}
              userName={user?.name}
            />
          ))}
          <Link href='/tweet/upload'>
            <span className='w-10 h-10  bg-lime-800 flex justify-center items-center absolute bottom-5 right-5 rounded-md'><BiPlus size="24" color="white" /></span>
          </Link>
        </div>}
    </>
  );
}
