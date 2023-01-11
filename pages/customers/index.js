import Head from "next/head";
import Image from "next/future/image";
import Link from "next/link";



export default function CustomersPage({customers}){
  console.log(customers);
  return(
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow"></meta>
        <title>Customers & Testimonials - Chargebee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto my-8">
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <li key={customer.slug} className="flex col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <Link href={`customers/${customer.slug}`} passHref> 
                <a>
                  <div className="space-x-6 p-6">
                    <div className="flex-1">
                      <p className="mt-1 text-sm text-gray-500">{customer.heroTitle}</p>
                    </div>
                    <div className="mt-4">
                      <Image className="" 
                        src={customer.companyLogo.url} 
                        alt="" 
                        width={300}
                        height={200}
                      />
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
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
                heroTitle
                companyLogo{url}
                slug
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