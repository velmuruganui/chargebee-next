import Head from "next/head";
import Link from "next/link";

export default function CustomersPage({customers}){
  return(
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow"></meta>
        <title>Customers & Testimonials - Chargebee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ul>
          {
            customers.map((customer) => (
              <li key={customer.slug}>
                <Link href={`customers/${customer.slug}`} passHref> 
                  <a>{customer.slug} - { customer.seoTitle }</a> 
                </Link>
              </li>
            ))
          };
        </ul>
      </div>
    </>
  )
}


export async function getStaticProps(){
  const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
        'Content-Type': 'application/json', 
      },
      body:JSON.stringify({
        query: `
          query {
            caseStudiesCollection{
              items{
                slug
                seoTitle
              }
            }
          }
        `
      })
    })


  if(!result.ok){
    console.error(result);
    return{};
  }

  const { data } = await result.json();
  const customers = data.caseStudiesCollection.items;

  return{
    props: {
      customers,
    },
    revalidate:10
  };
}