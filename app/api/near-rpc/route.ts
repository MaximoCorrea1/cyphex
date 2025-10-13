export async function POST(request: Request){

  const requestBody = await request.json();

  
  const response = await fetch("https://test.rpc.fastnear.com", {
    method: "POST",
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify(requestBody)

  });

  const data =  await response.json();
  return Response.json(data);

}