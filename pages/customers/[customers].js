import Head from "next/head";

export default function CustomerPage({ customers }){
  return(
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow"></meta>
      </Head>
      <h1>{ customers.seoTitle }</h1>
      <h6>{ customers.slug }</h6>
    </> 
  )
}
  

export async function getStaticProps({ params }) {
  const { customers } = params;
    
  const result = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
              query GetCaseStudies($slug: String!) {
                caseStudiesCollection(
                    where: {
                      slug: $slug
                    },
                    limit: 1
                  ){
                    items {
                        slug
                        seoTitle
                        seoDescription
                        seoNoIndex
                        productCategory
                        customerLogo
                        heroBannerImage{
                          url
                        }
                        seoImage{
                          url
                        }
                        heroBannerDescription
                    }
                  }
                }
            `,
        variables: {
          slug: customers,
        },
      }),
    },
  );
    
  if (!result.ok) {
    console.error(result);
    return {};
  }
    
  const { data } = await result.json();
    
  const [customerData] = data.caseStudiesCollection.items;
  console.log("Regeneration files")
  return {
    props: { customers: customerData },
    revalidate:10
  };
}
    
export async function getStaticPaths() {
  const result = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
                query {
                  caseStudiesCollection {
                    items {
                      slug
                      seoTitle
                    }
                  }
                }
              `,
      }),
    },
  );
      
  if (!result.ok) {
    console.error(result);
    return {};
  }
      
  const { data } = await result.json();
  const customerSlugs = data.caseStudiesCollection.items;
      
  const paths = customerSlugs.map(({ slug }) => {
    return {
      params: { customers: slug },
    };
  });
      
  return {
    paths,
    fallback: false,
  };
}
