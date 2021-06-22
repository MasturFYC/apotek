import Head from "next/head";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import useSWR from "swr";
import Layout, { siteTitle } from "../../components/layout";
import { iCategory } from "../../components/interfaces";
import { revalidationOptions, categoryFetcher } from "../../components/fetcher";
import { DivRow, FocusSpan } from "../../components/styles"; // ' components/styles'
//import ProductImage from '../public/images/product.svg'

const initCategory: iCategory = {
  id: 0,
  name: "",
  products: [],
};

export default function Home() {
  const { categories, isLoading, isError, reload } = useCategory();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);

  if (isError) return <div>{isError.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const setSelectedCategory = (index: number) => {
    setIsSelected(currentIndex === index ? !isSelected : true);
    setCurrentIndex(index);
  };

  const refreshData = (p: iCategory, options: string) => {
    switch (options) {
      case "delete":
        categories &&
          reload(
            categories.filter((item) => item.id !== p.id),
            false
          );
        setCurrentIndex(-1);
        break;
      case "insert":
        categories && reload([...categories, p], false);
        setCurrentIndex((categories && categories?.length + 1) || -1);
        break;
      case "update":
        if (categories) {
          const i = currentIndex;
          setCurrentIndex(-1);
          categories.splice(currentIndex, 1, p);
          reload(categories, false);
          setCurrentIndex(i);
        }
        break;
    }
  };

  return (
    <Layout home menuActive={2} heading={"Kategori Produk"}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {categories &&
        [...categories, initCategory].map((item: iCategory, index: number) => (
          <React.Fragment key={`fragment-${index}`}>
            <DivRow
              key={`cat-key-${index}`}
              isActive={currentIndex === index && isSelected}
            >
              <div className={"col-8 pt-1"}>
                <FocusSpan
                  role={"button"}
                  onClick={() => {
                    setSelectedCategory(index);
                  }}
                  className={"cust-name"}
                >
                  {item.id === 0 ? "New Category" : item.name}
                </FocusSpan>
              </div>
              {item.id !== 0 && (
                <div className={"col-4 col-md-4 d-flex flex-row-reverse"}>
                  <Link href={`/product/category/${item.id}`}>
                    <a className={"see-child"}>
                      <img alt="Product" src={"../public/images/product.svg"} />
                      Lihat Produk
                    </a>
                  </Link>
                </div>
              )}
            </DivRow>
            {currentIndex === index && isSelected && (
              <DivRow key={`cat-form-${index}`}>
                <EditCategory
                  key={`edit-key-${index}`}
                  data={item}
                  index={categories.length == index ? 0 : index}
                  updateCommand={(e: { data: iCategory; options: string }) => {
                    refreshData(e.data, e.options);
                  }}
                />
              </DivRow>
            )}
          </React.Fragment>
        ))}
    </Layout>
  );
}

type EditCategoryParam = {
  data: iCategory;
  index?: number;
  updateCommand: Function;
};

const EditCategory: React.FunctionComponent<EditCategoryParam> = ({
  data,
  updateCommand,
}) => {
  const [category, setCategory] = useState(initCategory);

  React.useEffect(() => {
    let isLoaded = false;

    const attachData = () => {
      if (!isLoaded) {
        setCategory(data);
      }
    };

    attachData();

    return () => {
      isLoaded = true;
    };
  }, [data]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/category/${category.id}`, {
      method: category.id === 0 ? "POST" : "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(category),
    });

    const cat: any = await res.json();

    if (res.status !== 200) {
      alert(cat.message);
    } else {
      updateCommand({
        data: cat,
        options: category.id === 0 ? "insert" : "update",
      });
      setCategory(cat);
    }

    return false;
  };

  const deleteData = async (e: React.MouseEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/category/${category.id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      method: "DELETE",
    });

    const cat: any = await res.json();

    if (res.status !== 200) {
      alert(cat.message);
    } else {
      updateCommand({ data: cat, options: "delete" });
    }

    return false;
  };
  return (
    <form onSubmit={submitForm} className={"form-floating"}>
      <div className="row">
        <div className={"col-md-12"}>
          <label htmlFor={"input-name"} className="form-label">
            Nama Kategori:
          </label>
        </div>
        <div className={"col-md-12 mb-1"}>
          <input
            autoFocus
            type={"text"}
            placeholder={"Ketikkan nama kategori"}
            id={"input-name"}
            value={category.name}
            className={"form-control"}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className={"col-md-12"}>
          <button
            type={"submit"}
            className="btn me-3 btn-primary"
            style={{ width: 90 }}
          >
            Save
          </button>
          <button
            type={"button"}
            disabled={category.id === 0}
            onClick={(e) => deleteData(e)}
            className="btn me-2 btn-danger"
            style={{ width: 90 }}
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
};

const useCategory = () => {
  const baseUrl: any = () => "/api/category";
  const { data, error, mutate } = useSWR<iCategory[], Error>(
    baseUrl,
    categoryFetcher,
    revalidationOptions
  );

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
    reload: mutate,
  };
};
