import Link from 'next/link'
import { client } from '../sanity/lib/client'
import { urlFor } from '../sanity/lib/image'

interface Property {
  _id: string
  title: string
  slug?: { current: string }
  price: number
  location: string
  eligibleForCitizenship: boolean
  image?: any
}

async function getProperties(): Promise<Property[]> {
  const query = `*[_type == "property"] {
    _id,
    title,
    slug,
    price,
    location,
    eligibleForCitizenship,
    image
  }`
  return await client.fetch(query)
}

export default async function HomePage() {
  const properties = await getProperties()

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Turkey Citizenship Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => {
          const href = property.slug?.current ? `/properties/${property.slug.current}` : '#'

          return (
            <Link key={property._id} href={href} className="group">
              <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden h-full">
                {property.image && (
                  <img
                    src={urlFor(property.image).width(600).height(400).url()}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-md mb-4 group-hover:scale-105 transition-transform duration-200"
                  />
                )}

                <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h2>
                <p className="text-gray-600 font-medium my-1">{property.location}</p>
                <p className="text-emerald-600 font-bold text-lg">
                  ${property.price?.toLocaleString()}
                </p>
                
                {property.eligibleForCitizenship && (
                  <span className="inline-block mt-3 bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    ✓ Citizenship Eligible
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}