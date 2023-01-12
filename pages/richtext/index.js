
// import { documentToReactComponents } from '@contentful/rich-text-react-renderer';



export default function CustomersPage({customers}){
  console.log(customers);
  return(
    <>
      <div>
        <p>Hell</p>
        {/* { customers ? documentToReactComponents(customers.richText.json) : "" } */}
      </div>
    </>
  )
}



const query = `
        query {
            velTestingCollection(limit:2){
                    items{
                        richText{
                            json
                            links{
                                entries{
                                    inline{
                                        sys{id}
                                        ... on VelTesting{
                                            sys{id}
                                        }
                                    }
                                    block{
                                        sys{
                                            id
                                        }
                                    }
                                }
                                assets{
                                    block{
                                        sys{
                                           id
                                        }
                                        fileName
                                        url
                                    }
                                }
                            }
                        }
                    }
            }
        }
    `


// const options = {
//   renderMark: {
//     [MARKS.BOLD]: text => <span style={{fontSize:"100px"}}>{text}</span>,
//     [MARKS.ITALIC]: text => <span style={{fontSize:"150px"}}>{text}</span>,
//     [MARKS.UNDERLINE]: text => <span style={{ textUnderlineOffset:'0.5rem' }}>{text}</span>,
//   }, 
// };
      

export async function getStaticProps(){
  const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
        'Content-Type': 'application/json', 
      },
      body:JSON.stringify({query})
    })


  if(!result.ok){
    console.error(result);
    return{};
  }

  const { data } = await result.json();
  const customers = data.velTestingCollection.items;

  return{
    props: {
      customers,
    },
    revalidate:10
  };
}