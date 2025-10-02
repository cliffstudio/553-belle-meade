import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('press').title('Press'),
      S.documentTypeListItem('testimonials').title('Testimonials'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['page', 'press', 'testimonials'].includes(item.getId()!),
      ),
    ])
