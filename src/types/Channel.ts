type Localization = {
  [locale: string]: {
    title: string
    description: string | null
  }
}

type Config = {
  localization: Localization
  sidebarVisible: boolean
  showPageBackground: boolean
  showAdminActions: boolean
}

type Layout = {
  primaryMedia: string
}

type Parameter = {
  type: string
  id: string
  format?: string
  value?: string | number
  required: boolean
}

type Link = {
  method: string
  href: string
  parameters?: {
    [key: string]: Parameter
  }
  form?: Parameter[]
}

type Links = {
  preview: Link
  create_post: Link
  move: Link
  accessors: Link
  available_news_pages: Link
  get_posts: Link
  menu_items: Link
  update: Link
  feeds: Link
  delete: Link
  users: Link
  update_news_pages: Link
}

export type Channel = {
  pluginID: string
  menuFolderIDs: string[]
  defaultMenuFolderId: string
  config: Config
  availableInPublicArea: boolean
  contentType: string
  notificationChannelsAllowed: string[] | null
  notificationChannelsDefault: string[]
  postCount: number
  id: string
  spaceID: string
  visibleInPublicArea: boolean
  displayAuthor: boolean
  acknowledgingAllowed: boolean
  commentingAllowed: boolean
  highlightingAllowed: boolean
  layout: Layout
  likingAllowed: boolean
  sharingAllowed: boolean
  internalSharingAllowed: boolean
  externalSharingAllowed: boolean
  lastPostPublishedAt: string
  commentingEnabledDefault: boolean
  highlightingEnabledDefault: boolean
  likingEnabledDefault: boolean
  sharingEnabledDefault: boolean
  acknowledgingEnabledDefault: boolean
  internalSharingEnabledDefault: boolean
  externalSharingEnabledDefault: boolean
  published: string
  created: string
  entityType: string
  updated: string
  links: Links
  rights: string[]
}
