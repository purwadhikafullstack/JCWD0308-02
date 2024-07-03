export default function ProductDetail({ params }: { params: { slug: string } }) {
  return <h1>Product detail page of {params.slug}</h1>;
}
