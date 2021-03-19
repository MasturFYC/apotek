import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iCategory } from '../../components/interfaces'
import { revalidationOptions, categoryFecther } from '../../components/fetcher'
import { optionCSS } from 'react-select/src/components/Option'

const initCategory: iCategory = {
  id: 0,
  name: '',
  products: []
}

export default function categoriesPage() {
  const { categories, isLoading, isError, reload } = useCategory();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [category, setCategory] = useState(initCategory);

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>
  
  const setSelectedCategory = (item: iCategory, index: number) => {
    setCategory(item);
    setCurrentIndex(index);
  }

  return (
    <Layout home menuActive={2}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'p-3 bg-light'}>

      <h1 className={'m7-3 py-3'}>{category.name}</h1>
      <section key={'cat-section-content'} className={'container bg-light border rounded-3 m-0 p-0'}>
        {categories && categories.map((item: iCategory, index: number) => (
          <div key={`cat-key-${index}`}
            className={`${item.id !== 0 && 'border-bottom'} ${(index % 2 === 0 && 'bg-white rounded-top')}`}
            onClick={() => { setSelectedCategory(item, index) }}
          >
            <div key={`div-key-${index}`}>
              {item.id === 0 ? 'New Category' : item.name}
            </div>
            {currentIndex === index &&
              <React.Fragment>
                <EditCategory
                  key={`edit-key-${index}`}
                  data={item}
                  index={categories.length == index ? 0 : index}
                  updateCommand={(e: { data: iCategory, options: string }) => {
                    reload(e.data, e.options, index)
                    console.log(e.data)
                  }} />
              </React.Fragment>
            }
          </div>
        ))}
      </section>
      </section>
    </Layout>
  )
}


type EditCategoryParam = {
  data: iCategory;
  index: number;
  updateCommand: Function;
}

const EditCategory = ({ data, updateCommand, index }: EditCategoryParam) => {
  const [category, setCategory] = useState(initCategory);

  React.useEffect(() => {
    let isLoaded = false;

    if (!isLoaded) {
      setCategory(data);
    }

    return () => {
      isLoaded = true;
    }
  }, [data])


  const updateData = async () => {
    const res = await fetch(`/api/category/${category.id}`, {
      method: category.id === 0 ? 'POST' : 'PUT',
      body: JSON.stringify(category)
    })

    const data: any = await res.json()

    if (res.status !== 200) {
      alert(data.message)
    } else {
      updateCommand({ data: data, options: category.id === 0 ? 'insert' : 'update' })
      setCategory(data);
    }

    return data
  }


  const deleteData = async () => {
    const res = await fetch(`/api/category/${category.id}`, {
      method: 'DELETE'
    })

    const data: any = await res.json()

    if (res.status !== 200) {
      alert(data.message)
    } else {
      updateCommand({ data: data, options: category.id === 0 ? 'insert' : 'update' })
    }

    return data
  }
  return (
    <div key={`form-key-${index}`} className={`${index % 2 === 0 && 'rounded-top '}bg-white p-3 m-0`}>
      <div className={'row'}>
        <div className={'col-3'}>Nama:</div>
        <div className={'col'}><input type="text" autoFocus value={category.name}
          onChange={e => setCategory({ ...category, name: e.target.value })} /></div>
      </div>
      <div className={'row'}>
        <button onClick={(e) => updateData()} className='btn me-2 btn-outline-dark mt-3'>
          Save
        </button>
        <button onClick={(e) => deleteData()} className='btn me-2 btn-outline-danger mt-3'>
          Delete
        </button>
      </div>
    </div>
  )
}

const useCategory = () => {
  const baseUrl: any = () => '/api/category';
  const { data, error, mutate } = useSWR<iCategory[], Error>
    (baseUrl, categoryFecther, revalidationOptions);

  return {
    categories: data && [...data, initCategory],
    isLoading: !error && !data,
    isError: error,
    reload: (p: iCategory, options: string, index: number) => {
      switch (options) {
        case 'delete':
          data && mutate(data.filter(item => item.id !== p.id), false);
          break;
        case 'insert':
          data && mutate([...data, p], false)
          break;
        case 'update':
          if (data) {
            data.splice(index, 1, p);
            mutate(data, false)
          }
          break;
      }
    }
  }
}
