import Head from "next/head";
import React, { useState } from "react";
import useSWR from "swr";
import Layout, { siteTitle } from "../../components/layout";
import { iSupplier } from "../../components/interfaces";
import { SupplierList } from "../../components/lists/supplier-list";

const Home: React.FunctionComponent = () => {
  const {
    data: suppliers,
    error,
    mutate,
  } = useSWR<iSupplier[]>(`/api/supplier`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  //  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])

  if (error) return <div>{error.message}</div>;
  if (!suppliers) return <div>{"Loading..."}</div>;

  const selectSupplier = (i: number) => {
    setIsSelected(i === currentIndex ? !isSelected : true);
    setCurrentIndex(i);
  };

  const refreshSupplier = async (
    method: string,
    sup: iSupplier,
    callback: Function
  ) => {
    const url = `/api/supplier/${sup.id}`;
    const fetchOptions = {
      method: method,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(sup),
    };

    const res = await fetch(url, fetchOptions);
    const data: iSupplier | any = await res.json();

    if (res.status === 200) {
      switch (method) {
        case "DELETE":
          {
            mutate(
              suppliers.filter((item) => item.id !== sup.id),
              false
            );
            setCurrentIndex(-1);
          }
          break;
        case "POST":
          {
            mutate([...suppliers, data], false);
            setCurrentIndex((suppliers && suppliers?.length + 1) || -1);
          }
          break;
        case "PUT":
          {
            suppliers.splice(currentIndex, 1, data);
            mutate(suppliers, false);
          }
          break;
      }
      callback(data);
    } else {
      callback(null);
      alert(data.message);
    }
  };

  return (
    <Layout home menuActive={4} heading={"Data Supplier"}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {suppliers &&
        [
          ...suppliers,
          {
            id: 0,
            name: "",
            contactName: "",
            street: "",
            city: "",
            phone: "",
          },
        ].map((item: iSupplier, i: number) => {
          return (
            <SupplierList
              key={`sup-key-${i}`}
              data={item}
              index={i}
              isSelected={isSelected && currentIndex === i}
              refreshData={refreshSupplier}
              property={{ onClick: selectSupplier }}
            />
          );
        })}
    </Layout>
  );
};

const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data: any = await res.json();

  if (res.status !== 200) {
    return alert(data.message);
  }

  return data;
};

export default Home;
