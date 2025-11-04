# Adding New Fields to Page Types

This guide explains how to add new fields to page types in the Belle Meade CMS. The system uses Sanity CMS with a Next.js frontend, and follows a modular architecture where page types can have different sections.

## Architecture Overview

The page type system consists of four main parts:

1. **Page Type Schema** (`src/sanity/schemaTypes/pageType.ts`) - Defines page document structure and conditionally shows fields based on `pageType`
2. **Section Schemas** (`src/sanity/schemaTypes/sections/`) - Reusable section components that can be used across different page types
3. **GROQ Queries** (`src/sanity/lib/queries.ts`) - Fetches page data conditionally based on page type
4. **Dynamic Page Component** (`src/components/DynamicPage.tsx`) - Maps page data to React components for rendering

## Adding a New Field to an Existing Page Type

### Step 1: Add the Field to the Page Type Schema

Open `src/sanity/schemaTypes/pageType.ts` and add your new field in the appropriate section for your page type.

**Example: Adding a new field to the "homepage" page type**

```typescript
// Homepage specific fields
defineField({
  name: 'homepageHero',
  title: 'Hero',
  type: 'homeHeroMedia',
  hidden: ({ document }) => document?.pageType !== 'homepage',
}),
// Add your new field here
defineField({
  name: 'homepageNewField',
  title: 'New Field',
  type: 'string', // or another type like 'image', 'text', etc.
  hidden: ({ document }) => document?.pageType !== 'homepage',
}),
```

**Key points:**
- Use the naming convention: `{pageType}{FieldName}` (e.g., `homepageNewField`, `shoppingNewField`)
- Always include the `hidden` property to conditionally show/hide the field based on `pageType`
- Use `defineField` from Sanity for proper typing

### Step 2: Add the Field to the GROQ Query

Open `src/sanity/lib/queries.ts` and add your field to the appropriate conditional block in the `pageQuery`.

**Example: Adding the same field to the query**

```typescript
// Homepage fields
pageType == "homepage" => {
  homepageHero { ... },
  homepageLinkTiles { ... },
  // Add your new field here
  homepageNewField
},
```

**Key points:**
- Place the field in the correct conditional block matching your page type
- For simple fields (strings, numbers, booleans), just add the field name
- For complex fields (objects, arrays, references), you'll need to specify nested fields

### Step 3: Update DynamicPage Component (if needed)

If your field is a **section** (uses a component), you need to update `src/components/DynamicPage.tsx`:

1. **Import the component** (if it's a new section type):
```typescript
import NewSectionComponent from './NewSectionComponent'
```

2. **Add it to the sectionComponents object**:
```typescript
const sectionComponents = {
  // ... existing components
  newSection: NewSectionComponent,
}
```

3. **Add it to the getSections() function** in the appropriate case:
```typescript
case 'homepage':
  addSection(sections, page.homepageHero, 'homeHeroMedia', 'homepage-hero')
  addSection(sections, page.homepageNewField, 'newSection', 'homepage-new-field')
  break
```

**Key points:**
- Use `addSection()` helper function for section fields
- The second parameter is the page data field
- The third parameter is the component key (matches `sectionComponents`)
- The fourth parameter is a unique `_key` for React rendering

## Adding a New Section Type

If you want to create a reusable section that can be used across multiple page types:

### Step 1: Create the Section Schema

Create a new file in `src/sanity/schemaTypes/sections/` (e.g., `newSection.ts`):

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'newSection',
  title: 'New Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richPortableText',
    }),
    // Add more fields as needed
  ],
})
```

### Step 2: Register the Section Schema

Add the import and export to `src/sanity/schemaTypes/index.ts`:

```typescript
import newSection from './sections/newSection'

export const schemaTypes = [
  // ... existing types
  newSection,
]
```

### Step 3: Create the React Component

Create a new component in `src/components/NewSection.tsx`:

```typescript
interface NewSectionProps {
  heading?: string
  body?: PortableTextBlock[]
  // Add other props based on your schema
}

export default function NewSection({ heading, body }: NewSectionProps) {
  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {/* Render body content */}
    </section>
  )
}
```

### Step 4: Add to Page Type (if needed)

Follow the steps in "Adding a New Field to an Existing Page Type" to add this section to a page type.

## Adding a New Page Type

To create an entirely new page type:

### Step 1: Add Page Type Option

In `src/sanity/schemaTypes/pageType.ts`, add the new option to the `pageType` field:

```typescript
defineField({
  name: 'pageType',
  type: 'string',
  options: {
    list: [
      // ... existing options
      { title: 'New Page Type', value: 'newPageType' },
    ],
  },
}),
```

### Step 2: Add Page Type Specific Fields

Add a new section for your page type fields:

```typescript
// New Page Type specific fields
defineField({
  name: 'newPageTypeHero',
  title: 'Hero',
  type: 'heroMedia',
  hidden: ({ document }) => document?.pageType !== 'newPageType',
}),
defineField({
  name: 'newPageTypeSection',
  title: 'Section',
  type: 'someSection',
  hidden: ({ document }) => document?.pageType !== 'newPageType',
}),
```

### Step 3: Add to GROQ Query

In `src/sanity/lib/queries.ts`, add a new conditional block:

```typescript
// New Page Type fields
pageType == "newPageType" => {
  newPageTypeHero {
    layout,
    desktopTitle,
    // ... include all fields needed for this section
  },
  newPageTypeSection {
    // ... include all fields needed
  }
},
```

### Step 4: Add to DynamicPage Component

In `src/components/DynamicPage.tsx`, add a new case to the `getSections()` function:

```typescript
case 'newPageType':
  addSection(sections, page.newPageTypeHero, 'heroMedia', 'new-page-type-hero')
  addSection(sections, page.newPageTypeSection, 'someSection', 'new-page-type-section')
  break
```

## Common Field Types

### Simple Fields

```typescript
// String
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'string',
})

// Number
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'number',
})

// Boolean
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'boolean',
})

// Text (multi-line)
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'text',
})
```

### Media Fields

```typescript
// Image
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'image',
  options: {
    hotspot: true, // Enable focal point selection
  },
})

// Video (file)
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'file',
  options: {
    accept: 'video/mp4',
  },
})
```

### Rich Content

```typescript
// Rich text (Portable Text)
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'richPortableText', // Uses the custom richPortableText type
})

// Array of items
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        // Define array item fields
      ],
    },
  ],
})
```

### Conditional Fields

Fields can be hidden based on parent values:

```typescript
defineField({
  name: 'fieldName',
  title: 'Field Title',
  type: 'string',
  hidden: ({ parent }) => parent?.someOtherField !== 'expectedValue',
})
```

## Query Fragments

The query file includes reusable fragments for common patterns:

- `imageFragment` - Standard image fields
- `videoFragment` - Standard video fields
- `linkFragment` - Link/CTA fields
- `mediaFragment` - Media type selection fields

Use these fragments in your queries for consistency:

```typescript
newPageTypeField {
  heading,
  image ${imageFragment},
  video ${videoFragment},
  cta ${linkFragment}
}
```

## Best Practices

1. **Naming Conventions**
   - Page type fields: `{pageType}{FieldName}` (camelCase)
   - Section types: `camelCase` matching the component name
   - React components: `PascalCase`

2. **Field Visibility**
   - Always use `hidden` property to conditionally show fields based on `pageType`
   - This keeps the Sanity Studio clean and prevents confusion

3. **Query Optimization**
   - Only fetch fields needed for the specific page type
   - Use conditional queries (`pageType == "..." =>`) to avoid fetching unnecessary data
   - Reuse fragments for consistency

4. **Component Mapping**
   - Map section types to React components in `DynamicPage.tsx`
   - Use unique `_key` values for each section instance
   - Handle special cases (like `heroMedia`) with explicit prop extraction

5. **Type Safety**
   - Always use `defineField` from Sanity for proper TypeScript support
   - Ensure React component props match the schema structure
   - Use proper TypeScript types in components

## Troubleshooting

### Field Not Showing in Sanity Studio
- Check that `hidden` property is correctly set
- Verify the `pageType` value matches exactly (case-sensitive)
- Restart the Sanity Studio development server

### Data Not Rendering on Frontend
- Verify the field is included in the GROQ query
- Check that the field name matches between schema and query
- Ensure the component is properly imported and mapped in `DynamicPage.tsx`

### Type Errors
- Run `npm run dev` to regenerate TypeScript types
- Check that all imports are correct
- Verify schema types are exported in `index.ts`

## Examples

See existing implementations for reference:

- **Simple field**: `homepageHero` → `homeHeroMedia` section
- **Reusable section**: `heroMedia` section used across multiple page types
- **Complex section**: `leasingMap` section with nested arrays and objects
- **Conditional rendering**: `textWithArtefacts` with layout-dependent fields

## Need Help?

- Check existing section implementations in `src/sanity/schemaTypes/sections/`
- Review how fields are queried in `src/sanity/lib/queries.ts`
- See how components are rendered in `src/components/DynamicPage.tsx`

