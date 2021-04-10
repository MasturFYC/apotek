import { iCategory } from '../interfaces'

const fetcher = async (url: string): Promise<iCategory[]> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
  const data: iCategory[] | any = await res.json();

  if (data.invalid) {
    const pageRes = await fetch(location.href)
    if (pageRes.status === 200) {
      location.reload()
    }
  }

  if (res.status !== 200) {
    throw new Error(data.message)
    //return [];
  }

  return data;
}

export default fetcher;
