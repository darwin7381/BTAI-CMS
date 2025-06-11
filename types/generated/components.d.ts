import type { Schema, Struct } from '@strapi/strapi';

export interface ContentArticleLink extends Struct.ComponentSchema {
  collectionName: 'components_content_article_links';
  info: {
    description: '\u6587\u7AE0\u9023\u7D50\u7D44\u4EF6';
    displayName: 'Article Link';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.article-link': ContentArticleLink;
    }
  }
}
