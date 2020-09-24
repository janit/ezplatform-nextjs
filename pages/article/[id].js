import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'

let graphqlApiUrl = 'https://admin.master-7rqtwti-fjzy7hoydtwgm.eu-2.platformsh.site/graphql?live=true'

const fetcher = (query) =>
  fetch(graphqlApiUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export default function Article() {

  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(`
  
  {content
    {article(id: ${id})
      {title,
        intro{html5}
        body{html5}
      }
    }
  }

  `, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const { content } = data;
  
  return (
    <div>
      <Head>
        <title>{content.article.title}</title>
      </Head>
      <main>
        <h1>{content.article.title}</h1>
        <div dangerouslySetInnerHTML={{__html: content.article.body.html5}}></div>
      </main>
    </div>
  )
}