import Link from 'next/link'
import { client } from '../sanity/lib/client'
import { urlFor } from '../sanity/lib/image'

// Disable static caching so edits in Sanity Studio reflect instantly
export const revalidate = 0

interface Property {
  _id: string
  title: string
  slug?: { current: string }
  price: number
  location: string
  eligibleForCitizenship: boolean
  gallery?: any[]
  image?: any
}

async function getProperties(): Promise<Property[]> {
  // Query both possible document types and explicitly request gallery asset references
  const query = `*[_type in ["property", "propertyListing"]] {
    _id,
    title,
    slug,
    price,
    location,
    eligibleForCitizenship,
    "gallery": gallery[] {
      asset,
      alt
    },
    image
  }`
  return await client.fetch(query)
}

export default async function HomePage() {
  const properties = await getProperties()

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Turkey Citizenship Properties</h1>
      
      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => {
            const href = property.slug?.current ? `/properties/${property.slug.current}` : '#'
            
            // Pick the first gallery image that has a valid asset, or fall back to single image
            const coverImage = property.gallery?.find((img) => img?.asset) || property.image

            return (
              <Link key={property._id} href={href} className="group">
                <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden h-full">
                  {coverImage?.asset && (
                    <img
                      src={urlFor(coverImage).width(600).height(400).url()}
                      alt={property.title || 'Property'}
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
      )}
    </main>
  )
}