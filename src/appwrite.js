import { Client, Databases, ID, Query } from "appwrite"

const APPWRITE_ID=import.meta.env.VITE_APPWRITE_ID
const APPWRITE_DB_ID=import.meta.env.VITE_APPWRITE_DB_ID
const APPWRITE_TRENDS_COLLECTION_ID=import.meta.env.VITE_APPWRITE_TRENDS_COLLECTION_ID

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(APPWRITE_ID)

const database = new Databases(client);

// this function to track the trending movies that user search for the most 
// has a searchWord (which is the word that user search for) and movie (which is the movie info and details (first one shown)) as arguments
export const updateTrend = async (searchWord, movie) => {
    // check if the searchWord is stored in the database 
    
    try{
        const result = await database.listDocuments(APPWRITE_DB_ID, APPWRITE_TRENDS_COLLECTION_ID, [
            Query.equal('searchWord', searchWord),
        ])
        
        // ? if yes then update the count of the searchWord by 1 
        if (result.documents.length > 0) {
            const doc =result.documents[0]

            await database.updateDocument(APPWRITE_DB_ID, APPWRITE_TRENDS_COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        }
        else{
        // : if not then create a new document with the searchWord and count = 1
            await database.createDocument(APPWRITE_DB_ID, APPWRITE_TRENDS_COLLECTION_ID, ID.unique(), {
                searchWord,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id: movie.id,
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const getTrends = async () => {
    try {
        const result = await database.listDocuments(APPWRITE_DB_ID, APPWRITE_TRENDS_COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(10),
        ])
        if (result.documents.length === 0) {
            return []
        }
        return result.documents
    } catch (error) {
        console.error(error)
    }
}