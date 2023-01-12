import Head from "next/head";
import Image from "next/image";
// import { MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';


export default function CustomerPage({ customers }){
  console.log(customers);
  return(
    <>
      <Head>
        <title>{customers.seoTitle}</title>
        <meta
          name="description"
          content={customers.seoDescription}
        />
        <meta name="robots" content="noindex,nofollow"></meta>
      </Head>
      <div className="container mx-auto my-10">

        <div className="hero-banner py-10">
          <Image className="" 
            src={customers.heroBannerImage.url} 
            alt="" 
            width={300}
            height={200}
          />
        </div>
        <div className="logo py-10">
          <Image className="" 
            src={customers.companyLogo.url} 
            alt="" 
            width={300}
            height={200}
          />
        </div>
        <div className="py-10">
          {customers.heroTitle}
          <br />
          {customers.heroDescription}
        </div>
        <div className="before-cb py-10">
          {
            customers ? documentToReactComponents(customers.beforeChargebee.json) : "" 
          }
        </div>
        <div className="after-cb py-10">
          {
            customers ? documentToReactComponents(customers.afterChargebee.json) : "" 
          }
        </div>
        <div className="maincontent py-10">
          {
            customers ? documentToReactComponents(customers.mainContent.json) : "" 
          }
        </div>
        <div className="tech-stack py-10">
          {
            customers ? documentToReactComponents(customers. addressAndTechStack.json ) : "" 
          }
        </div>
        <div className="testimonial py-10">
          <Image className="" 
            src={customers.testimonialImage.url} 
            alt="" 
            width={300}
            height={200}
          />
          <p>{customers.testimonialAuthor }</p>
          <p>{customers.testimonialDescription }</p>
        </div>
      </div>
    </> 
  )
}
  
// const options = {
//   renderMark: {
//     [MARKS.BOLD]: text => <span style={{fontSize:"100px"}}>{text}</span>,
//     [MARKS.ITALIC]: text => <span style={{fontSize:"150px"}}>{text}</span>,
//     [MARKS.UNDERLINE]: text => <span style={{ textUnderlineOffset:'0.5rem' }}>{text}</span>,
//   }, 
// };

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
                    items{
                      seoTitle
                      seoDescription
                      heroBannerImage{
                        url
                      }
                      companyLogo{
                        url
                      }
                      heroTitle
                      heroDescription
                      testimonialImage{url}
                      testimonialAuthor
                      testimonialDescription
                      beforeChargebee{
                        json
                        links{
                          entries{
                            inline{
                              sys{
                                id
                              }
                              __typename
                              ... on CaseStudies {
                                seoTitle
                              }
                            }
                          }
                        }
                      }
                      afterChargebee{
                        json
                        links{
                          entries{
                            inline{
                              sys{
                                id
                              }
                              __typename
                              ... on CaseStudies {
                                seoTitle
                              }
                            }
                          }
                        }
                      }
                      mainContent{
                        json
                        links{
                          entries{
                            inline{
                              sys{
                                id
                              }
                              __typename
                              ... on CaseStudies {
                                seoTitle
                              }
                            }
                          }
                        }
                      }
                      addressAndTechStack{
                        json
                        links{
                          entries{
                            inline{
                              sys{
                                id
                              }
                              __typename
                              ... on CaseStudies {
                                seoTitle
                              }
                            }
                          }
                        }
                      }
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
