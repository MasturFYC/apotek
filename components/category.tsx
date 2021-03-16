import Link from 'next/link'

export default function Category({ category }: any) {
  return (
    <li>
      <Link href="/category/[id]" as={`/category/${category.id}`}>
        <a>{category.name}</a>
      </Link>
    </li>
  )
}