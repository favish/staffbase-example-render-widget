import { ArticleData } from '@/types/ArticleData'
import { Channel } from '@/types/Channel'
import type DropdownOption from '@/types/DropdownOption'

/**
 * Fetch data from a given API URL.
 * @template T The type of the data to be returned (e.g., Channel, ArticleData).
 * @param {string} url - The API URL to fetch data from.
 * @returns {Promise<T>} A promise that resolves to the fetched data.
 */
const fetchAPI = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, { credentials: 'include' })

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching API data:', error)
    throw error
  }
}

/**
 * General function to fetch all data from a given API URL with pagination.
 * @template T The type of the items to be returned (e.g., ArticleData, DropdownOption).
 * @param {string} baseUrl - The base API URL to fetch data from (without limit and offset parameters).
 * @param {(item: unknown) => T | null} [mapFunction] - An optional mapping function to transform each item.
 * @param {number} [limit] - The maximum number of items to fetch per request (default is 50).
 * @returns {Promise<T[]>} A promise that resolves to a list of items of type T.
 */
const fetchAllData = async <T>(
  baseUrl: string,
  mapFunction?: (item: unknown) => T | null,
  limit: number = 50,
): Promise<T[]> => {
  const results: T[] = []

  // Initialize the offset and total
  let offset = 0
  let total = 0

  try {
    do {
      // Check if the URL contains a question mark
      const separator = baseUrl.includes('?') ? '&' : '?'

      // Append the limit and offset parameters to the URL
      const url = `${baseUrl}${separator}includeDrafts=true&limit=${limit}&offset=${offset}`

      // Fetch the data from the API
      const data = await fetchAPI<{ data: any[]; total: number }>(url)

      // Return if no data is found
      if (!data.data || data.data.length === 0) {
        break
      }

      // Map the data to type T if provided
      const mappedData = mapFunction
        ? data.data
            .map(mapFunction)
            .filter((item: T | null): item is T => item !== null)
        : (data.data as T[])

      // Add the mapped data to the results
      results.push(...mappedData)

      // Update the total and offset
      total = data.total

      // Increment the offset by the limit
      offset += limit
    } while (offset < total)
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }

  return results
}

/**
 * Fetches all available channels from the API, handling pagination.
 * @returns {Promise<DropdownOption[]>} - A promise that resolves to a list of channel options.
 */
export const fetchChannels = async (): Promise<DropdownOption[]> => {
  const baseUrl = `${process.env.REACT_APP_API_URL}/channels?contentType=articles`

  return fetchAllData<DropdownOption>(baseUrl, (item: unknown) => {
    const channel = item as Channel
    // Get the title from the localization object
    const title =
      channel?.config?.localization?.[
        process.env.REACT_APP_DEFAULT_LANGUAGE as string
      ]?.title

    // Only return the option if the title exists
    return title ? { id: channel.id, title } : null
  })
}

/**
 * Fetches a single channel based on the given ID.
 * @param {string} channelId - The ID of the channel to fetch.
 * @returns {Promise<Channel>} - A promise that resolves to the channel data.
 */
export const fetchChannel = async (channelId: string): Promise<Channel> => {
  const url = `${process.env.REACT_APP_API_URL}/channels/${channelId}`

  // Reuse fetchAPI for single requests
  return fetchAPI<Channel>(url)
}

/**
 * Fetches articles from the API for a given channel
 * @param {string} channelId - The ID of the channel to fetch articles from
 * @returns {Promise<ArticleData[]>} A promise that resolves to an array of articles
 */
export const fetchArticles = async (channelId: string): Promise<ArticleData[]> => {
  const baseUrl = `${process.env.REACT_APP_API_URL}/channels/${channelId}/articles`

  return fetchAllData<ArticleData>(baseUrl, (item: unknown) => {
    const article = item as ArticleData
    return determinePublicationStatus(article) ? article : null
  })
}

/**
 * Determine the publication status of an article.
 * @param {ArticleData} articleData - The article data.
 * @returns {boolean} - The publication status (true for published, false for unpublished).
 */
const determinePublicationStatus = (articleData: ArticleData): boolean => {
  const now = new Date()
  const publishedDate = articleData.published
    ? new Date(articleData.published)
    : null
  const unpublishedDate = articleData.unpublished
    ? new Date(articleData.unpublished)
    : null

  if (!publishedDate || (publishedDate && now < publishedDate)) {
    return false
  }
  if (unpublishedDate && now >= unpublishedDate) {
    return false
  }
  return true
}

/**
 * Acknowledges an article with the given ID.
 * @param {string} id - The ID of the article to acknowledge.
 * @returns {Promise<void>} - A promise that resolves when the acknowledgement is successful.
 */
export const acknowledgeArticle = async (id: string): Promise<void> => {
  // Get the CSRF token from the global object
  // @ts-expect-error - "we" is defined in the global scope
  const csrfToken = we?.authMgr?.getCsrfToken() ?? ''

  // Make a POST request to acknowledge the article
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/posts/${id}/acknowledgements`,
    {
      method: 'POST',
      headers: {
        'X-Csrf-Token': csrfToken,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      credentials: 'include', // To include the `cookie` header for session authentication
    },
  )

  if (!response.ok) {
    throw new Error(
      `Failed to acknowledge article ${id}: ${response.statusText}`,
    )
  }
}

/**
 * Fetches a specific article by its ID.
 * @param {string} articleId - The ID of the article to fetch.
 * @returns {Promise<ArticleData>} - A promise that resolves to the article data.
 */
export const fetchArticleById = async (
  articleId: string,
): Promise<ArticleData> => {
  const url = `${process.env.REACT_APP_API_URL}/posts/${articleId}`
  return fetchAPI<ArticleData>(url)
}
