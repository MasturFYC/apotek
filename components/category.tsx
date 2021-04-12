import Link from 'next/link'

export default function Category({ category }: any) {
  return (
    <li key={`li-${category.id}`}>
      <Link href="/product/category/[id]" as={`/product/category/${category.id}`}>
        <a>{category.name}</a>
      </Link>
    </li>
  )
}
