import { Channel } from './Channel'

/**
 * Interface for full (partial) article data with support for localized content.
 *
 * NOTE: This is a partial interface, it is not complete and may change in the future by Staffbase.
 * Mainly is used for avoid TypeScript errors when using the ArticleData in the Article component.
 * @interface ArticleData
 */
interface ArticleData {
  acknowledgements?: Aknowledgements
  acknowledgingAllowed: boolean
  acknowledgingEnabled: boolean
  astContents?: Record<string, any> | null
  authorId: string | null
  authorID?: string | null
  branchID?: string | null
  channelID: string | null
  channel?: Channel
  commentingAllowed: boolean
  commentingEnabled: boolean
  commentsCount?: number
  contentType: string
  contents: Record<string, LocalizedContent> // Localized content keyed by language codes.
  created?: Date
  highlighted: boolean
  id: string
  likesCount?: number
  likingAllowed: boolean
  layout?: {
    primaryMedia?: string
  }
  publicationStatus?: string
  published: string | null
  updatedDate?: Date | null
  updated: string | null
  rights: string[]
  sharingAllowed: boolean | null
  sharingEnabled: boolean
  internalSharingAllowed?: boolean
  internalSharingEnabled?: boolean
  externalSharingAllowed?: boolean
  externalSharingEnabled?: boolean
  unpublished?: Date | null
  useBigFeedMedia?: boolean
  entityType?: string
  links: {
    [key: string]: {
      method: string
      href: string
      parameters?: Record<string, any>
      form?: Array<Record<string, any>>
    }
  }
}

/**
 * Interface for localized content within the `contents` property.
 * @interface LocalizedContent
 * @property {string} title - The title of the article in the given language.
 * @property {string} teaser - A short summary or teaser of the article in the given language.
 * @property {string} content - The main content of the article in the given language.
 * @property {Image | null} image - The URL of the image for the article in the given language.
 * @property {string | null} feedImage - Optional feed image for the article in the given language.
 */
export interface LocalizedContent {
  title: string
  teaser: string
  content: string
  image: Image | string | null
  feedImage: string | null
}

/**
 * Interface for acknowledgements within the `acknowledgements` property.
 * @interface Aknowledgements
 * @property {boolean} isAcknowledged - Whether the article has been acknowledged.
 * @property {number} total - Total number of acknowledgements.
 */
export interface Aknowledgements {
  isAcknowledged: boolean
  total?: number
}

type ImageVariant = {
  width: number
  height: number
  size?: number // Only present in the "original" variant
  format: string | null
  mimeType: string | null
  url: string
}

type Image = {
  original: ImageVariant & { size: number } // "size" is specific to "original"
  original_scaled: ImageVariant
  thumb: ImageVariant
  wide: ImageVariant
  compact: ImageVariant
  wide_first: ImageVariant
  compact_first: ImageVariant
}

export default ArticleData
