'use strict';

/**
 * wordpress-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::wordpress-setting.wordpress-setting');
