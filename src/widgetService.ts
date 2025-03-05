import { RefObject } from 'react'

/**
 * Renders the widgets in the given container with smart retries.
 *
 * Note: This is a hack to render the widgets in the accordion.
 *
 * The widget manager is not available publicly, so we need to access it via the global object.
 * This is a temporary solution until the widget manager is made public.
 *
 * If this broke in the future, you should recheck the widget manager implementation.
 * @param {RefObject<HTMLDivElement | null>} containerRef - A reference to the container element
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} retryDelay - Delay between retries in milliseconds
 * @returns {Promise<void>} - A promise that resolves when the widgets are rendered
 */
export const renderWidgets = async (
  containerRef: RefObject<HTMLDivElement | null>,
  maxRetries: number = 10,
  retryDelay: number = 300,
): Promise<void> => {
  if (!containerRef || !containerRef.current) {
    console.error('Render Widget: Container ref is null or undefined')
    return
  }

  let attempts = 0
  let widgetManagerAvailable = true

  /**
   * Attempts to render widgets once
   * @returns {Promise<boolean>} - True if rendering succeeded, false otherwise
   */
  const attemptRender = async (): Promise<boolean> => {
    try {
      // Get the widget manager from the global object (using the Staffbase API)
      // @ts-expect-error - window.staffbase is defined in the global scope
      const widgetMgr = window.staffbase?.content?.widgetMgr?.prototype

      // Check if the widget manager is available
      if (!widgetMgr) {
        console.error(
          'Widget Manager is not available. Are you in development mode?',
        )
        widgetManagerAvailable = false
        return false
      }

      // Check if the required methods exist
      if (
        typeof widgetMgr._extractWidgets !== 'function' ||
        typeof widgetMgr._renderWidget !== 'function'
      ) {
        console.error('Required widget manager methods are not available')
        widgetManagerAvailable = false
        return false
      }

      // Check if the widget manager has widgets if not, create an empty array
      if (!widgetMgr._widgets || !Array.isArray(widgetMgr._widgets)) {
        widgetMgr._widgets = []
      }

      // Use the ref as the container for the widgets
      const widgetContainer = containerRef.current

      // Extract the widgets from the container (using the Staffbase API)
      const widgets = widgetMgr._extractWidgets(widgetContainer)

      if (widgets.length === 0) {
        return false
      }

      // Render each found widget (using the Staffbase API)
      widgets.forEach((widget: never) => {
        try {
          // Render the widget
          widgetMgr._renderWidget.call(widgetMgr, widgetContainer, widget)
        } catch (error) {
          console.error('Error rendering widget:', error)
        }
      })

      return true
    } catch (error) {
      console.error('Error rendering widgets:', error)
      // Check if the error indicates that the widget manager functions don't exist
      if (
        error instanceof TypeError &&
        (error.message.includes('is not a function') ||
          error.message.includes('undefined is not a function'))
      ) {
        widgetManagerAvailable = false
      }
      return false
    }
  }

  // Try to render widgets with smart retries
  while (attempts < maxRetries) {
    attempts++
    const renderResult = await attemptRender()

    // If widget manager is not available or required functions don't exist, stop retrying
    if (!widgetManagerAvailable) {
      console.warn(
        'Render Widget: Widget manager not available, stopping retries',
      )
      break
    }

    // If rendering succeeded, we can stop
    if (renderResult) {
      break
    }

    // If we've reached the maximum number of attempts, stop
    if (attempts >= maxRetries) {
      break
    }

    // Wait before the next attempt
    await new Promise((resolve) => setTimeout(resolve, retryDelay))
  }
}
