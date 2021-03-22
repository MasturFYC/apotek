import { iCategory } from '../interfaces'

const fetcher = async (url: string): Promise<iCategory[]> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
  const data: iCategory[] | any = await res.json();

  if (res.status !== 200) {
    console.log(data.message)
    return [];
  }

  return data;
}

export default fetcher;
