import { async } from "regenerator-runtime";


const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

  
export const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url) , timeout(10)]);
    const data = await res.json();
    if(!res.ok) throw new Error(`${data.message}`)
    return data;

  } catch (error) {
    throw error;
  }
   
}

export const sendJson = async function (url , uploadData) {
  try {
    const fetchPro = fetch(url , {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(uploadData)
    })
    const res = await Promise.race([fetchPro , timeout(10)]);
    const data = await res.json();
    if(!res.ok) throw new Error(`${data.message}`)
    return data;

  } catch (error) {
    throw error;
  }
   
}