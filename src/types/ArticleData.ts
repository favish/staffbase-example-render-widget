import { Channel } from './Channel'

/**
 * Interface for localized content within the `contents` property.
 * @interface LocalizedContent
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
 * @interface Acknowledgements
 */
export interface Acknowledgements {
  isAcknowledged: boolean
  total?: number
}

/**
 * Type definition for image variants
 * @interface ImageVariant
 */
export interface ImageVariant {
  width: number
  height: number
  size?: number
  format: string | null
  mimeType: string | null
  url: string
}

/**
 * Type definition for image object
 * @interface Image
 */
export interface Image {
  original: ImageVariant & { size: number }
  original_scaled: ImageVariant
  thumb: ImageVariant
  wide: ImageVariant
  compact: ImageVariant
  wide_first: ImageVariant
  compact_first: ImageVariant
}

/**
 * Interface for full article data with support for localized content.
 * @interface ArticleData
 */
export interface ArticleData {
  acknowledgements?: Acknowledgements
  acknowledgingAllowed: boolean
  acknowledgingEnabled: boolean
  astContents?: Record<string, unknown> | null
  authorId: string | null
  authorID?: string | null
  branchID?: string | null
  channelID: string | null
  channel?: Channel
  commentingAllowed: boolean
  commentingEnabled: boolean
  commentsCount?: number
  contentType: string
  contents: Record<string, LocalizedContent>
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
      parameters?: Record<string, unknown>
      form?: Array<Record<string, unknown>>
    }
  }
}
