import Head from 'next/head'
import Link from 'next/link'
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

export default function Home() {

  const { data, error } = useSWR(`
  
  {content
    {articles  
      {edges
        {node
          {
            title
            intro {
              html5
            }
            _content {
              id
            }
          }
        }
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
        <title>All articles</title>
      </Head>
      <main>
        <h1>All articles</h1>
        <ul>
        {content.articles.edges.map((article, i) => (
            <li key={i}>
              <Link href="/article/[id]" as={`/article/${article.node._content.id}`}><a>{article.node.title}</a></Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}