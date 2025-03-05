# Favish / staffbase-example-render-widget

## Installation

```bash
$ yarn install
```

## Running the app

| Command                     | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `yarn start`                | Starts the development server                              |
| `yarn run build`            | Creates the production build                               |
| `yarn run build:watch`      | Creates the production build and watch for changes         |
| `yarn run test`             | Runs the unit tests                                        |
| `yarn run test:watch`       | Runs the unit tests and watches for changes                |
| `yarn run type-check`       | Checks the codebase on type errors                         |
| `yarn run type-check:watch` | Checks the codebase on type errors and watches for changes |
| `yarn run lint`             | Checks the codebase on style issues                        |
| `yarn run lint:fix`         | Fixes style issues in the codebase                         |

## Config your API endpoint

Copy .env.example to .env and modify the `REACT_APP_API_URL` variable with your API endpoint

## Dynamic Content Rendering and React Hooks in Config Widgets

### Dynamic Content Rendering

#### Current Problem

When retrieving article content via the public API, the content is delivered as HTML. While this HTML includes basic structure, it lacks the embedded JavaScript required to dynamically render plugins and widgets (e.g., photo galleries, videos) within articles. This limitation hinders our ability to display articles dynamically in components such as modals or other contexts where features like filtering, sorting, and interactive elements are needed.

We have identified internal methods that partially mitigate this issue:

- `window.staffbase.content.widgetMgr.prototype._extractWidgets`
- `window.staffbase.content.widgetMgr.prototype._renderWidget`

However, these methods do not fully render complex elements such as photo galleries or videos, leaving the content incomplete in certain scenarios.

##### Example Scenarios

1. **Rendering Inside Staffbase Content `<div>`**
   When rendering content within the designated Staffbase content `<div>`, we can call internal widget rendering functions. However, these functions are unofficial, undocumented, and subject to change without notice, making them unreliable for long-term use.

2. **Rendering Outside Staffbase Content `<div>` (e.g., in a Modal)**
   When rendering an article in a custom location, such as a modal outside the Staffbase content `<div>`, no plugins or widgets are displayed. This restricts customization and flexibility in how and where content can be presented.

#### Steps to Reproduce

1. Select an article containing widgets or plugins (e.g., photo galleries, videos).
2. Click the "Force Render" button while inside the Staffbase content `<div>`:
   - **Result**: Plugins and widgets render correctly because the rendering occurs within the Staffbase context.
3. Click the "Open Modal" button to display the article in a modal (outside the Staffbase content `<div>`).
4. Click the "Force Render" button again:
   - **Result**: Plugins and widgets fail to render, showing only static HTML without dynamic functionality.

#### Request

We propose the addition of an official, documented method to dynamically render article content, such as:
**`window.staffbase.renderArticle(articleContent)`**
This function should:

- Accept article content (e.g., HTML) as input.
- Fully render all article components—including plugins, widgets, photo galleries, and videos—within a specified container (e.g., a `<div>`).
- Work consistently, regardless of the placement of the container in the DOM, to enable greater customization and flexibility.

---

### Using React Hooks in Config Widgets

#### Current Problem

When developing custom configuration widgets using React components, we encounter issues when attempting to use React hooks such as `useEffect` or `useState`. These hooks cause the component to fail, preventing us from building dynamic and interactive configuration interfaces for clients.

There is no available documentation addressing this behavior, leaving us uncertain whether:

- This is an intentional limitation of the Staffbase platform.
- There are alternative approaches to achieve the desired functionality.
- Additional resources or guidelines exist that we have not yet discovered.

#### Steps to Reproduce

1. Inside the .env file, set the environment variable `REACT_APP_ENABLE_PROBLEMATIC_SELECT_EXAMPLE` to `true`.
2. Build and upload the widget to Staffbase.
3. Attempt to open the widget settings:
   - **Result**: A fatal error occurs, and the configuration interface fails to load.

#### Impact

The inability to use React hooks restricts our capacity to create modern, stateful configuration interfaces that meet client needs. This limitation reduces the interactivity and usability of custom widgets.

#### Request

We seek clarification and support on the following:

- Is the inability to use React hooks (e.g., `useEffect`, `useState`) in config widgets a known limitation of the Staffbase platform?
- Are there recommended workarounds or alternative methods to implement dynamic behavior in config widgets?
- Can you provide documentation or direct us to resources that explain how to build advanced configuration interfaces within the current framework?

---

### Additional Request: TypeScript Types in the Plugin Library

Furthermore, we would like the plugin library to include TypeScript types for API responses such as "Article", "Channel", and similar entities, along with their available fields. This would spare developers from having to manually create these types, ensuring they remain up-to-date with Staffbase’s changes.

By providing these types, we could easily detect if a field has been removed or modified through a simple type check, enhancing code robustness and maintainability.

### Conclusion

Addressing these challenges—dynamic content rendering and React hooks in config widgets—would significantly enhance our ability to deliver flexible, interactive, and robust solutions to clients. We look forward to your guidance, whether through official APIs, documentation, or recommended practices, to resolve these issues effectively.
