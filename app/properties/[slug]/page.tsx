import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProperty(slug: string) {
  const query = `*[_type == "property" && slug.current == $slug][0] {
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    sqm,
    eligibleForCitizenship,
    mainImage,
    gallery,
    description
  }`
  return await client.fetch(query, { slug })
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) return notFound()

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-500 text-lg mb-4">{property.location}</p>
      
      {property.mainImage && (
        <img
          src={urlFor(property.mainImage).width(1200).height(600).url()}
          alt={property.title}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6 text-center">
        <div>
          <span className="block text-gray-500 text-sm">Price</span>
          <span className="font-bold text-lg text-emerald-600">${property.price?.toLocaleString()}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Bedrooms</span>
          <span className="font-bold text-lg">{property.bedrooms || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Bathrooms</span>
          <span className="font-bold text-lg">{property.bathrooms || 'N/A'}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Area</span>
          <span className="font-bold text-lg">{property.sqm ? `${property.sqm} m²` : 'N/A'}</span>
        </div>
      </div>

      {property.description && (
        <div className="prose max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-2">About this property</h2>
          <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
        </div>
      )}
    </main>
  )
}